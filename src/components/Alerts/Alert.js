// components/Alert.js
export const Alert = ({ children, className = "" }) => (
    <div className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
  
  export const AlertTitle = ({ children, className = "" }) => (
    <h5 className={`font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
  
  export const AlertDescription = ({ children, className = "" }) => (
    <div className={`mt-1 text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );