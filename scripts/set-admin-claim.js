/*
This script is used to set a custom claim on a Firebase user, granting them admin privileges.
You need to have a service account key file for your Firebase project to run this.

Instructions:
1. Go to your Firebase project settings > Service accounts.
2. Generate a new private key and save the downloaded JSON file.
3. Rename the file to 'serviceAccountKey.json' and place it in this 'scripts' directory.
4. Get the UID of the user you want to make an admin from the Firebase Authentication page.
5. Replace 'REPLACE_WITH_USER_UID' below with the actual user UID.
6. Run this script from your project's root directory using: node scripts/set-admin-claim.js
*/

const admin = require('firebase-admin');

// IMPORTANT: Replace this with the UID of the user you want to make an admin.
const uid = 'REPLACE_WITH_USER_UID';

try {
    const serviceAccount = require('./serviceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    if (!uid || uid === 'REPLACE_WITH_USER_UID') {
        throw new Error("Please replace 'REPLACE_WITH_USER_UID' with a valid Firebase User UID in the script.");
    }

    admin.auth().setCustomUserClaims(uid, { admin: true })
        .then(() => {
            console.log(`✅ Successfully set admin claim for user: ${uid}`);
            console.log('Log out and log back in to see the changes.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error setting custom claim:', error.message);
            process.exit(1);
        });

} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error("❌ Error: 'serviceAccountKey.json' not found in the 'scripts' directory.");
        console.error("Please follow the instructions at the top of this script to download and place it correctly.");
    } else {
        console.error('❌ An unexpected error occurred:', error.message);
    }
    process.exit(1);
}
