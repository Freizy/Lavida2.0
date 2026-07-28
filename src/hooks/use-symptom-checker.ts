"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { analyzeSymptoms, type SymptomAnalysisOutput } from "@/ai/flows/symptom-analysis-flow";
import { useToast } from "@/hooks/use-toast";
import { useHistory } from "@/hooks/use-history";

export function useSymptomChecker(t: { home: { validationAgeEmpty: string; validationAgeInvalid: string; profileSaved: string; profileSavedDesc: string; chatWelcome: string; error: string } }) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomAnalysisOutput | null>(null);
  const [profileRestored, setProfileRestored] = useState(false);

  const prevUidRef = useRef<string | undefined>(undefined);

  const profileRef = useMemo(() => {
    if (!user?.uid || !db) return null;
    return doc(db, "profiles", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  const { items: historyItems, loading: historyLoading, error: historyError } = useHistory();

  useEffect(() => {
    if (prevUidRef.current !== user?.uid) {
      prevUidRef.current = user?.uid;
      if (user?.uid) return;
      setGender("Male");
      setAge("");
      setSymptoms("");
      setResult(null);
      setError(null);
      setProfileRestored(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!profile) {
      setProfileRestored(false);
      return;
    }
    const hasSavedGender = profile.gender === "Female" || profile.gender === "Male";
    const hasSavedAge = profile.age !== null && profile.age !== undefined;
    if (hasSavedGender) setGender(profile.gender);
    if (hasSavedAge) setAge(String(profile.age));
    setProfileRestored(hasSavedGender || hasSavedAge);
  }, [profile]);

  const persistProfile = async (updates: Record<string, unknown>) => {
    if (!user || !db) return;
    await setDoc(
      doc(db, "profiles", user.uid),
      {
        userId: user.uid,
        displayName: user.displayName || null,
        email: user.email || null,
        photoURL: user.photoURL || null,
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!age || !symptoms.trim()) {
      setError(t.home.validationAgeEmpty);
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
      setError(t.home.validationAgeInvalid);
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeSymptoms({ gender, age: ageNum, symptoms: symptoms.trim() });
      setLoading(false);

      if ("error" in response) {
        setError(response.error);
        return;
      }

      setResult(response);

      if (user && db) {
        const isNewProfile = !profile?.gender && !profile?.age;
        await persistProfile({ gender, age: ageNum });
        if (isNewProfile) {
          toast({ title: t.home.profileSaved, description: t.home.profileSavedDesc });
        }
        try {
          await addDoc(collection(db, "history"), {
            userId: user.uid,
            gender,
            age: ageNum,
            symptoms: symptoms.trim(),
            conditions: response.conditions,
            timestamp: serverTimestamp(),
          });
        } catch (saveErr: unknown) {
          console.error("[LaVida] Failed to save history:", saveErr);
        }
      }
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : t.home.error);
    }
  };

  const handleRestart = () => {
    setGender("Male");
    setAge("");
    setSymptoms("");
    setResult(null);
    setError(null);
  };

  const selectHistoryItem = (item: { gender: string; age: number; symptoms: string; conditions: { name: string }[] }) => {
    setGender(item.gender as "Male" | "Female");
    setAge(item.age.toString());
    setSymptoms(item.symptoms);
    setResult({ conditions: item.conditions as SymptomAnalysisOutput['conditions'] });
  };

  return {
    gender, setGender,
    age, setAge,
    symptoms, setSymptoms,
    loading, error, setError,
    result, setResult,
    profileRestored,
    historyItems, historyLoading, historyError,
    handleSubmit, handleRestart, selectHistoryItem,
  };
}
