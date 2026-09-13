import { Bot, HelpCircle, User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">ResumeAI</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              data-testid="button-help"
            >
              <HelpCircle className="w-4 h-4 mr-2 inline" />
              Help
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="text-slate-600 w-4 h-4" />
              </div>
              <span className="text-sm text-slate-700">Jason Clark</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
