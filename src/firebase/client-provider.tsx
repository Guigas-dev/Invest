'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

let app: ReturnType<typeof initializeFirebase>;

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!app) {
    app = initializeFirebase();
  }

  return (
    <FirebaseProvider
      firebaseApp={app.firebaseApp}
      auth={app.auth}
      firestore={app.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
