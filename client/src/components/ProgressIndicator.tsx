interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = ["Upload", "Review", "Optimize", "Download"];
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-900">Resume Optimization Progress</h2>
        <span className="text-sm text-slate-600">Step {currentStep} of {steps.length}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        {steps.map((step, index) => (
          <span 
            key={step}
            className={`${index + 1 === currentStep ? 'font-medium text-primary' : ''}`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
