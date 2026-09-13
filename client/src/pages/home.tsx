import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ProgressIndicator from "@/components/ProgressIndicator";
import ResumeViewer from "@/components/ResumeViewer";
import OptimizationPanel from "@/components/OptimizationPanel";
import ActionBar from "@/components/ActionBar";
import LoadingModal from "@/components/LoadingModal";
import ResumeEditorDialog from "@/components/ResumeEditorDialog";
import ChangesDialog from "@/components/ChangesDialog";
import type { ResumeData, ATSScore, OptimizationSettings } from "@shared/schema";

type ResumeSuggestion = ATSScore["suggestions"][number];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(2); // Start at review step
  const [optimizedResume, setOptimizedResume] = useState<ResumeData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isChangesOpen, setIsChangesOpen] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Default optimization settings
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    keywordEnhancement: true,
    impactStatements: true,
    summaryOptimization: false,
    skillsEnhancement: false,
    targetJobField: "Information Technology",
    experienceLevel: "senior"
  });

  // Fetch initial resume data
  const { data: initialResume, isLoading: isLoadingResume, isError: isResumeError } = useQuery<
    { data: ResumeData },
    Error,
    ResumeData
  >({
    queryKey: ["/api/resume/initial"],
    select: (response) => response.data
  });

  const resumeForAnalysis = optimizedResume || initialResume;

  // Fetch ATS score
  const { data: atsScore, isLoading: isLoadingATS } = useQuery<
    { atsScore: ATSScore },
    Error,
    ATSScore
  >({
    queryKey: ["/api/resume/ats-score", resumeForAnalysis, optimizationSettings.targetJobField],
    enabled: !!resumeForAnalysis,
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/resume/ats-score", {
        resumeData: resumeForAnalysis,
        targetField: optimizationSettings.targetJobField
      });
      return response.json();
    },
    select: (response) => response.atsScore
  });

  // Fetch suggestions
  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery<
    { suggestions: ResumeSuggestion[] },
    Error,
    ResumeSuggestion[]
  >({
    queryKey: ["/api/resume/suggestions", resumeForAnalysis, optimizationSettings.targetJobField],
    enabled: !!resumeForAnalysis,
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/resume/suggestions", {
        resumeData: resumeForAnalysis,
        targetField: optimizationSettings.targetJobField
      });
      return response.json();
    },
    select: (response) => response.suggestions
  });

  const currentResume = optimizedResume || initialResume;
  const visibleSuggestions = (suggestions || []).filter((_suggestion: ResumeSuggestion, index: number) => !dismissedSuggestions.includes(index));

  // Optimize resume mutation
  const optimizeMutation = useMutation({
    mutationFn: async (settingsOverride?: OptimizationSettings) => {
      const response = await apiRequest("POST", "/api/resume/optimize", {
        resumeData: currentResume,
        settings: settingsOverride || optimizationSettings
      });
      return response.json();
    },
    onSuccess: (data) => {
      setOptimizedResume(data.optimizedData);
      setCurrentStep(3);
      toast({
        title: "Resume Optimized Successfully!",
        description: "Your resume has been enhanced with AI-powered improvements."
      });
      // Invalidate ATS score to recalculate with optimized data
      queryClient.invalidateQueries({ 
        queryKey: ["/api/resume/ats-score"] 
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/resume/suggestions"]
      });
    },
    onError: (error: any) => {
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to optimize resume. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsOptimizing(false);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!currentResume) throw new Error("There is no resume to save yet.");
      const response = await apiRequest("POST", "/api/resume/save", {
        originalContent: JSON.stringify(initialResume || currentResume),
        optimizedContent: JSON.stringify(currentResume),
        parsedData: currentResume,
        atsScore,
        optimizationSettings,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "Your current resume, settings, and ATS results were saved."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message || "Could not save your progress.",
        variant: "destructive"
      });
    }
  });

  // Download PDF mutation
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/resume/download-pdf", {
        resumeData: optimizedResume || initialResume
      });
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${(optimizedResume || initialResume)?.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setCurrentStep(4);
      toast({
        title: "Download Complete",
        description: "Your optimized resume has been downloaded successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleOptimize = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate(undefined);
  };

  const handleApplySuggestion = (index: number) => {
    const suggestion = visibleSuggestions[index];
    if (!suggestion) return;
    const nextSettings: OptimizationSettings = { ...optimizationSettings };
    if (suggestion.type === "keyword") nextSettings.keywordEnhancement = true;
    if (suggestion.type === "achievement") nextSettings.impactStatements = true;
    if (suggestion.type === "skills") nextSettings.skillsEnhancement = true;
    if (suggestion.type === "structure") nextSettings.summaryOptimization = true;
    setOptimizationSettings(nextSettings);
    setIsOptimizing(true);
    optimizeMutation.mutate(nextSettings);
  };

  const handleDismissSuggestion = (index: number) => {
    const originalIndex = (suggestions || []).findIndex((suggestion: ResumeSuggestion) => suggestion === visibleSuggestions[index]);
    if (originalIndex >= 0) setDismissedSuggestions((current) => [...current, originalIndex]);
  };

  const handleEditSave = (resumeData: ResumeData) => {
    setOptimizedResume(resumeData);
    setCurrentStep(2);
    setDismissedSuggestions([]);
    toast({
      title: "Resume updated",
      description: "Your edits are now used for ATS scoring and optimization."
    });
  };

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  const handleSettingsChange = (newSettings: Partial<OptimizationSettings>) => {
    setOptimizationSettings(prev => ({ ...prev, ...newSettings }));
    // Invalidate ATS score when target field changes
    if (newSettings.targetJobField) {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/resume/ats-score"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/resume/suggestions"] 
      });
    }
  };

  if (isLoadingResume) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading resume data...</p>
        </div>
      </div>
    );
  }

  if (isResumeError || !initialResume) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Resume could not be loaded</h1>
          <p className="text-slate-600">Refresh the page to try again. If the problem continues, check the application logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <ProgressIndicator currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Current Resume */}
          <ResumeViewer 
            resumeData={currentResume}
            onEdit={() => setIsEditorOpen(true)}
            onDownload={handleDownload}
            isDownloading={downloadMutation.isPending}
          />

          {/* Right Panel - AI Optimization Tools */}
          <OptimizationPanel
            atsScore={atsScore}
            suggestions={visibleSuggestions}
            optimizationSettings={optimizationSettings}
            onSettingsChange={handleSettingsChange}
            onOptimize={handleOptimize}
            onPreviewChanges={() => setIsChangesOpen(true)}
            onApplySuggestion={handleApplySuggestion}
            onDismissSuggestion={handleDismissSuggestion}
            isOptimizing={optimizeMutation.isPending}
            isLoadingATS={isLoadingATS}
            isLoadingSuggestions={isLoadingSuggestions}
          />
        </div>

        {/* Bottom Action Bar */}
        <ActionBar
          currentStep={currentStep}
          onBack={() => setCurrentStep(Math.max(1, currentStep - 1))}
          onContinue={() => setCurrentStep(Math.min(4, currentStep + 1))}
            onSave={() => saveMutation.mutate()}
            isSaving={saveMutation.isPending}
        />
      </div>

      {/* Loading Modal */}
      <LoadingModal isVisible={isOptimizing} />
      <ResumeEditorDialog
        open={isEditorOpen}
        resumeData={currentResume}
        onOpenChange={setIsEditorOpen}
        onSave={handleEditSave}
      />
      <ChangesDialog
        open={isChangesOpen}
        before={initialResume}
        after={optimizedResume || undefined}
        onOpenChange={setIsChangesOpen}
      />
    </div>
  );
}
