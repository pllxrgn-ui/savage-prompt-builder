"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccentPicker } from "@/components/ui/AccentPicker";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15">
          <SettingsIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-1">Settings</h1>
          <p className="text-text-2 text-sm">Customize your experience.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Theme Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Theme</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-2 border border-border">
            <div className="flex-1">
              <p className="text-sm text-text-1 font-medium">Appearance</p>
              <p className="text-xs text-text-3 mt-0.5">Toggle between dark and light mode</p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Accent Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Accent Color</h2>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="text-sm text-text-1 font-medium mb-4">Choose your accent</p>
            <AccentPicker />
          </div>
        </section>

        {/* More settings coming later */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-1 uppercase tracking-wider">Generator</h2>
          <div className="rounded-xl border border-border border-dashed bg-surface p-8 flex items-center justify-center">
            <p className="text-text-3 text-sm">
              Default generator and API keys will be added in a future phase.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
