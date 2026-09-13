import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Download } from "lucide-react";
import type { ResumeData } from "@shared/schema";

interface ResumeViewerProps {
  resumeData?: ResumeData;
  onEdit: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function ResumeViewer({ resumeData, onEdit, onDownload, isDownloading }: ResumeViewerProps) {
  if (!resumeData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-slate-500">
            <p>No resume data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Current Resume</h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-slate-900"
              onClick={onEdit}
              data-testid="button-edit-resume"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hover:text-slate-900"
              onClick={onDownload}
              disabled={isDownloading}
              data-testid="button-download-resume"
            >
              <Download className="w-4 h-4 mr-1" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6 max-h-[800px] overflow-y-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center pb-4 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-resume-name">
              {resumeData.name}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <span data-testid="text-resume-phone">{resumeData.phone}</span>
              <span data-testid="text-resume-email">{resumeData.email}</span>
              <span data-testid="text-resume-location">{resumeData.location}</span>
              {resumeData.linkedin && (
                <span data-testid="text-resume-linkedin">{resumeData.linkedin}</span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">PROFESSIONAL SUMMARY</h2>
            <p className="text-sm text-slate-700 leading-relaxed" data-testid="text-resume-summary">
              {resumeData.summary}
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">TECHNICAL SKILLS</h2>
            <div className="space-y-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index} data-testid={`skills-category-${index}`}>
                  <h3 className="font-medium text-slate-800 mb-1">{skill.category}:</h3>
                  <p className="text-sm text-slate-700">{skill.items}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">PROFESSIONAL EXPERIENCE</h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-slate-200 pl-4" data-testid={`experience-item-${index}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900" data-testid={`experience-title-${index}`}>
                        {exp.title}
                      </h3>
                      <p className="text-sm text-slate-600" data-testid={`experience-company-${index}`}>
                        {exp.company} | {exp.location}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500" data-testid={`experience-dates-${index}`}>
                      {exp.dates}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} data-testid={`achievement-${index}-${achIndex}`}>
                        • {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">EDUCATION</h2>
            <div className="space-y-2">
              {resumeData.education.map((edu, index) => (
                <div key={index} data-testid={`education-item-${index}`}>
                  <h3 className="font-semibold text-slate-900">
                    {edu.degree} | {edu.field}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {edu.school} | {edu.dates}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
