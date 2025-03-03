export const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => onOpenChange(false)}
        />
        <div className="relative z-50 w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    );
  };
  
  export const DialogContent = ({ children, className = "" }) => (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
  
  export const DialogHeader = ({ children, className = "" }) => (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
  
  export const DialogTitle = ({ children, className = "" }) => (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
  
  export const DialogFooter = ({ children, className = "" }) => (
    <div className={`flex justify-end space-x-2 mt-4 ${className}`}>
      {children}
    </div>
  );
  