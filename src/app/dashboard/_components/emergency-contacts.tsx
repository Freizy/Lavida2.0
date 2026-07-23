"use client";

import { Phone, AlertTriangle, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const emergencyContacts = [
  {
    name: "Emergency Services",
    number: "911",
    description: "Police, Fire, Medical emergencies",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "bg-red-500/10 text-red-600",
  },
  {
    name: "Poison Control",
    number: "1-800-222-1222",
    description: "24/7 poison help hotline",
    icon: <Phone className="w-4 h-4" />,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    name: "Crisis Hotline",
    number: "988",
    description: "Mental health crisis support",
    icon: <Phone className="w-4 h-4" />,
    color: "bg-blue-500/10 text-blue-600",
  },
];

export function EmergencyContacts() {
  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-red-700">
          <Phone className="w-4 h-4" /> Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border bg-white p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${contact.color}`}>
                  {contact.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.description}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-sm">
                {contact.number}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            If this is a medical emergency, call 911 immediately. Do not wait
            for an AI response.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
