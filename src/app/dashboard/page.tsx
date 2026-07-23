"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc } from "@/firebase";
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useCollection } from "@/firebase";

import { DashboardStats } from "./_components/dashboard-stats";
import { HealthOverview } from "./_components/health-overview";
import { QuickActions } from "./_components/quick-actions";
import { HealthTips } from "./_components/health-tips";
import { EmergencyContacts } from "./_components/emergency-contacts";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<{
    gender: "Male" | "Female";
    age: string;
  }>({
    gender: "Male",
    age: "",
  });

  const profileRef = useMemo(() => {
    if (!user || !db) return null;
    return doc(db, "profiles", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);

  const historyQuery = useMemo(() => {
    if (!user || !db) return null;

    return query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
  }, [user, db]);

  const { data: historyItems, loading: historyLoading } =
    useCollection(historyQuery);

  useEffect(() => {
    if (!profile) return;

    setProfileForm({
      gender: profile.gender === "Female" ? "Female" : "Male",
      age: profile.age ? profile.age.toString() : "",
    });
  }, [profile]);

  const latestCheckup = historyItems?.[0];
  const lastSymptoms = latestCheckup?.symptoms || "No recent symptom check yet";
  const lastUpdated = latestCheckup?.timestamp?.toDate?.()
    ? latestCheckup.timestamp.toDate().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available yet";
  const latestConditions = latestCheckup?.conditions || [];

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !db || !profileRef) return;

    setSavingProfile(true);
    setProfileStatus(null);

    try {
      await setDoc(
        profileRef,
        {
          userId: user.uid,
          gender: profileForm.gender,
          age: profileForm.age ? Number(profileForm.age) : null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setProfileStatus("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to save profile", error);
      setProfileStatus("Unable to update profile right now.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-background to-background p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="text-3xl font-bold">Your health dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Track your saved profile, revisit your symptom history, and keep
                your health records organized in one place.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push("/")}
              >
                Quick check again
              </Button>
              <Link href="/">
                <Button variant="outline" className="rounded-full">
                  Back to check-up
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <DashboardStats
          historyCount={historyItems?.length || 0}
          lastSymptoms={lastSymptoms}
          lastUpdated={lastUpdated}
          latestConditions={latestConditions}
          userName={user?.displayName || "Health user"}
          userEmail={user?.email || "No email on file"}
          userPhoto={user?.photoURL || null}
          profileGender={profile?.gender || null}
          profileAge={profile?.age || null}
        />

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <HealthOverview
            latestConditions={latestConditions}
            lastSymptoms={lastSymptoms}
            historyCount={historyItems?.length || 0}
          />

          <div className="space-y-4">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCircle2 className="w-4 h-4 text-primary" /> Profile
                  settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveProfile} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Gender
                      </label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            gender: e.target.value as "Male" | "Female",
                          }))
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Age
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={profileForm.age}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            age: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                        placeholder="Enter age"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Saving..." : "Save profile"}
                  </Button>

                  {profileStatus ? (
                    <p className="text-sm text-muted-foreground">
                      {profileStatus}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarClock className="w-4 h-4 text-primary" /> Latest
                  health summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border bg-primary/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="w-4 h-4" /> Personalized health summary
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lastSymptoms}
                  </p>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Detected
                    conditions
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {latestConditions.length ? (
                      latestConditions.map((condition: any, index: number) => (
                        <Badge
                          key={`${condition.name}-${index}`}
                          variant="secondary"
                        >
                          {condition.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No current conditions listed.
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <HeartPulse className="w-4 h-4 text-primary" /> Care
                    continuity
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your previous checkups remain available in one place for
                    quick follow-up.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <QuickActions />

        <div className="grid gap-4 lg:grid-cols-2">
          <HealthTips />
          <EmergencyContacts />
        </div>
      </div>
    </div>
  );
}
