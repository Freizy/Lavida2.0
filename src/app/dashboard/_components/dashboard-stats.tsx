"use client";

import {
  Activity,
  CalendarClock,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  ScrollText,
  UserCircle2,
  AlertTriangle,
  Phone,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Calendar,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

type DashboardStatsProps = {
  historyCount: number;
  lastSymptoms: string;
  lastUpdated: string;
  latestConditions: { name: string; urgency: string }[];
  userName: string;
  userEmail: string;
  userPhoto: string | null;
  profileGender: string | null;
  profileAge: number | null;
};

export function DashboardStats({
  historyCount,
  lastSymptoms,
  lastUpdated,
  latestConditions,
  userName,
  userEmail,
  userPhoto,
  profileGender,
  profileAge,
}: DashboardStatsProps) {
  const router = useRouter();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserCircle2 className="w-4 h-4 text-primary" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{userName || "Health user"}</p>
            <p className="text-sm text-muted-foreground">
              {userEmail || "No email on file"}
            </p>
            <div className="flex gap-2 pt-2 flex-wrap">
              <Badge>{profileGender || "Gender not set"}</Badge>
              <Badge>
                {profileAge ? `${profileAge} years` : "Age not set"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ScrollText className="w-4 h-4 text-primary" /> History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{historyCount || 0}</p>
            <p className="text-sm text-muted-foreground">
              Saved symptom checkups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock3 className="w-4 h-4 text-primary" /> Last check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">{lastUpdated}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lastSymptoms}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HeartPulse className="w-4 h-4 text-primary" /> Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Personalized recommendations, reminders, and follow-up support
              are ready for your next step.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
