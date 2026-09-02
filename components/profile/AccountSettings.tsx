"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
  actionLabel: string;
  type: "button" | "toggle";
  status?: boolean;
}

interface AccountSettingsProps {
  settings: SettingsItem[];
}

export function AccountSettings({ settings }: AccountSettingsProps) {
  return (
    <Card className="border-primary/30 bg-card/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-primary">Paramètres du Compte</CardTitle>
        <CardDescription>Gérez votre compte et vos préférences</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="relative p-4 bg-accent/15 border border-primary/20 rounded-sm hover:border-primary/50 transition-colors flex items-center justify-between"
            style={{
              clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
            }}
          >
            {/* Coins */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

            <div className="flex items-start gap-4 flex-1">
              <div className="text-2xl mt-0.5">{setting.icon}</div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{setting.label}</h4>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
            </div>

            {setting.type === "button" ? (
              <Button
                onClick={setting.action}
                className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-xs h-8 whitespace-nowrap ml-4"
              >
                {setting.actionLabel}
              </Button>
            ) : (
              <label className="flex items-center cursor-pointer ml-4">
                <span className="sr-only">{setting.label}</span>
                <input
                  type="checkbox"
                  checked={setting.status || false}
                  onChange={() => setting.action()}
                  className="w-5 h-5 rounded accent-primary"
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
