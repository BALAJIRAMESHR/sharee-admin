import React from 'react';
import { X } from 'lucide-react';

const DeleteVariantConfirmation = ({ variant, onClose, onConfirm }) => {
  const handleConfirm = async (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    await onConfirm(variant._id);
  };

  const handleClose = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-[400px] text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delete Variant</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the variant "{variant.variantName}"?
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVariantConfirmation; 