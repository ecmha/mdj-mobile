# MDJ — Méditation du Jour

**MDJ** (Méditation du Jour / Daily Meditation) is a mobile devotional app for Android and iOS, built for the **Church of Christ – Mission Harris (ECMHA)**. It delivers a daily meditation message to believers, with support for French and English, light and dark themes, and push notifications.

---

## Features

- **Daily meditation**: Browse the day's message(s) in a full-screen swipeable carousel
- **Bilingual**: Full French / English support via `react-i18next`
- **Theming**: Light (warm beige) and dark (navy/purple) modes, persisted across sessions
- **Push notifications**: OneSignal integration — tap a notification to open the relevant message
- **Suggestions**: In-app form to submit feedback/suggestions to the ECMHA team
- **Pull-to-refresh**: Swipe down to reload the latest content

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.83.1 (CLI, not Expo) |
| Language | TypeScript |
| Navigation | React Navigation — Native Stack |
| State | Context API (no Redux) |
| i18n | i18next + react-i18next |
| Storage | AsyncStorage |
| Push notifications | OneSignal |
| Carousel | react-native-reanimated-carousel |
| Splash screen | react-native-bootsplash |

---

## Prerequisites

- Node >= 20
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

### 3. Start Metro

```sh
npm start
```

### 4. Run on device / simulator

```sh
npm run android   # Android
npm run ios       # iOS
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler (cache reset) |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest |
| `npm run log-android` | Stream Android logs |

---

## Project Structure

```
src/
├── assets/fonts/          # Custom fonts (SFProText, CormorantUpright)
├── components/            # Shared UI components (MText, RenderHTML, CheckboxGroup, …)
├── config/                # App-level constants (app ID, API base URL, …)
├── contexts/              # React Context providers (theme, welcome, language)
├── features/notifications/# OneSignal init + click-to-navigate hook
├── hooks/                 # useTheme, useLanguage, useNavigation wrappers
├── i18n/                  # i18next config + locales (fr.ts, en.ts)
├── layouts/               # DefaultLayout (sub-pages with header + back nav)
├── lib/                   # fetch helpers, AsyncStorage helpers
├── pages/                 # One folder per screen
│   ├── Home/              # Carousel + Shell (floating CTAs)
│   ├── Settings/
│   ├── Suggestion/
│   ├── ThemeSetting/
│   ├── LanguageSetting/
│   ├── Supremat/          # "About" page
│   ├── Welcome/
│   └── SplashScreen/
├── services/              # API service modules (messages, devices, feedbacks)
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

Base URL is defined in `src/config/app.ts`. All requests go through the helpers in `src/lib/fetch.ts`. The device token (`STORAGE_KEYS.DEVICE_TOKEN`) is automatically attached as the `x-mdj-device-token` header by `getHeaders()`.

### Push notifications

OneSignal is initialized in `App.tsx` via `useOneSignalInit`. Navigation-on-tap logic lives in `src/features/notifications/useNotificationClick.ts`, mounted inside `src/pages/Home/Shell.tsx`.

---

## Adding Custom Fonts

1. Drop `.ttf` files into `src/assets/fonts/`
2. Run `npx react-native-asset`
3. Rebuild the app

Font family names are defined in `src/theme/primitives/typography.ts` under `fontFamily`.

---

## Presented by

**ECMHA — Eglise du Christ · Mission Harris**

Build with ❤️ by *BRANCO STD*
