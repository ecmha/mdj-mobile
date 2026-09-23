# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Persona

When making changes in this repository, act as a **senior React Native developer**: favor idiomatic React Native/TypeScript patterns, respect the existing architecture (Context API for state, the theme/primitives system, the conventions documented below) over introducing new ones, and flag tradeoffs rather than silently picking a side.

Prefer **composition over inheritance/duplication** for components: build screens from small, focused components combined via children/props rather than large monolithic components or copy-pasted variants. Reuse existing theme-aware components (`MText`, `Cta`, `Icon`, etc.) instead of re-implementing them, and extract a shared component only when it removes real duplication — don't over-abstract for a single use site.

## Project Overview

MDJ is a React Native 0.84.1 meditation/devotional mobile app targeting Android and iOS. It serves daily meditation content (in French or English) with text-to-speech audio playback, message sharing, push notifications, theme customization, and multi-language support.

## Commands

```bash
npm start                  # Start Metro bundler (cache reset)
npm run android            # Build and run on Android (NODE_ENV=development)
npm run ios                # Build and run on iOS (NODE_ENV=development)
npm run android:staging    # ...against .env.staging (also android:production, ios:staging, ios:production)
npm run lint               # Run ESLint
npm test                   # Run Jest tests
npm run log-android        # View Android logs
```

Node `>= 22.11.0` (see `engines` in `package.json`).

## Environment

Env vars are injected at build time by `react-native-dotenv` (babel plugin) from `.env.<NODE_ENV>` (`.env.development`, `.env.staging`, `.env.production`; template in `.env.example`) and imported from the `@env` module. Available keys are declared in `src/types.d.ts`: `API_URL`, `ONE_SIGNAL_APP_ID`, `APP_NAME`, etc. `.env.development` points `API_URL` at `http://localhost:5002/api`.

Because values are inlined by Babel, run `npm start` (which resets the cache) after editing a `.env` file.

## Architecture

### Entry points
- **`index.js`**: registers `App` and calls `setupAudio()` (`src/services/audio`) **outside the React lifecycle**. This is intentional, so audio playback and its listeners survive component unmounts when the app is backgrounded.
- **`App.tsx`**: calls `useOneSignalInit()` and mounts the provider tree (see State Management).

### Navigation (`src/Navigation.tsx`)
React Navigation Native Stack with a typed `RootStackParamList`. Navigation flow:
- First launch: `SplashScreen` → `Welcome` → `Home`
- Returning user: `SplashScreen` → `Home`

`SplashScreen` reads `STORAGE_KEYS.SHOW_WELCOME` from AsyncStorage and navigates directly, with no context involved. `Welcome` calls `navigation.replace('Home')` after onboarding.

Routes: `SplashScreen`, `Welcome`, `Home`, `Settings`, `Supremat`, `ThemeSetting`, `LanguageSetting`, `Suggestion`, `Login`, `Signup`, `ForgotPassword`, `ResetPassword`, `MyInformations`, `Bookmarks`, `BookmarkMessage`

`AuthPromptModal` is rendered by `HomeLayout` and `DefaultLayout`. Add it to any other layout whose screen calls `requireAuth()`. Every mounted copy shares the same `promptVisible`; only the focused screen's copy is visible. `Login` / `Signup` `goBack()` on success, so the user returns to the screen that opened the prompt (Home or Settings).

Screen transitions: `Settings`, `Login`, `Signup` and `ResetPassword` slide from bottom; `ForgotPassword` and `BookmarkMessage` slide from right; `Supremat`, `ThemeSetting`, `LanguageSetting`, `Suggestion`, `MyInformations`, `Bookmarks` slide from left.

### State Management
Context API only (no Redux or Zustand).
- **ThemeContext** (`src/contexts/themeProvider.tsx`): light/dark theme, persisted to AsyncStorage
- **WelcomeContext** (`src/contexts/welcomeProvider.tsx`): tracks whether onboarding was completed, persisted to AsyncStorage
- **LanguageContext** (`src/contexts/languageProvider.tsx`): active language (`SupportedLanguage` = `'fr'` | `'en'`, exported from `src/i18n`), persisted to AsyncStorage, synced with i18next
- **AudioPlayerContext** (`src/contexts/audioPlayerProvider.tsx`): TTS playback actions (`play`, `togglePlayPause`, `close`) plus `isDownloading` / `error` / `barHeight`. See Audio Playback.
- **AuthContext** (`src/contexts/authProvider.tsx`): reader account session (`user`, `accessToken`, `isAuthenticated`, `login`, `signup`, `logout`), persisted as JSON under `STORAGE_KEYS.AUTH_SESSION`. Also owns the sign-in prompt: `requireAuth(action)` runs `action` when signed in, otherwise opens `AuthPromptModal` (`promptVisible` / `closePrompt`). `openPrompt()` opens it with no action to run — for a session that turns out to be dead mid-request (a 401), where `requireAuth` would still see the stale session and run the action. The prompt stays open while the user visits `Login` / `Signup` and closes when a session opens. Read it with `useAuth()`.
- **BookmarksContext** (`src/contexts/bookmarksProvider.tsx`): which messages the reader has saved, as a `messageId → bookmark id | null` cache (a missing entry means "not looked up yet"). `ensureStatus(id)` does one lazy, cached `GET /bookmarks?messageId=…` per viewed message — guests skip it, since the route 401s. `save(id)` is **add-only** and optimistic: the icon fills on the tap and empties again if the request fails. It returns `'saved' | 'failed' | 'signed-out'`, and `'signed-out'` needs no toast because the prompt is already up. `setStatus()` is the write-back seam for the future bookmarks list, so a removal there updates Home's icon. The cache clears on every `user._id` change: without that, the next account would inherit the previous reader's filled icons. Read it with `useBookmarks()`.
- **HomeTutorialContext** (`src/contexts/homeTutorialProvider.tsx`): one-shot "swipe to see other messages" hint (`visible`, `requestShow`, `dismiss`), persisted under `STORAGE_KEYS.HOME_TUTORIAL`.

Provider hierarchy in `App.tsx`: `KeyboardProvider` → `ThemeProvider` → `SafeAreaProvider` → `WelcomeProvider` → `LanguageProvider` → `AuthProvider` → `BookmarksProvider` → `AudioPlayerProvider` → `Navigation`

`BookmarksProvider` must stay inside `AuthProvider`: its cache is per account and it resets itself when the session changes.

`KeyboardProvider` (`react-native-keyboard-controller`) must stay outermost: it is what feeds the keyboard frame to `KeyboardAwareScrollView` (see `AuthLayout`).

`AudioPlayerProvider` must stay inside `LanguageProvider`: it clears the player whenever the language changes.

### Theme System (`src/theme/`)
Design token system with utility functions instead of a CSS-in-JS library. Use the primitive helpers for styles:
- `src/theme/primitives/`: `p()`, `m()`, `px()`, `py()`, `flex()`, `bg()`, etc. generate StyleSheet-compatible objects
- `src/theme/variables/colors.ts`: light (warm beige/brown) and dark (cool navy/purple) palettes. Index it directly (`colors[theme].primary`) when a raw color value is needed (e.g. `ActivityIndicator`).
- `DIMENSIONS` (screen/window sizes) and `STATUS_BAR_HEIGHT` are re-exported from `@/theme`
- Access the current theme via the `useTheme()` hook. `MText` and `Cta` are already theme-aware.

### Layouts
- **`src/layouts/HomeLayout.tsx`**: Home-only wrapper. Renders the status bar, two floating CTAs at the top (app icon on the left → `Supremat`, settings icon on the right → `Settings`), and mounts `useNotificationClick()`. Uses `useSafeAreaInsets` for bottom padding.
- **`src/layouts/AuthLayout.tsx`**: `Login` / `Signup` / `ForgotPassword` / `ResetPassword` wrapper: back button, app logo and `title` above the form; an optional `footer` (Signup's legal notice) sits at the end of the scroll content, not pinned, so the keyboard can't cover it.
  - The scroll container is `KeyboardAwareScrollView` from **`react-native-keyboard-controller`**, with `bottomOffset={24}` for the gap between the focused field and the keyboard. It follows the keyboard natively and scrolls the focused input into view on both platforms.
  - An `overlay` prop renders above the form, outside the scroll view — that's where `Login` / `Signup` mount `AuthSuccessModal`.
  - Don't go back to `KeyboardAvoidingView` here: Android's edge-to-edge window is no longer resized by the keyboard, so `behavior={undefined}` (its Android default) left nothing to scroll and the keyboard covered the fields.
- **`src/layouts/DefaultLayout.tsx`**: reusable wrapper for Settings and sub-pages. Renders `Header` with back navigation, wraps content in a `ScrollView`, and includes a `Footer` at the bottom. Also mounts `AuthPromptModal`. Its scroll content uses `flexGrow: 1`, so a page shorter than the screen still fills it and can push something to the bottom; children stay top-aligned regardless. Pass `scrollable={false}` for a page that scrolls itself (`Bookmarks`): nesting a `FlatList` in that `ScrollView` breaks virtualization, so `onEndReached` never fires. The `Footer` is dropped along with the `ScrollView`, and the page owns its own bottom spacing.

### Account
Settings' first block, "Account", has a "My information" entry that goes through `requireAuth()`: guests get `AuthPromptModal`, signed-in readers open `MyInformations`. That page shows a placeholder avatar (Ionicons `person`), the user's full name, their email in a pill (light background, mail icon, primary text), and a "Log out" link pinned to the bottom of the screen (a `flex: 1` spacer above it, which works because `DefaultLayout`'s scroll content now has `flexGrow: 1`). The link opens `LogoutConfirmModal` (`src/pages/MyInformations/LogoutConfirmModal.tsx`), a `BottomSheet` with confirm and cancel buttons — the same sheet as the sign-in prompt, so both account moments look alike. Confirming calls `logout()` then `goBack()` to Settings, since the page's own `!user` guard would otherwise blank it.

There is **no change-password entry here any more**: the only way to a new password is `ForgotPassword`, reached from the Login screen, which still pre-fills the typed email.

### Home Screen (`src/pages/Home/`)
`index.tsx` fetches the day's messages with `getDayMessages(language)` and renders one `MessageItem` per message in a swipeable `TabView` (`react-native-tab-view`, backed by `react-native-pager-view`) with the tab bar hidden. `currentIndex` is controlled by Home state.
- Messages are **refetched whenever the language changes**, since the server returns translated content based on the `x-mdj-lang` header. A `requestIdRef` guard drops stale responses, and the index resets to 0 after each fetch.
- **`MessageItem`** (`src/components/MessageItem/`): one scrollable message ("Today's message" heading, locale-formatted date, title, cover image, verses, `RenderHTML` body, author line) with pull-to-refresh via `RefreshControl`.
- **`HomeToolBar`** (`src/components/HomeToolBar/`): bottom toolbar pinned over the pager. Previous/next arrows appear on the sides only when navigation is possible. The center holds the actions for the current message:
  - `CTAListen`: starts/toggles TTS playback of the message, shows a spinner while downloading/buffering and a small play/pause badge once a track is loaded
  - `CTABookmark`: saves the message for the signed-in reader. A guest gets `AuthPromptModal` through `requireAuth()`. The icon is `bookmark-outline` until the message is saved and `bookmark` after, and the tap is **save-only** — tapping a filled icon does *not* unsave, it opens the bookmarks list (not built yet, so it shows the `home.bookmark.unavailable` toast; the swap is one marked `TODO(bookmarks-list)` line). Removing a bookmark will live in that list, which is why `home.bookmark.remove`/`removed` are still unused. State comes from `useBookmarks()`; feedback goes through Home's `Toast` via the `onToast` prop, since the toast must sit above the toolbar rather than inside it.
  - `CTAShare`: shares title, verses, plain-text body (`htmlToPlainText`), author line, and a footer with `WEBSITE_URL`, using React Native's built-in `Share`
  - `Tool.tsx` (`HomeTool`) is the shared icon button used for every toolbar action.
- **`EmptyList`**: shown when there are no messages, with pull-to-refresh.

Work in progress on `feat/new-homepage-messages`: `MiniPlayerBar` (`src/components/AudioPlayer/`) still exists but is no longer mounted anywhere, and nothing calls `HomeTutorialContext.requestShow()` now that the `HomeTutorial` toast component has been removed. Check whether these should be re-wired or deleted before relying on them.

### Bookmarks
- **`Bookmarks`** (`src/pages/Bookmarks/`): the reader's saved messages, reached from Home's filled bookmark icon (there is deliberately no Settings entry). A `FlatList` in `DefaultLayout` with `scrollable={false}`.
  - `useBookmarkList()` paginates with `limit: 12` (divides by the grid's two columns). `onEndReached` loads the next page while `page < pages`; a `requestIdRef` guard drops responses a newer request has replaced. `reload()` is wired to `useFocusEffect`: a full load with a spinner the first time, a silent refresh on every return, which is how a removal on `BookmarkMessage` disappears from the list.
  - `mergeBookmarkPages()` dedupes by id when appending. Rows are newest-first, so saving a message while the list is open shifts every row down and the same bookmark can arrive on two pages. It has a Jest test.
  - List/grid toggle sits in a page row (count on the left, icon on the right), not in the shared `Header`, whose right slot is the app icon. Grid is the same list with `numColumns={2}`; React Native needs a remount when that changes, hence `key={mode}`. Grid cards take a fixed `width: '48.5%'` rather than `flex: 1`, so a lone card on the last row (an odd number of bookmarks) keeps its column width instead of stretching across; the gutter comes from the row's `justifyContent: 'space-between'`, which is why the content style sets `rowGap` and not `gap`. The choice persists under `STORAGE_KEYS.BOOKMARKS_VIEW`.
  - **`BookmarkCard`** (`src/components/BookmarkCard/`): one component, `variant: 'list' | 'grid'`. Cover via `/files/:id/view`, falling back to `app_logo.png`; title; `bookmarks.by_author` beneath it. A row whose `message` is `null` — the message was deleted after being saved — renders the "no longer available" notice and stays pressable, so it can still be removed.
- **`BookmarkMessage`** (`src/pages/BookmarkMessage/`): fetches `GET /bookmarks/:id` and renders `MessageItem`, so it reads exactly like Home. Laid out like `HomeLayout` rather than `DefaultLayout`: floating CTAs over the message, back on the left, a filled `bookmark` icon on the right that removes it. Removing calls `removeBookmark()`, then `setStatus(messageId, null)` so Home's icon empties, then `goBack()`.

### Audio Playback (TTS)
Messages can be listened to as server-generated speech, played through `react-native-audio-pro` (a GitHub fork: `github:tchamio/react-native-audio-pro`).
- **`src/services/audio/`**: `setupAudio()` configures `AudioPro` (speech content type, 15 s skip controls, no next/prev) and registers a no-op `addEventListener`. **Don't remove that listener**: it's what makes the library subscribe to native events. Without it, `useAudioPro()` state stays frozen on `IDLE` while audio still plays.
- **`src/services/speech/`**: `getSpeechFileUri(messageId, lang)` downloads `GET {API_URL}/messages/:id/speech` with `react-native-fs` into `CachesDirectoryPath/tts/<id>-<lang>.mp3` and returns a `file://` URI (cached files are reused). It bypasses `lib/fetch.ts` on purpose, because that helper always parses JSON.
- **`AudioPlayerProvider`**: `play(messageId, lang, meta)` toggles play/pause if that track is already loaded, otherwise downloads and plays it. The track id is `<messageId>::<lang>`. A request-id guard cancels stale downloads. `close()` clears the player. Changing the language also clears it, so the audio always matches the displayed text. Artwork falls back to `app_icon.png`.
- **`useAudioPlayer()`**: merges the context with `useAudioPro()` reactive state (`currentMessageId`, `position`/`duration` in seconds, `isPlaying`, `isBuffering`, `isIdle`, `isStopped`, `title`, `error`). Playback state deliberately lives in the library, not in the context, so progress ticks don't re-render every context consumer.

### Push Notifications (`src/features/notifications/`)
All notification logic is colocated here:
- `useOneSignalInit`: SDK initialization with `ONE_SIGNAL_APP_ID` from `@env`, called in `App.tsx`. Foreground notifications are delayed 5 s before display.
- `useNotificationClick`: click handler that navigates to `Home` for `NEW_DAILY_MEDITATION` notifications, mounted in `src/layouts/HomeLayout.tsx`
- `types.ts`: `NotificationTypes` enum and `PushNotificationData` type

### API access (`src/lib/fetch.ts`)
`getHeaders()` builds every request's headers: `x-mdj-device-token`, `x-mdj-lang`, `x-mdj-platform`, and `Authorization: Bearer <accessToken>` when a session is stored. The token is read from AsyncStorage (`readAccessToken()`, `src/services/auth/session.ts`) rather than from `AuthContext`, so the helper stays outside React — `AuthProvider` is the only writer of that key. A guest simply has no token and `buildHeaders` drops the header. `HttpError` carries the status and the server's error `code`; a 401 on an authenticated route means the 7-day access token expired, and since **there is no refresh endpoint server-side**, the only recovery is signing in again (`BookmarksProvider` does `logout()` + `openPrompt()`).

### Password Reset Deep Link
The app registers the `mdj://` URL scheme (Android: an `intent-filter` for `mdj://reset-password` in `AndroidManifest.xml`; iOS: `CFBundleURLTypes` in `Info.plist` plus `application(_:open:options:)` in `AppDelegate.swift` forwarding to `RCTLinkingManager`).

Flow: `ForgotPassword` → the server sees `x-mdj-platform: mobile` and emails `{MOBILE_RESET_URL}#token=…` (the landing page `reset-password.html`; the token is in the fragment so it never reaches that site's logs) → the page's "Open the app" button opens `mdj://reset-password?token=…` → `usePasswordResetLink()` (`src/features/auth/`, mounted in `HomeLayout`) navigates to `ResetPassword` with the `token` param → `POST /auth/reset-password`. The email doesn't link to `mdj://` directly because mail clients (Gmail especially) don't reliably open custom schemes.
- `parseResetToken()` (`src/features/auth/resetLink.ts`) parses the link by hand: RN's `URL` polyfill has no `searchParams`. It has a Jest test.
- The launch URL is handled once per process (`getInitialURL()` keeps returning it, and Home can remount).
- Links are only handled once Home is mounted, i.e. after onboarding. A link opened during `Welcome` is picked up when Home first mounts.
- `ResetPassword` shows a "request a new link" path (→ `ForgotPassword`) on `RESET_TOKEN_INVALID`, and on success replaces itself with `Login`.

### Device Registration
On the `Welcome` page, after the user taps the CTA, the app calls `OneSignal.User.getOnesignalId()` to fetch the OneSignal ID, then passes it as `deviceId` (along with `platform`) to `registerDevice()`. Registration is skipped if no OneSignal ID is available yet.

### API & Storage
All utilities are plain exported functions, not classes.

- **`src/lib/fetch.ts`**: `get`, `post`, `put`, `del`, `download`. Pass the body as a plain object; serialization is handled internally. The base URL is `API_URL` from `@env` (see Environment). `getHeaders(lang?)` attaches the stored device token as `x-mdj-device-token` and the language as `x-mdj-lang` (`'fr'` | `'en'`). It uses the explicit `lang` argument, or else the stored `STORAGE_KEYS.LANGUAGE`.
  Non-2xx responses throw `HttpError` (`status`, plus the server's error `code` such as `EMAIL_TAKEN` / `USER_PENDING`).
- **`src/lib/storage.ts`**: `saveItem`, `retrieveItem`, `deleteItem`. Storage keys are in the `STORAGE_KEYS` const object (`SESSION`, `THEME`, `LANGUAGE`, `SHOW_WELCOME`, `DEVICE_TOKEN`, `HOME_TUTORIAL` = `'home_tutorial_v2'`, `AUTH_SESSION`).
- **`src/lib/validation.ts`**: `isValidEmail`, `PASSWORD_MIN_LENGTH` (same rules as the server's `User` schema).
- **`src/lib/html.ts`**: `htmlToPlainText(html)` flattens a message body to plain text (keeping paragraph breaks) using the same parser as `RenderHTML`. Used for sharing.
- **`src/services/devices/`**: `registerDevice(payload)` registers the device on the backend on first launch. Called from the `Welcome` page.
- **`src/services/messages/`**: `getDayMessages(lang?)` (`GET messages/currents`, called by Home), `getMessages()`, `getMessage(id)`, `createMessage()`, `updateMessage()`, `deleteMessage()`.
- **`src/services/feedbacks/`**: submits suggestions from the `Suggestion` page.
- **`src/services/auth/`**: `login`, `signup` (always `role: 'user'`), `requestPasswordReset` and `resetPassword(token, password)`. `login` / `signup` add the device's OneSignal id (`onesignalId`, the same id the device registered with) so the server links the device to the account. `authErrorKey(error)` (`errors.ts`) maps a failed request to an `auth.errors.*` i18n key. Use them through `AuthContext` rather than directly, except `requestPasswordReset` / `resetPassword`, which the `ForgotPassword` / `ResetPassword` pages call. That page takes an optional `email` param (Login passes the email typed so far). Its confirmation is identical whether or not the account exists, matching the server. See Password Reset Deep Link for what the emailed link does.
- **`src/services/speech/`**, **`src/services/audio/`**: see Audio Playback.

### Config (`src/config/app.ts`)
`APP_NAME`, `APP_VERSION` (read from `app.json`, so bump the version there), `WEBSITE_URL`, `PRIVACY_POLICY_URL`, `TERMS_OF_USE_URL`, and store links (`PLAY_STORE_URL`, `APP_STORE_URL`, `getStoreUrl()`) used by the Settings "Share the app" / "Leave a review" entries. `IOS_APP_ID` is still empty until the App Store release.

### Components
Theme-aware components that should be preferred over their React Native equivalents:
- **`MText`** (`src/components/Text/`): wraps `<Text>` with automatic theme-aware text color.
- **`Cta`** (`src/components/Cta/`): circular floating button (`TouchableOpacity` on both platforms, with `accessibilityRole="button"`). Props: `onPress`, `disabled`, `color` (required by the type but currently unused), `style`, `accessibilityLabel`. Accepts children (e.g. `<Icon>` or `<Image>`).
- **`Icon`** (`src/components/Icon/`): thin wrapper around Ionicons with theme-aware color. Exports `IconNameType` for typed icon names.
- **`RenderHTML`** (`src/components/RenderHTML/`): renders HTML content (used for message body).
- **`MessageItem`**, **`HomeToolBar`**: Home screen building blocks (see Home Screen). `HOME_TOOLBAR_HEIGHT` is exported from `HomeToolBar/styles.ts` for anything that needs to sit above the toolbar.
- **`Toast`** (`src/components/Toast/`): short, non-interactive notice that fades in and out (Reanimated `FadeIn`/`FadeOut`) and is announced to screen readers. It's controlled by the parent: pass `message` (a string shows it, `null` hides it) and clear it in `onHide`, which fires after `duration` (default 2.5 s). Position it with `style`, e.g. `bottom`.
- **`MiniPlayerBar`** (`src/components/AudioPlayer/`): bottom player with progress, play/pause and close. Currently unmounted (see Home Screen).
- **`Button`** (`src/components/Button/`): full-width text button, `variant` `primary` (filled) or `outline`, with `loading` (spinner) and `disabled`.
- **`FormInput`** (`src/components/FormInput/`): labelled `TextInput` with an optional `error` line; accepts every `TextInput` prop.
- **`BottomSheet`** (`src/components/BottomSheet/`): the animated sheet both auth modals are built from (98% width, 45% height, 20 px above the bottom inset, fading backdrop). Props: `visible`, optional `onDismiss` (backdrop tap + Android back; omit it for a sheet the user must answer) and `dismissLabel`. It's an absolute overlay inside the screen, **not** a native `Modal`, so a screen pushed while it's open slides over it and it's still there on return. Android back is handled only while its screen is focused (`useFocusEffect`), and it stays mounted until the Reanimated slide-out finishes.
- **`AuthPromptModal`** (`src/components/AuthPromptModal/`): `BottomSheet` with the logo, "Soyons plus proches" and the Login / Signup buttons. Driven by `AuthContext` (`promptVisible` / `closePrompt`).
- **`AuthSuccessModal`** (`src/components/AuthSuccessModal/`): `BottomSheet` shown by `Login` / `Signup` once a session opens — "Bienvenue {firstname}" and a `Continue` button. It has no `onDismiss`: **`Continue` closes it and only then runs `goBack()`**, so the redirect waits for the user.
- **`Footer`** (`src/components/Footer/`): footer rendered at the bottom of `DefaultLayout` pages.
- **`Header`** (`src/components/Header/`): header with back navigation, used in `DefaultLayout`.
- **`CheckboxGroup`** (`src/components/CheckboxGroup/`), **`LinksGroup`** (`src/components/LinksGroup/`), **`PageLoader`** (`src/components/PageLoader/`): utility UI components.

### Hooks
- **`useTheme()`** (`src/hooks/useTheme.ts`): returns the current theme from ThemeContext.
- **`useLanguage()`** (`src/hooks/useLanguage.ts`): returns `{ language, updateLanguage }` from LanguageContext. Use it for locale-aware formatting and to pass `lang` to API/speech calls.
- **`useNavigation()`** (`src/hooks/useNavigation.ts`): typed wrapper returning `NativeStackNavigationProp<RootStackParamList>`. Use it instead of importing directly from React Navigation.
- **`useAudioPlayer()`** (`src/hooks/useAudioPlayer.ts`): audio actions + live playback state (see Audio Playback).
- **`useAuth()`** (`src/hooks/useAuth.ts`): returns AuthContext.
- **`useHomeTutorial()`** (`src/hooks/useHomeTutorial.ts`): returns HomeTutorialContext.

### i18n (`src/i18n/`)
i18next with `fr` (default and fallback) and `en` locales in `src/i18n/locales/`. Keep both files in sync when adding keys (`/i18n-sync` from `Shell/` checks this). Message content itself is translated server-side, not by i18next.

### Assets
- `src/assets/imgs/app_logo.png`: displayed on the Welcome screen
- `src/assets/imgs/app_icon.png`: the left CTA in `HomeLayout`, and the fallback artwork for audio playback
- `src/assets/fonts/`: SFProText, CormorantUpright, SpaceMono (see `fontFamily` in `src/theme/primitives/typography.ts`)

### Path Aliases
`@/` maps to `./src/`. It's configured in `babel.config.js` (module resolver) and mirrored in `tsconfig.json` `paths`. Use it for all internal imports.
