import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ResumeData } from "@shared/schema";

interface ChangesDialogProps {
  open: boolean;
  before?: ResumeData;
  after?: ResumeData;
  onOpenChange: (open: boolean) => void;
}

export default function ChangesDialog({ open, before, after, onOpenChange }: ChangesDialogProps) {
  const changes = before && after ? [
    ["Summary", before.summary, after.summary],
    ["Skills", before.skills.map((skill) => `${skill.category}: ${skill.items}`).join("\n"), after.skills.map((skill) => `${skill.category}: ${skill.items}`).join("\n")],
    ["Experience bullets", `${before.experience.flatMap((experience) => experience.achievements).length} bullets`, `${after.experience.flatMap((experience) => experience.achievements).length} bullets`],
  ].filter(([, oldValue, newValue]) => oldValue !== newValue) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview changes</DialogTitle>
          <DialogDescription>
            {after ? "Review the changes currently applied to your resume." : "Optimize your resume first to preview changes."}
          </DialogDescription>
        </DialogHeader>
        {!after ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-600">
            No optimized version is available yet.
          </div>
        ) : changes.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-6 text-center text-slate-600">
            No content changes to preview.
          </div>
        ) : (
          <div className="space-y-4">
            {changes.map(([label, oldValue, newValue]) => (
              <div key={label} className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                    <div className="text-xs font-semibold uppercase text-red-700 mb-1">Before</div>
                    {oldValue}
                  </div>
                  <div className="rounded-lg bg-green-50 border border-green-100 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                    <div className="text-xs font-semibold uppercase text-green-700 mb-1">After</div>
                    {newValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}