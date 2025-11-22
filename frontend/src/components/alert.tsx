import React from "react";

type ErrorAlertProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center flex flex-col items-center gap-4">
        <p className="text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="search-btn text-white px-4 py-2 rounded text-sm shadow"
        >
          Close
        </button>
      </div>
    </div>
  );
};
