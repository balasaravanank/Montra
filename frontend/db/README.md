# Database Directory

This directory contains database configurations, schema documentation, and security rules.

## Firestore Security Rules

Copy these rules to your [Firebase Console](https://console.firebase.google.com/) -> Firestore Database -> Rules tab.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to subcollections (transactions, budgets, goals)
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Schema

- **users/{userId}**
  - `transactions/{transactionId}`
  - `budgets/{category}`
  - `goals/{goalId}`
