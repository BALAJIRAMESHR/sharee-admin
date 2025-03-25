import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { variantService } from "../../../services/variantService";
import DeleteVariantConfirmation from "./DeleteVariantConfirmation";

const StyledVariantDropdown = ({
  variants,
  value,
  onChange,
  onVariantDeleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteVariant = async (variantId) => {
    try {
      await variantService.deleteVariant(variantId);
      setVariantToDelete(null);
      if (onVariantDeleted) {
        await onVariantDeleted();
      }
    } catch (error) {
      console.error("Failed to delete variant:", error);
    }
  };

  const handleSelect = (variantName) => {
    onChange({ target: { value: variantName } });
    setIsOpen(false);
  };

  const handleDeleteClick = (e, variant) => {
    e.preventDefault();
    e.stopPropagation();
    setVariantToDelete(variant);
    setIsOpen(false); // Close dropdown when delete is clicked
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Custom dropdown trigger */}
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer flex justify-between items-center"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || "Select Variant"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="py-1">
            <div
              className="px-4 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleSelect("");
              }}
            >
              Select Variant
            </div>
            {variants.map((variant) => (
              <div
                key={variant._id}
                className="px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
              >
                <div
                  className="flex-grow cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(variant.variantName);
                  }}
                >
                  {variant.variantName}
                </div>
                <button
                  type="button" // Add type="button" to prevent form submission
                  onClick={(e) => handleDeleteClick(e, variant)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {variantToDelete && (
        <DeleteVariantConfirmation
          variant={variantToDelete}
          onClose={(e) => {
            if (e) e.preventDefault();
            setVariantToDelete(null);
          }}
          onConfirm={async (variantId) => {
            await handleDeleteVariant(variantId);
          }}
        />
      )}
    </div>
  );
};

export default StyledVariantDropdown;
