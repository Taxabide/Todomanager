# Todo Manager

A React Native CLI app built for the practical assessment. Handles Firebase auth, multiple todo lists with full CRUD, and local persistence via AsyncStorage — all with TypeScript and Redux Toolkit.

---

## What's Inside

- Email/password login, registration, and password reset via Firebase Auth
- Persistent login session — closing and reopening the app keeps you logged in
- Create and manage multiple Todo Lists
- Each list holds multiple Todo items with title, description, priority, and due date
- Mark todos as complete, edit them, delete them
- Search, filter (All / Active / Completed), and sort (Newest / Oldest / Priority)
- All todo data stored locally with AsyncStorage — works offline, persists across sessions
- Each user's data is isolated — logging in as a different account shows that user's own lists
- Logout with confirmation dialog
- TypeScript throughout, no `any` shortcuts

---

## Prerequisites

You'll need the following set up on your machine:

- **Node.js** v22.11.0 or higher
- **npm** (comes with Node)
- **Android Studio** with Android SDK — API level 24 or above
- **Java JDK 17** (JDK 11 also works)
- A physical Android device or emulator

> iOS builds require a Mac with Xcode and CocoaPods. The steps are the same otherwise.

---

## Running the Project

**Step 1 — Install dependencies**

```bash
npm install
```

**Step 2 — Firebase setup**

The app uses Firebase Authentication. You need to connect it to a Firebase project:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. In your project, go to **Authentication → Sign-in method** and enable **Email/Password**
3. Add an Android app with package name `com.todomanager`
4. Download `google-services.json` and place it at `android/app/google-services.json`

> Without this file the app will not build.

**Step 3 — Start Metro**

```bash
npm start
```

**Step 4 — Run on Android** (in a second terminal)

```bash
npm run android
```

If Metro is already running on port 8081 from a previous session, it will ask you to use 8082 — just confirm yes.

**Clearing cache** (if you see stale bundle errors):

```bash
npm start -- --reset-cache
```

---

## Building a Release APK

Generate a signing key first (skip if you already have one):

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Move the `.jks` file into `android/app/`, then add these to `android/gradle.properties`:

```
MYAPP_UPLOAD_STORE_FILE=upload-keystore.jks
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=yourpassword
MYAPP_UPLOAD_KEY_PASSWORD=yourpassword
```

Build:

```bash
cd android
./gradlew assembleRelease
```

Output APK: `android/app/build/outputs/apk/release/app-release.apk`

---

## Project Structure

```
src/
├── components/       # Reusable UI — Button, Input, Header, TodoCard, ListCard, etc.
├── constants/        # App-wide constants (app name, storage keys)
├── helpers/          # Error message formatting for Firebase and storage errors
├── hooks/            # useAuth, useTodos, useDebounce
├── navigation/       # AuthNavigator, AppNavigator, RootNavigator
├── redux/            # authSlice, todoSlice, uiSlice, store
├── screens/          # LoginScreen, RegisterScreen, ForgotPasswordScreen,
│                     # SplashScreen, TodoListsScreen, TodoDetailsScreen
├── services/         # firebase.ts (auth calls), storage.ts (AsyncStorage)
├── theme/            # Colors, typography, spacing
├── types/            # All TypeScript interfaces and type definitions
└── utils/            # Validators, search/filter/sort helpers
```

---

## Architecture Decisions

**State management — Redux Toolkit**

I went with Redux Toolkit because the app has shared state across multiple screens (auth status, todo lists, UI state like active filters). Three slices:

- `authSlice` — current user and auth loading/error state
- `todoSlice` — all todo lists and their items
- `uiSlice` — filter mode, sort mode (kept in Redux so selections survive navigation)

**Data persistence — AsyncStorage**

Todo data is saved to AsyncStorage on every write operation (create, edit, delete, toggle). The storage key is namespaced by user ID (`todos_<uid>`), so each account has its own isolated data. On login, the app loads that user's data from storage into Redux. On logout, Redux state is cleared.

I chose AsyncStorage over redux-persist here because I wanted explicit control over when data gets written, rather than auto-syncing the entire Redux store. It also made it straightforward to scope data per user.

**Navigation**

`RootNavigator` listens to Firebase's `onAuthStateChanged` and renders either `AuthNavigator` (Login, Register, ForgotPassword) or `AppNavigator` (TodoLists, TodoDetails) based on auth state. A splash screen shows for ~1.5 seconds while Firebase initializes — prevents a flash of the wrong screen.

**Services layer**

All Firebase calls (`signIn`, `signUp`, `signOut`, `resetPassword`) live in `services/firebase.ts`. All AsyncStorage operations live in `services/storage.ts`. Components and hooks never call Firebase or AsyncStorage directly — they go through these service functions. This keeps the logic easy to test or swap out.

**Custom hooks**

`useAuth` and `useTodos` wrap Redux dispatch calls and expose clean functions like `login(email, password)` or `addNewList(title)` to screens. Screens just call these without knowing anything about Redux internals.

---

## Tech Stack

| What | Version |
|------|---------|
| React Native CLI | 0.86.0 |
| React | 19.2.3 |
| TypeScript | 5.x |
| Firebase Auth | @react-native-firebase 21.x |
| Redux Toolkit | 2.x |
| React Navigation | v7 (native stack) |
| AsyncStorage | 3.x |
| react-native-vector-icons | 10.x (MaterialCommunityIcons) |
| react-native-reanimated | 4.x |

---

## Known Limitations / Notes

**Windows path length issue with CMake**

The Android build is configured to only compile for `arm64-v8a` (set in `android/gradle.properties`). This is intentional — on Windows, the full path to native module build artifacts can exceed the 260-character path limit, breaking CMake compilation for libraries like react-native-reanimated. Limiting to one ABI keeps the paths short enough. On Mac/Linux this restriction can be removed to build for all architectures.

**No cloud sync for todos**

Todo data is stored locally only. If you log into the same account on a different device, that device will start with an empty list. The assessment spec asked for AsyncStorage persistence, so cloud sync was out of scope.

---

## Troubleshooting

**Green status bar on Android**
If you see a teal/green status bar instead of the white one, do a clean rebuild:
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**Build fails with "file path too long" on Windows**
Already handled by restricting to `arm64-v8a`. If it still fails, run `./gradlew clean` and retry.

**Metro stuck or shows old code**
```bash
npm start -- --reset-cache
```

**Firebase "auth/network-request-failed"**
Make sure your emulator or device has internet access, and that `google-services.json` matches the package name `com.todomanager`.

---

## Submission

- Source code — this repository
- Git history — meaningful commits covering setup, auth, todo CRUD, navigation, persistence
- APK — `android/app/build/outputs/apk/release/app-release.apk`
- README — this file
