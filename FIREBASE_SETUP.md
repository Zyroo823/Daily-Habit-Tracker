# Firebase Setup Instructions

This guide will help you set up Firebase Authentication and Firestore Database for the Daily Habit Tracker.

## Prerequisites

- A Google account
- Firebase project (already created: `bookkeeper-ca0db`)

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bookkeeper-ca0db`
3. Click the gear icon (⚙️) next to "Project Overview" and select **Project Settings**
4. Scroll down to the "Your apps" section
5. If you haven't added a web app yet:
   - Click the **</>** icon (Web)
   - Enter an app name (e.g., "Daily Habit Tracker")
   - Check "Also set up Firebase Hosting for this app"
   - Click **Register app**
6. Copy the `firebaseConfig` object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 2: Update Firebase Configuration File

1. Open `public/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **Get Started**
3. Click **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **Create Database**
3. Choose a location (select the one closest to your users)
4. Select **Start in Test Mode** (for development)
5. Click **Enable**

**Important:** For production, you'll need to set up proper security rules. See the Security Rules section below.

## Step 5: Set Firestore Security Rules

1. In Firestore Database, click the **Rules** tab
2. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Habits subcollection
      match /habits/{habitId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **Publish**

## Step 6: Test the Application

1. Open `index.html` in a browser or deploy to Firebase Hosting
2. Try signing up with a new account
3. Verify that user data is stored in Firebase Console:
   - Go to **Authentication** to see registered users
   - Go to **Firestore Database** to see habit data

## Deployment to Firebase Hosting

If you want to deploy to Firebase Hosting:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy to Firebase Hosting
firebase deploy
```

## Troubleshooting

### "Firebase is not defined" Error
- Make sure Firebase SDK scripts are loaded before `firebase-config.js`
- Check that `firebase-config.js` is loaded before `script.js`

### "Permission denied" Error
- Check Firestore security rules
- Ensure Authentication is enabled
- Verify user is logged in

### Data not saving
- Check browser console for errors
- Verify Firebase configuration is correct
- Ensure Firestore database is enabled

## Security Notes

- Never commit your actual Firebase configuration to public repositories
- Use environment variables for sensitive data in production
- Update Firestore security rules before going to production
- Consider implementing additional security measures like rate limiting

## Additional Features (Optional)

- **Google Sign-in**: Enable Google Authentication in Firebase Console
- **Email Verification**: Add email verification for new users
- **Password Reset**: Implement forgot password functionality
- **Real-time Updates**: Use Firestore real-time listeners for instant updates

## Support

For more information, visit:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Database Guide](https://firebase.google.com/docs/firestore)
