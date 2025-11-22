import React from "react";
import { FaCheckCircle } from "react-icons/fa";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 h-80 w-96 shadow-lg text-center flex flex-col items-center justify-center ">
        <FaCheckCircle className="text-5xl text-lime-600" />
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <p className="font-semibold mt-4">{message}</p>
        <p className="mb-4 text-sm">
          {" "}
          Please check your email for confirmation and further instructions.
        </p>
        <button
          onClick={onClose}
          className="search-btn text-white px-4 py-2 rounded shadow"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
};
