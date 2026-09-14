# MDJ — Méditation du Jour

**MDJ** (Méditation du Jour / Daily Meditation) is a mobile devotional app for Android and iOS, built for the **Church of Christ – Mission Harris (ECMHA)**. It delivers a daily meditation message to believers, with support for French and English, light and dark themes, and push notifications.

---

## Features

- **Daily meditation**: Browse the day's message(s) in full-screen swipeable pages, with previous/next buttons in the bottom toolbar
- **Listen**: Play any message as text-to-speech audio, with lock-screen / media-session controls
- **Share**: Share a message (title, verses, text, author) or the app itself; leave a store review
- **Bilingual**: Full French / English UI via `react-i18next`. Message content and audio are also served in the selected language.
- **Theming**: Light (warm beige) and dark (navy/purple) modes, persisted across sessions
- **Push notifications**: OneSignal integration — tap a notification to open the day's messages
- **Suggestions**: In-app form to submit feedback/suggestions to the ECMHA team
- **Pull-to-refresh**: Swipe down to reload the latest content

---

## Tech Stack

| Layer              | Choice                              |
| ------------------ | ----------------------------------- |
| Framework          | React Native 0.84.1 (CLI, not Expo) |
| Language           | TypeScript                          |
| Navigation         | React Navigation — Native Stack     |
| State              | Context API (no Redux)              |
| i18n               | i18next + react-i18next             |
| Storage            | AsyncStorage                        |
| Env config         | react-native-dotenv (`.env.*`)      |
| Push notifications | OneSignal                           |
| Message pager      | react-native-tab-view + pager-view  |
| Audio playback     | react-native-audio-pro (fork)       |
| Audio file cache   | react-native-fs                     |
| Splash screen      | react-native-bootsplash             |

---

## Prerequisites

- Node >= 22.11.0
- React Native environment set up: [reactnative.dev/docs/set-up-your-environment](https://reactnative.dev/docs/set-up-your-environment)
- For iOS: Ruby bundler + CocoaPods

---

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. iOS only — install native pods

```sh
bundle install          # first clone only
bundle exec pod install
```

### 3. Configure the environment

Copy `.env.example` to `.env.development` (and `.env.staging` / `.env.production` as needed), then fill in `API_URL` and `ONE_SIGNAL_APP_ID`. The file is picked by `NODE_ENV`, which the npm scripts set for you.

### 4. Start Metro

```sh
npm start
```

### 5. Run on device / simulator

```sh
npm run android   # Android
npm run ios       # iOS
```

---

## Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm start`           | Start Metro bundler (cache reset) |
| `npm run android`     | Build and run on Android (dev env) |
| `npm run ios`         | Build and run on iOS (dev env)    |
| `npm run android:staging` / `:production` | Android against `.env.staging` / `.env.production` |
| `npm run ios:staging` / `:production`     | iOS against `.env.staging` / `.env.production`     |
| `npm run lint`        | Run ESLint                        |
| `npm test`            | Run Jest                          |
| `npm run log-android` | Stream Android logs               |

---

## Project Structure

```
src/
├── assets/fonts/          # Custom fonts (SFProText, CormorantUpright)
├── components/            # Shared UI (MText, Cta, MessageItem, HomeToolBar, RenderHTML, …)
├── config/                # App-level constants (version, website, store URLs)
├── contexts/              # React Context providers (theme, welcome, language, audio player, home tutorial)
├── features/notifications/# OneSignal init + click-to-navigate hook
├── hooks/                 # useTheme, useLanguage, useNavigation, useAudioPlayer, useHomeTutorial
├── i18n/                  # i18next config + locales (fr.ts, en.ts)
├── layouts/               # HomeLayout (floating CTAs) + DefaultLayout (sub-pages with header + back nav)
├── lib/                   # fetch helpers, AsyncStorage helpers, HTML → plain text
├── pages/                 # One folder per screen
│   ├── Home/              # Message pager + empty state
│   ├── Settings/
│   ├── Suggestion/
│   ├── ThemeSetting/
│   ├── LanguageSetting/
│   ├── Supremat/          # "About" page
│   ├── Welcome/
│   └── SplashScreen/
├── services/              # API modules (messages, devices, feedbacks, speech) + audio setup
├── theme/                 # Design token system (primitives + color variables)
└── Navigation.tsx         # Root stack navigator
```

---

## Architecture Notes

### Navigation flow

```
SplashScreen ──(first launch)──► Welcome ──► Home
             ──(returning)────────────────► Home
```

`SplashScreen` reads `STORAGE_KEYS.SHOW_WELCOME` from AsyncStorage to decide which route to replace itself with. No context is involved in this decision.

### Theme system

Styles are built with utility functions from `src/theme/primitives/` instead of a CSS-in-JS library. Use them as style array entries:

```tsx
<View style={[flexContent(1), px(20), bgDefault(theme)]} />
```

Access the current theme string (`'light' | 'dark'`) with the `useTheme()` hook.

### i18n

The app defaults to French (`lng: 'fr'`). The selected language is persisted in AsyncStorage under `STORAGE_KEYS.LANGUAGE` and applied via `LanguageProvider` on startup. Change language through the **Language** settings screen.

### API

The base URL is `API_URL` from the active `.env.*` file (imported via `@env`). All JSON requests go through the helpers in `src/lib/fetch.ts`. `getHeaders(lang?)` attaches the device token (`STORAGE_KEYS.DEVICE_TOKEN`) as `x-mdj-device-token` and the language as `x-mdj-lang`, so the server returns messages in the reader's language. Home refetches the day's messages (`GET messages/currents`) whenever the language changes.

### Audio (text-to-speech)

The **Listen** button in the Home toolbar downloads the message's speech from `GET messages/:id/speech` into the device cache (`react-native-fs`, reused on replay) and plays it with `react-native-audio-pro`. The player is configured once in `index.js` via `setupAudio()`, outside the React lifecycle, so playback survives backgrounding. Playback state is exposed through `useAudioPlayer()`. Switching language stops the current track.

### Push notifications

OneSignal is initialized in `App.tsx` via `useOneSignalInit` (app ID from `ONE_SIGNAL_APP_ID` in `.env.*`). Navigation-on-tap logic lives in `src/features/notifications/useNotificationClick.ts`, mounted inside `src/layouts/HomeLayout.tsx`.

---

## Adding Custom Fonts

1. Drop `.ttf` files into `src/assets/fonts/`
2. Run `npx react-native-asset`
3. Rebuild the app

Font family names are defined in `src/theme/primitives/typography.ts` under `fontFamily`.

---

## LICENSE (MIT)

See [./LICENSE](./LICENSE) for full license

---

## Presented by

**ECMHA — Eglise du Christ · Mission Harris**

Build with ❤️ by _BRANKOO STUDIO_
