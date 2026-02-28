# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MDJ is a React Native meditation/devotional mobile app targeting Android and iOS. It serves daily meditation content with push notifications, theme customization, and multi-language support.

## Commands

```bash
npm start          # Start Metro bundler (cache reset)
npm run android    # Build and run on Android
npm run ios        # Build and run on iOS
npm run lint       # Run ESLint
npm test           # Run Jest tests
npm run log-android # View Android logs
```

## Architecture

### Navigation (`src/Navigation.tsx`)
React Navigation Native Stack with a typed `RootStackParamList`. Navigation flow:
- First launch: `SplashScreen` → `Welcome` → `Home`
- Returning user: `SplashScreen` → `Home`

`SplashScreen` reads `STORAGE_KEYS.SHOW_WELCOME` from AsyncStorage and navigates directly — no context involved. `Welcome` calls `navigation.replace('Home')` after onboarding.

Routes: `SplashScreen`, `Welcome`, `Home`, `Settings`, `Supremat`, `ThemeSetting`, `LanguageSetting`, `Suggestion`

### State Management
Context API only — no Redux or Zustand.
- **ThemeContext** (`src/contexts/themeProvider.tsx`): light/dark theme, persisted to AsyncStorage
- **WelcomeContext** (`src/contexts/welcomeProvider.tsx`): tracks whether onboarding was completed, persisted to AsyncStorage

Provider hierarchy in `App.tsx`: `ThemeProvider` → `SafeAreaProvider` → `WelcomeProvider` → `Navigation`

### Theme System (`src/theme/`)
Design token system with utility functions instead of a CSS-in-JS library. Use the primitive helpers for styles:
- `src/theme/primitives/` — `p()`, `m()`, `px()`, `py()`, `flex()`, `bg()`, etc. generate StyleSheet-compatible objects
- `src/theme/variables/colors.ts` — light (warm beige/brown) and dark (cool navy/purple) palettes
- Access current theme via `useTheme()` hook; `MText` and `Cta` components are already theme-aware

### Layouts
- **`src/pages/Home/Shell.tsx`**: Home-specific shell — renders two floating CTAs (Settings, Info) and mounts `useNotificationClick()`
- **`src/layouts/DefaultLayout.tsx`**: reusable wrapper for Settings and sub-pages, renders `Header` with back navigation

### Push Notifications (`src/features/notifications/`)
All notification logic is colocated here:
- `useOneSignalInit` — SDK initialization, called in `App.tsx`
- `useNotificationClick` — click-to-navigate handler, mounted in `src/pages/Home/Shell.tsx`
- `types.ts` — `NotificationTypes` enum and `PushNotificationData` type

App ID and other constants are in `src/config/app.ts`.

### API & Storage
All utilities are plain exported functions, not classes.

- **`src/lib/fetch.ts`** — `get`, `post`, `put`, `del`, `download`. Pass body as a plain object; serialization is handled internally. Base URL: `https://mdj-server.onrender.com/api`. Set `NODE_ENV=development` to hit `http://localhost:5002/api` instead. `getHeaders()` automatically attaches the stored device token as `x-mdj-device-token`.
- **`src/lib/storage.ts`** — `saveItem`, `retrieveItem`, `deleteItem`. Storage keys are in the `STORAGE_KEYS` const object (`SESSION`, `THEME`, `LANGUAGE`, `SHOW_WELCOME`, `DEVICE_TOKEN`).
- **`src/services/devices/`** — `registerDevice(payload)`: registers the device on the backend on first launch, called from `Welcome` page.
- **`src/services/messages/`** — `getDayMessages()`, `getMessages()`, `getMessage(id)`, `createMessage()`, `updateMessage()`, `deleteMessage()`. `getDayMessages()` is called by the Home carousel.

### Components
Theme-aware components that should be preferred over their React Native equivalents:
- **`MText`** (`src/components/Text/`): wraps `<Text>` with automatic theme-aware text color.
- **`Cta`** (`src/components/Cta/`): circular floating button using Ionicons. Props: `onPress`, `icon` (Ionicon name), `color` (theme color key), `disabled`, `style`. Handles platform-specific ripple (Android) vs opacity (iOS).
- **`Icon`** (`src/components/Icon/`): thin wrapper around Ionicons with theme-aware color. Exports `IconNameType` for typed icon names.

### Hooks
- **`useTheme()`** (`src/hooks/useTheme.ts`): returns the current theme from ThemeContext.
- **`useNavigation()`** (`src/hooks/useNavigation.ts`): typed wrapper returning `NativeStackNavigationProp<RootStackParamList>` — use this instead of importing directly from React Navigation.

### Path Aliases
`@/` maps to `./src/` — configured in `babel.config.js` via the module resolver plugin. Use this for all internal imports.
