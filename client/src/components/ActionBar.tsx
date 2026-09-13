import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface ActionBarProps {
  currentStep: number;
  onBack: () => void;
  onContinue: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function ActionBar({ currentStep, onBack, onContinue, onSave, isSaving = false }: ActionBarProps) {
  return (
    <Card className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              disabled={currentStep <= 1}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onSave}
              data-testid="button-save-progress"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Progress"}
            </Button>
            
            <Button 
              className="bg-primary text-white hover:bg-blue-700"
              onClick={onContinue}
              disabled={currentStep >= 4}
              data-testid="button-continue"
            >
              Continue to {currentStep === 1 ? 'Review' : currentStep === 2 ? 'Optimization' : 'Download'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
