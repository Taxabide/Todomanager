# Todo Manager - Setup & Deployment

## Prerequisites

Before you start, make sure you have these installed:

- Node.js v22.11.0 or above
- npm (comes with Node) or yarn
- Android Studio with Android SDK (API 24+)
- Java JDK 11 or higher
- For iOS: Xcode + CocoaPods (only if building on Mac)

## Getting Started

Clone the repo and install dependencies:

```bash
cd D:\TodoManager\TodoManager
npm install
```

For iOS (Mac only), you also need to install pods:

```bash
cd ios && pod install && cd ..
```

## Running the App

You need two terminal windows for this.

Terminal 1 - Start Metro bundler:

```bash
npm start
```

Terminal 2 - Build and run on Android:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

If Metro acts up or you see stale cache issues, just clear it:

```bash
npm start -- --reset-cache
```

## Firebase Setup

The app uses Firebase Authentication for login/signup. You need to set up your own Firebase project:

1. Go to Firebase Console and create a new project
2. Enable Email/Password sign-in method under Authentication
3. Download `google-services.json` and place it at `android/app/google-services.json`
4. For iOS, download `GoogleService-Info.plist` and add it to the iOS project

The app handles these auth flows:
- Login with email and password
- New user registration
- Password reset via email
- Auto session management (stays logged in until sign out)

## Building Release APK

First, you need a signing key. Generate one if you haven't:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Put the generated `.jks` file in `android/app/`. Then add your keystore details in `android/gradle.properties`:

```
MYAPP_UPLOAD_STORE_FILE=upload-keystore.jks
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=your_password_here
MYAPP_UPLOAD_KEY_PASSWORD=your_password_here
```

Now build the release APK:

```bash
cd android
./gradlew assembleRelease
cd ..
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
TodoManager/
├── android/                  # Native Android project
├── ios/                      # Native iOS project
├── src/
│   ├── components/           # Reusable UI components (Button, Input, TodoCard, etc.)
│   ├── constants/            # App constants
│   ├── helpers/              # Error handling helpers
│   ├── hooks/                # Custom hooks (useAuth, useTodos, useDebounce)
│   ├── navigation/           # React Navigation setup (Auth + App navigators)
│   ├── redux/                # Redux Toolkit slices (auth, todo, ui)
│   ├── screens/              # All app screens
│   │   ├── LoginScreen
│   │   ├── RegisterScreen
│   │   ├── ForgotPasswordScreen
│   │   ├── SplashScreen
│   │   ├── TodoListsScreen
│   │   └── TodoDetailsScreen
│   ├── services/             # Firebase auth + AsyncStorage services
│   ├── theme/                # Colors, fonts, spacing
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper functions and validators
├── App.tsx                   # Entry point - wraps app with Redux Provider
├── package.json
└── tsconfig.json
```

## Tech Stack

- **React Native** 0.86.0 (CLI, not Expo)
- **Firebase Auth** - Email/Password authentication
- **Redux Toolkit** - State management with 3 slices (auth, todo, ui)
- **React Navigation** v7 - Stack navigation
- **AsyncStorage** - Local data persistence
- **TypeScript** - Type safety throughout
- **Hermes** - JS engine (enabled by default)

## Features

### Authentication
- Firebase email/password login
- User registration
- Password reset flow
- Persistent session (auto-login on app restart)

### Todo Management
- Create, edit, delete multiple todo lists
- Add, edit, delete todos within each list
- Mark todos as complete/incomplete
- Set priority levels (High, Medium, Low, None)
- Add due dates and descriptions to todos
- Search todos by title
- Filter by All / Completed / Pending
- Sort by Newest, Oldest, or Priority

### Data
- All data stored locally via AsyncStorage
- Data is separated per user (each user sees only their own lists)
- Redux state is kept in sync with storage

### UI
- Clean, minimal interface
- Loading states with spinners
- Input validation with inline error messages
- Error handling for all Firebase operations
- Empty states when no lists/todos exist
- Progress bar showing completion ratio

## Architecture Notes

The app uses a fairly standard RN architecture:

- **Redux** is the single source of truth. Three slices:
  - `authSlice` - tracks current user and auth state
  - `todoSlice` - holds all todo lists and items
  - `uiSlice` - handles modal visibility, search query, filter and sort modes

- **Navigation** is split into `AuthNavigator` (Login, Register, ForgotPassword) and `AppNavigator` (TodoLists, TodoDetails). The `RootNavigator` checks auth state and switches between them. A splash screen shows for ~1.5s while Firebase initializes.

- **Services** layer wraps Firebase auth calls (`signIn`, `signUp`, `signOutUser`, `resetPassword`) and AsyncStorage operations. This keeps API logic out of components.

- **Hooks** (`useAuth`, `useTodos`) connect Redux state to components and expose action dispatchers.

## Android Build Configuration

A couple of things worth noting in the Android config:

- **Architecture is limited to `arm64-v8a` only** in `gradle.properties`. This was done to avoid the Windows path length limit issue that breaks CMake builds when compiling native modules like react-native-reanimated and react-native-worklets. If you are on Mac/Linux you can remove this restriction and build for all ABIs.

- **New Architecture** is enabled (`newArchEnabled=true`).
- **Hermes** engine is enabled.
- **Firebase BOM** 33.7.0 is used for the Android side.
- **react-native-vector-icons** fonts are linked via the gradle fonts.gradle script.

## Troubleshooting

**Build fails with "file path too long" on Windows:**
This is a known Windows issue with CMake. The project is already configured to only build `arm64-v8a` which helps. If it still fails:

```bash
cd android
./gradlew clean
cd ..
npm install
npm run android
```

**Metro bundler won't start or shows errors:**
Clear cache and restart:
```bash
npm start -- --reset-cache
```

**"Resource not found" / missing app_name or ic_launcher_round errors:**
All Android resources (strings.xml, styles.xml, launcher icons including adaptive icons) are already set up. If you still see this, make sure you haven't accidentally deleted anything under `android/app/src/main/res/`.

**Firebase auth not working:**
- Check that `google-services.json` is in `android/app/`
- Verify Email/Password is enabled in Firebase Console
- Make sure your app's package name (`com.todomanager`) matches what's registered in Firebase

**Release APK won't install:**
You need to sign the APK with your own keystore. Debug builds use the default debug keystore, but release builds require the upload keystore configured in `gradle.properties`.

## Submission Checklist

- [x] React Native CLI project (no Expo)
- [x] Firebase Authentication with Email/Password
- [x] Session management
- [x] Multiple Todo Lists with full CRUD
- [x] Multiple Todos per list with full CRUD
- [x] AsyncStorage persistence
- [x] Navigation between screens
- [x] Input validation
- [x] Loading states
- [x] Error handling
- [x] No TypeScript errors
- [x] No console logs in production code
- [x] Release APK builds successfully

## Submission Items

1. Source code - the full project folder
2. Git repository - with meaningful commit history
3. APK file - at `android/app/build/outputs/apk/release/app-release.apk`
4. README - this file covers setup and usage
