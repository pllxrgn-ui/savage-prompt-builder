import { BookOpen } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15">
          <BookOpen className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-1">Library</h1>
          <p className="text-text-2 text-sm">Your saved prompts, recipes, and generated media.</p>
        </div>
      </div>

      {/* Library grid - placeholder */}
      <div className="rounded-xl border border-border border-dashed bg-surface p-12 flex items-center justify-center">
        <p className="text-text-3 text-sm">
          Library view will be implemented in Phase 3.
        </p>
      </div>
    </div>
  );
}
