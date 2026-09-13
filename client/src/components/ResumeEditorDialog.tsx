import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeData } from "@shared/schema";

interface ResumeEditorDialogProps {
  open: boolean;
  resumeData?: ResumeData;
  onOpenChange: (open: boolean) => void;
  onSave: (resumeData: ResumeData) => void;
}

export default function ResumeEditorDialog({ open, resumeData, onOpenChange, onSave }: ResumeEditorDialogProps) {
  const [draft, setDraft] = useState<ResumeData | undefined>(resumeData);

  useEffect(() => {
    if (open) setDraft(resumeData ? JSON.parse(JSON.stringify(resumeData)) : undefined);
  }, [open, resumeData]);

  if (!draft) return null;

  const updateDraft = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit resume</DialogTitle>
          <DialogDescription>Make changes before analyzing or downloading your resume.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["name", "phone", "email", "location", "linkedin"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={`resume-${field}`}>{field === "linkedin" ? "LinkedIn" : field[0].toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={`resume-${field}`}
                  value={draft[field] || ""}
                  onChange={(event) => updateDraft(field, event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume-summary">Professional summary</Label>
            <Textarea
              id="resume-summary"
              value={draft.summary}
              onChange={(event) => updateDraft("summary", event.target.value)}
              className="min-h-28"
            />
          </div>

          <div className="space-y-4">
            <Label>Skills</Label>
            {draft.skills.map((skill, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3">
                <Input
                  aria-label={`Skill category ${index + 1}`}
                  value={skill.category}
                  onChange={(event) => {
                    const skills = [...draft.skills];
                    skills[index] = { ...skills[index], category: event.target.value };
                    updateDraft("skills", skills);
                  }}
                />
                <Input
                  aria-label={`Skill items ${index + 1}`}
                  value={skill.items}
                  onChange={(event) => {
                    const skills = [...draft.skills];
                    skills[index] = { ...skills[index], items: event.target.value };
                    updateDraft("skills", skills);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Experience</Label>
            {draft.experience.map((experience, index) => (
              <div key={index} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    aria-label={`Job title ${index + 1}`}
                    value={experience.title}
                    onChange={(event) => {
                      const experienceList = [...draft.experience];
                      experienceList[index] = { ...experienceList[index], title: event.target.value };
                      updateDraft("experience", experienceList);
                    }}
                  />
                  <Input
                    aria-label={`Company ${index + 1}`}
                    value={experience.company}
                    onChange={(event) => {
                      const experienceList = [...draft.experience];
                      experienceList[index] = { ...experienceList[index], company: event.target.value };
                      updateDraft("experience", experienceList);
                    }}
                  />
                  <Input
                    aria-label={`Location ${index + 1}`}
                    value={experience.location}
                    onChange={(event) => {
                      const experienceList = [...draft.experience];
                      experienceList[index] = { ...experienceList[index], location: event.target.value };
                      updateDraft("experience", experienceList);
                    }}
                  />
                  <Input
                    aria-label={`Dates ${index + 1}`}
                    value={experience.dates}
                    onChange={(event) => {
                      const experienceList = [...draft.experience];
                      experienceList[index] = { ...experienceList[index], dates: event.target.value };
                      updateDraft("experience", experienceList);
                    }}
                  />
                </div>
                <Textarea
                  aria-label={`Achievements ${index + 1}`}
                  value={experience.achievements.join("\n")}
                  onChange={(event) => {
                    const experienceList = [...draft.experience];
                    experienceList[index] = {
                      ...experienceList[index],
                      achievements: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                    };
                    updateDraft("experience", experienceList);
                  }}
                  placeholder="One achievement per line"
                  className="min-h-24"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSave(draft); onOpenChange(false); }}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}