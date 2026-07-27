"use client";

import {
  Clock3,
  HeartPulse,
  ScrollText,
  UserCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

type DashboardStatsProps = {
  historyCount: number;
  lastSymptoms: string;
  lastUpdated: string;
  latestConditions: { name: string; urgency: string }[];
  userName: string;
  userEmail: string;
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
  profileGender,
  profileAge,
}: DashboardStatsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserCircle2 className="w-4 h-4 text-primary" /> {t.dashboardStats.profile}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">{userName || "Health user"}</p>
            <p className="text-sm text-muted-foreground">
              {userEmail || t.dashboardStats.noEmail}
            </p>
            <div className="flex gap-2 pt-2 flex-wrap">
              <Badge>{profileGender || t.dashboardStats.genderNotSet}</Badge>
              <Badge>
                {profileAge ? `${profileAge} ${t.dashboardStats.years}` : t.dashboardStats.ageNotSet}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ScrollText className="w-4 h-4 text-primary" /> {t.dashboardStats.history}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{historyCount || 0}</p>
            <p className="text-sm text-muted-foreground">
              {t.dashboardStats.savedCheckups}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock3 className="w-4 h-4 text-primary" /> {t.dashboardStats.lastCheck}
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
              <HeartPulse className="w-4 h-4 text-primary" /> {t.dashboardStats.tools}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t.dashboardStats.toolsDesc}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
