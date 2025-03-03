export const AlertDialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => onOpenChange(false)}
        />
        <div className="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
          {children}
        </div>
      </div>
    );
  };
  
  export const AlertDialogContent = ({ children, className = "" }) => (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
  
  export const AlertDialogHeader = ({ children, className = "" }) => (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
  
  export const AlertDialogTitle = ({ children, className = "" }) => (
    <h2 className={`text-lg font-semibold ${className}`}>
      {children}
    </h2>
  );
  
  export const AlertDialogDescription = ({ children, className = "" }) => (
    <div className={`text-sm text-gray-500 ${className}`}>
      {children}
    </div>
  );
  
  export const AlertDialogFooter = ({ children, className = "" }) => (
    <div className={`flex justify-end space-x-2 mt-4 ${className}`}>
      {children}
    </div>
  );
  
  export const AlertDialogAction = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 ${className}`}
    >
      {children}
    </button>
  );
  
  export const AlertDialogCancel = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 ${className}`}
    >
      {children}
    </button>
  );