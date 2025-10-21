"use client";

interface FormValidationAlertProps {
  missingFields: string[];
  onClose?: () => void;
}

export default function FormValidationAlert({ missingFields, onClose }: FormValidationAlertProps) {
  if (missingFields.length === 0) return null;

  return (
    <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 mb-6 animate-shake">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ Prosím doplňte povinné údaje
          </h3>
          <div className="text-sm text-red-700">
            <p className="mb-2">Pred pokračovaním musíte vyplniť tieto polia:</p>
            <ul className="list-disc list-inside space-y-1">
              {missingFields.map((field, index) => (
                <li key={index} className="font-medium">{field}</li>
              ))}
            </ul>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 text-red-600 hover:text-red-800 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}


