interface LoadingModalProps {
  isVisible: boolean;
}

export default function LoadingModal({ isVisible }: LoadingModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="loading-modal">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">AI is optimizing your resume...</h3>
        <p className="text-sm text-slate-600">This may take a few moments. Please don't close this window.</p>
        <div className="mt-4 bg-slate-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}
