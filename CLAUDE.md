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

Routes: `SplashScreen`, `Welcome`, `Home`, `Settings`, `Supremat`, `ThemeSetting`, `LanguageSetting`, `Suggestion`

Screen transitions: `Settings` slides from bottom; `Supremat`, `ThemeSetting`, `LanguageSetting`, `Suggestion` slide from left.

### State Management
Context API only (no Redux or Zustand).
- **ThemeContext** (`src/contexts/themeProvider.tsx`): light/dark theme, persisted to AsyncStorage
- **WelcomeContext** (`src/contexts/welcomeProvider.tsx`): tracks whether onboarding was completed, persisted to AsyncStorage
- **LanguageContext** (`src/contexts/languageProvider.tsx`): active language (`SupportedLanguage` = `'fr'` | `'en'`, exported from `src/i18n`), persisted to AsyncStorage, synced with i18next
- **AudioPlayerContext** (`src/contexts/audioPlayerProvider.tsx`): TTS playback actions (`play`, `togglePlayPause`, `close`) plus `isDownloading` / `error` / `barHeight`. See Audio Playback.
- **HomeTutorialContext** (`src/contexts/homeTutorialProvider.tsx`): one-shot "swipe to see other messages" hint (`visible`, `requestShow`, `dismiss`), persisted under `STORAGE_KEYS.HOME_TUTORIAL`.

Provider hierarchy in `App.tsx`: `ThemeProvider` → `SafeAreaProvider` → `WelcomeProvider` → `LanguageProvider` → `AudioPlayerProvider` → `HomeTutorialProvider` → `Navigation`

`AudioPlayerProvider` must stay inside `LanguageProvider`: it clears the player whenever the language changes.

### Theme System (`src/theme/`)
Design token system with utility functions instead of a CSS-in-JS library. Use the primitive helpers for styles:
- `src/theme/primitives/`: `p()`, `m()`, `px()`, `py()`, `flex()`, `bg()`, etc. generate StyleSheet-compatible objects
- `src/theme/variables/colors.ts`: light (warm beige/brown) and dark (cool navy/purple) palettes. Index it directly (`colors[theme].primary`) when a raw color value is needed (e.g. `ActivityIndicator`).
- `DIMENSIONS` (screen/window sizes) and `STATUS_BAR_HEIGHT` are re-exported from `@/theme`
- Access the current theme via the `useTheme()` hook. `MText` and `Cta` are already theme-aware.

### Layouts
- **`src/layouts/HomeLayout.tsx`**: Home-only wrapper. Renders the status bar, two floating CTAs at the top (app icon on the left → `Supremat`, settings icon on the right → `Settings`), and mounts `useNotificationClick()`. Uses `useSafeAreaInsets` for bottom padding.
- **`src/layouts/DefaultLayout.tsx`**: reusable wrapper for Settings and sub-pages. Renders `Header` with back navigation, wraps content in a `ScrollView`, and includes a `Footer` at the bottom.

### Home Screen (`src/pages/Home/`)
`index.tsx` fetches the day's messages with `getDayMessages(language)` and renders one `MessageItem` per message in a swipeable `TabView` (`react-native-tab-view`, backed by `react-native-pager-view`) with the tab bar hidden. `currentIndex` is controlled by Home state.
- Messages are **refetched whenever the language changes**, since the server returns translated content based on the `x-mdj-lang` header. A `requestIdRef` guard drops stale responses, and the index resets to 0 after each fetch.
- **`MessageItem`** (`src/components/MessageItem/`): one scrollable message ("Today's message" heading, locale-formatted date, title, cover image, verses, `RenderHTML` body, author line) with pull-to-refresh via `RefreshControl`.
- **`HomeToolBar`** (`src/components/HomeToolBar/`): bottom toolbar pinned over the pager. Previous/next arrows appear on the sides only when navigation is possible. The center holds the actions for the current message:
  - `CTAListen`: starts/toggles TTS playback of the message, shows a spinner while downloading/buffering and a small play/pause badge once a track is loaded
  - bookmark button: **not implemented yet**. Home's `handleBookmark` shows a `Toast` with `home.bookmark.unavailable` ("Feature not yet available"). The other `home.bookmark.*` keys (`add`/`remove`/`added`/`removed`) are ready for the real feature.
  - `CTAShare`: shares title, verses, plain-text body (`htmlToPlainText`), author line, and a footer with `WEBSITE_URL`, using React Native's built-in `Share`
  - `Tool.tsx` (`HomeTool`) is the shared icon button used for every toolbar action.
- **`EmptyList`**: shown when there are no messages, with pull-to-refresh.

Work in progress on `feat/new-homepage-messages`: `MiniPlayerBar` (`src/components/AudioPlayer/`) still exists but is no longer mounted anywhere, and nothing calls `HomeTutorialContext.requestShow()` now that the `HomeTutorial` toast component has been removed. Check whether these should be re-wired or deleted before relying on them.

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

### Device Registration
On the `Welcome` page, after the user taps the CTA, the app calls `OneSignal.User.getOnesignalId()` to fetch the OneSignal ID, then passes it as `deviceId` (along with `platform`) to `registerDevice()`. Registration is skipped if no OneSignal ID is available yet.

### API & Storage
All utilities are plain exported functions, not classes.

- **`src/lib/fetch.ts`**: `get`, `post`, `put`, `del`, `download`. Pass the body as a plain object; serialization is handled internally. The base URL is `API_URL` from `@env` (see Environment). `getHeaders(lang?)` attaches the stored device token as `x-mdj-device-token` and the language as `x-mdj-lang` (`'fr'` | `'en'`). It uses the explicit `lang` argument, or else the stored `STORAGE_KEYS.LANGUAGE`.
- **`src/lib/storage.ts`**: `saveItem`, `retrieveItem`, `deleteItem`. Storage keys are in the `STORAGE_KEYS` const object (`SESSION`, `THEME`, `LANGUAGE`, `SHOW_WELCOME`, `DEVICE_TOKEN`, `HOME_TUTORIAL` = `'home_tutorial_v2'`).
- **`src/lib/html.ts`**: `htmlToPlainText(html)` flattens a message body to plain text (keeping paragraph breaks) using the same parser as `RenderHTML`. Used for sharing.
- **`src/services/devices/`**: `registerDevice(payload)` registers the device on the backend on first launch. Called from the `Welcome` page.
- **`src/services/messages/`**: `getDayMessages(lang?)` (`GET messages/currents`, called by Home), `getMessages()`, `getMessage(id)`, `createMessage()`, `updateMessage()`, `deleteMessage()`.
- **`src/services/feedbacks/`**: submits suggestions from the `Suggestion` page.
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
- **`Footer`** (`src/components/Footer/`): footer rendered at the bottom of `DefaultLayout` pages.
- **`Header`** (`src/components/Header/`): header with back navigation, used in `DefaultLayout`.
- **`CheckboxGroup`** (`src/components/CheckboxGroup/`), **`LinksGroup`** (`src/components/LinksGroup/`), **`PageLoader`** (`src/components/PageLoader/`): utility UI components.

### Hooks
- **`useTheme()`** (`src/hooks/useTheme.ts`): returns the current theme from ThemeContext.
- **`useLanguage()`** (`src/hooks/useLanguage.ts`): returns `{ language, updateLanguage }` from LanguageContext. Use it for locale-aware formatting and to pass `lang` to API/speech calls.
- **`useNavigation()`** (`src/hooks/useNavigation.ts`): typed wrapper returning `NativeStackNavigationProp<RootStackParamList>`. Use it instead of importing directly from React Navigation.
- **`useAudioPlayer()`** (`src/hooks/useAudioPlayer.ts`): audio actions + live playback state (see Audio Playback).
- **`useHomeTutorial()`** (`src/hooks/useHomeTutorial.ts`): returns HomeTutorialContext.

### i18n (`src/i18n/`)
i18next with `fr` (default and fallback) and `en` locales in `src/i18n/locales/`. Keep both files in sync when adding keys (`/i18n-sync` from `Shell/` checks this). Message content itself is translated server-side, not by i18next.

### Assets
- `src/assets/imgs/app_logo.png`: displayed on the Welcome screen
- `src/assets/imgs/app_icon.png`: the left CTA in `HomeLayout`, and the fallback artwork for audio playback
- `src/assets/fonts/`: SFProText, CormorantUpright, SpaceMono (see `fontFamily` in `src/theme/primitives/typography.ts`)

### Path Aliases
`@/` maps to `./src/`. It's configured in `babel.config.js` (module resolver) and mirrored in `tsconfig.json` `paths`. Use it for all internal imports.
