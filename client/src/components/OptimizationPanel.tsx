import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wand2, Eye, Lightbulb, CheckCircle } from "lucide-react";
import type { ATSScore, OptimizationSettings } from "@shared/schema";

interface OptimizationPanelProps {
  atsScore?: ATSScore;
  suggestions?: Array<{
    type: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  optimizationSettings: OptimizationSettings;
  onSettingsChange: (settings: Partial<OptimizationSettings>) => void;
  onOptimize: () => void;
  onPreviewChanges: () => void;
  onApplySuggestion: (index: number) => void;
  onDismissSuggestion: (index: number) => void;
  isOptimizing: boolean;
  isLoadingATS: boolean;
  isLoadingSuggestions: boolean;
}

export default function OptimizationPanel({
  atsScore,
  suggestions = [],
  optimizationSettings,
  onSettingsChange,
  onOptimize,
  onPreviewChanges,
  onApplySuggestion,
  onDismissSuggestion,
  isOptimizing,
  isLoadingATS,
  isLoadingSuggestions
}: OptimizationPanelProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-orange-600";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-accent";
    if (score >= 60) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      {/* ATS Score Card */}
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">ATS Compatibility Score</h3>
            <div className="flex items-center space-x-2">
              {isLoadingATS ? (
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className={`text-lg font-bold ${getScoreColor(atsScore?.overall || 0)}`} data-testid="text-ats-score">
                    {atsScore?.overall || 0}
                  </span>
                </div>
              )}
              <span className="text-sm text-slate-600">/ 100</span>
            </div>
          </div>
          
          {atsScore && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Keyword Optimization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(atsScore.keywordOptimization)}`}
                      style={{ width: `${atsScore.keywordOptimization}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600" data-testid="text-keyword-score">
                    {atsScore.keywordOptimization}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Format Compatibility</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(atsScore.formatCompatibility)}`}
                      style={{ width: `${atsScore.formatCompatibility}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600" data-testid="text-format-score">
                    {atsScore.formatCompatibility}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Section Structure</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(atsScore.sectionStructure)}`}
                      style={{ width: `${atsScore.sectionStructure}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600" data-testid="text-structure-score">
                    {atsScore.sectionStructure}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Optimization Tools */}
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Optimization Tools</h3>
          <p className="text-sm text-slate-600">Enhance your resume with AI-powered suggestions</p>
        </div>
        
        <CardContent className="p-6 space-y-4">
          {/* Optimization Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="keyword-enhancement"
                checked={optimizationSettings.keywordEnhancement}
                onCheckedChange={(checked) => 
                  onSettingsChange({ keywordEnhancement: Boolean(checked) })
                }
                data-testid="checkbox-keyword-enhancement"
              />
              <div>
                <Label htmlFor="keyword-enhancement" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Keyword Enhancement
                </Label>
                <p className="text-xs text-slate-600">Add industry-specific keywords to improve ATS matching</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="impact-statements"
                checked={optimizationSettings.impactStatements}
                onCheckedChange={(checked) => 
                  onSettingsChange({ impactStatements: Boolean(checked) })
                }
                data-testid="checkbox-impact-statements"
              />
              <div>
                <Label htmlFor="impact-statements" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Impact Statement Rewriting
                </Label>
                <p className="text-xs text-slate-600">Transform bullet points into quantified achievements</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="summary-optimization"
                checked={optimizationSettings.summaryOptimization}
                onCheckedChange={(checked) => 
                  onSettingsChange({ summaryOptimization: Boolean(checked) })
                }
                data-testid="checkbox-summary-optimization"
              />
              <div>
                <Label htmlFor="summary-optimization" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Professional Summary Optimization
                </Label>
                <p className="text-xs text-slate-600">Craft a compelling executive summary</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="skills-enhancement"
                checked={optimizationSettings.skillsEnhancement}
                onCheckedChange={(checked) => 
                  onSettingsChange({ skillsEnhancement: Boolean(checked) })
                }
                data-testid="checkbox-skills-enhancement"
              />
              <div>
                <Label htmlFor="skills-enhancement" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Skills Section Enhancement
                </Label>
                <p className="text-xs text-slate-600">Reorganize and optimize technical skills</p>
              </div>
            </div>
          </div>

          {/* Target Job Field */}
          <div className="pt-4 border-t border-slate-100">
            <Label className="block text-sm font-medium text-slate-900 mb-2">
              Target Job Field
            </Label>
            <Select 
              value={optimizationSettings.targetJobField} 
              onValueChange={(value) => onSettingsChange({ targetJobField: value })}
            >
              <SelectTrigger data-testid="select-target-job-field">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                <SelectItem value="Network Administration">Network Administration</SelectItem>
                <SelectItem value="Systems Engineering">Systems Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div>
            <Label className="block text-sm font-medium text-slate-900 mb-2">
              Experience Level
            </Label>
            <RadioGroup 
              value={optimizationSettings.experienceLevel} 
              onValueChange={(value: "entry" | "mid" | "senior") => 
                onSettingsChange({ experienceLevel: value })
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="entry" id="entry" data-testid="radio-experience-entry" />
                <Label htmlFor="entry" className="text-sm text-slate-700 cursor-pointer">Entry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mid" id="mid" data-testid="radio-experience-mid" />
                <Label htmlFor="mid" className="text-sm text-slate-700 cursor-pointer">Mid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="senior" id="senior" data-testid="radio-experience-senior" />
                <Label htmlFor="senior" className="text-sm text-slate-700 cursor-pointer">Senior</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <Button 
              className="w-full bg-primary text-white hover:bg-blue-700" 
              onClick={onOptimize}
              disabled={isOptimizing}
              data-testid="button-optimize-resume"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isOptimizing ? "Optimizing..." : "Optimize Resume with AI"}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={onPreviewChanges}
              data-testid="button-preview-changes"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">AI Suggestions</h3>
        </div>
        
        <CardContent className="p-6 space-y-4">
          {isLoadingSuggestions ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-slate-600">Loading suggestions...</p>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  suggestion.priority === 'high' ? 'bg-blue-50' : 'bg-green-50'
                }`}
                data-testid={`suggestion-${index}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  suggestion.priority === 'high' ? 'bg-primary' : 'bg-accent'
                }`}>
                  {suggestion.priority === 'high' ? (
                    <Lightbulb className="text-white w-3 h-3" />
                  ) : (
                    <CheckCircle className="text-white w-3 h-3" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium">{suggestion.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{suggestion.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className={`text-xs font-medium ${
                        suggestion.priority === 'high' ? 'text-primary hover:text-blue-700' : 'text-accent hover:text-green-700'
                      }`}
                      onClick={() => onApplySuggestion(index)}
                      data-testid={`button-apply-suggestion-${index}`}
                    >
                      Apply
                    </button>
                    <button 
                      className="text-xs text-slate-500 hover:text-slate-700"
                      onClick={() => onDismissSuggestion(index)}
                      data-testid={`button-dismiss-suggestion-${index}`}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">
              <p className="text-sm">No suggestions available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
