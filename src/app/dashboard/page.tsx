"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser, useFirestore, useDoc } from "@/firebase";
import {
  collection,
  doc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useCollection } from "@/firebase";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

import { DashboardStats } from "./_components/dashboard-stats";
import { HealthOverview } from "./_components/health-overview";
import { HealthScore } from "./_components/health-score";
import { QuickActions } from "./_components/quick-actions";
import { HealthTips } from "./_components/health-tips";
import { EmergencyContacts } from "./_components/emergency-contacts";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const profileLoadedRef = useRef(false);
  const [profileForm, setProfileForm] = useState<{
    gender: "Male" | "Female";
    age: string;
  }>({
    gender: "Male",
    age: "",
  });

  const profileRef = useMemo(() => {
    if (!user?.uid || !db) return null;
    return doc(db, "profiles", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(profileRef);

  const historyQuery = useMemo(() => {
    if (!user?.uid || !db) return null;

    return query(
      collection(db, "history"),
      where("userId", "==", user.uid),
    );
  }, [user?.uid, db]);

  const { data: rawHistoryItems, loading: historyLoading } =
    useCollection(historyQuery);

  const historyItems = useMemo(() => {
    if (!rawHistoryItems) return null;
    return [...rawHistoryItems].sort((a, b) => {
      const aTime = a.timestamp?.toDate?.()?.getTime?.() || 0;
      const bTime = b.timestamp?.toDate?.()?.getTime?.() || 0;
      return bTime - aTime;
    });
  }, [rawHistoryItems]);

  useEffect(() => {
    if (!profile || profileLoadedRef.current) return;

    profileLoadedRef.current = true;
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

    if (!user?.uid || !db) return;

    const genderVal = profileForm.gender;
    const ageVal = profileForm.age ? Number(profileForm.age) : null;

    setSavingProfile(true);
    setProfileStatus(null);

    try {
      const ref = doc(db, "profiles", user.uid);
      await setDoc(
        ref,
        {
          userId: user.uid,
          gender: genderVal,
          age: ageVal,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setProfileStatus("Profile saved successfully");
      toast({
        title: "Profile updated",
        description: "Your gender and age have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save profile", error);
      setProfileStatus("Failed to save profile. Please try again.");
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
      });
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
              <p className="text-sm text-muted-foreground">{t.dashboard.welcome}</p>
              <h1 className="text-3xl font-bold">{t.dashboard.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                {t.dashboard.subtitle}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push("/")}
              >
                {t.dashboard.quickCheck}
              </Button>
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
            <HealthScore historyItems={historyItems || []} />

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCircle2 className="w-4 h-4 text-primary" /> {t.dashboard.profileSettings}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveProfile} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t.home.gender}
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
                        <option value="Male">{t.home.male}</option>
                        <option value="Female">{t.home.female}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        {t.home.age}
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
                        placeholder={t.home.agePlaceholder}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Saving..." : t.dashboard.saveProfile}
                  </Button>

                  {profileStatus ? (
                    <p className="text-sm text-green-600 font-medium">
                      {profileStatus}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarClock className="w-4 h-4 text-primary" /> {t.dashboard.healthSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border bg-primary/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="w-4 h-4" /> {t.dashboard.healthSummary}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lastSymptoms}
                  </p>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="w-4 h-4 text-primary" /> {t.dashboard.conditions}
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
                        {t.dashboard.noConditions}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <HeartPulse className="w-4 h-4 text-primary" /> Care continuity
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your previous checkups remain available in one place for quick follow-up.
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
