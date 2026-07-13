"use client";

import React, { useEffect, useState } from "react";
import { initializeFirebase } from "./index";
import { FirebaseProvider } from "./provider";
import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState<{
    app: FirebaseApp | null;
    firestore: Firestore | null;
    auth: Auth | null;
  }>({
    app: null,
    firestore: null,
    auth: null,
  });

  useEffect(() => {
    const { app, firestore, auth } = initializeFirebase();
    setInstances({ app, firestore, auth });
  }, []);

  return (
    <FirebaseProvider
      app={instances.app}
      firestore={instances.firestore}
      auth={instances.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
