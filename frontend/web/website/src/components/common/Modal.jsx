import React from "react";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* ====== Modal Header ====== */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-green-900">{title}</h2>
          <button
            className="text-green-800 hover:text-green-600 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* ====== Modal Content ====== */}
        <div>{children}</div>

        {/* ====== Modal Footer ====== */}
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
