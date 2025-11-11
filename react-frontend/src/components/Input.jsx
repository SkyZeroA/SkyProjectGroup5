import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Input = ({ className, type, label, errorMessage, showError, showPasswordToggle, onPasswordToggle, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const hasValue = props.value && String(props.value).length > 0;
    const shouldShowError = showError && hasBeenTouched && !isFocused && !hasValue;

    // Determine border and label colors
    let borderColor = "#4A4A4A"; // Default grey
    let labelColor = "#4A4A4A"; // Default grey
    
    if (isFocused) {
      borderColor = "#0066CC"; // Blue when focused
      labelColor = "#0066CC";
    } else if (hasBeenTouched && !hasValue) {
      borderColor = "#dd1618"; // Red when error
      labelColor = "#dd1618";
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          {label && (
            <label
              htmlFor={props.id}
              className={
                `absolute left-3 bg-white px-2 transition-all duration-200 pointer-events-none
                [font-family:'Sky_Text',Helvetica] font-normal text-[15px] leading-[22.5px]"
                ${isFocused || props.value || hasBeenTouched ? "-top-2 text-[15px]" : "top-1/2 -translate-y-1/2 text-[15px]"}`
              }

              style={{ color: labelColor }}
            >
              {label}
            </label>
          )}
          <input
            type={type}
            className={`flex h-[54px] w-full rounded-[3px] bg-white px-3 py-2 text-sm transition-colors
              file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-0
              disabled:cursor-not-allowed disabled:opacity-50
              "[font-family:'Sky_Text',Helvetica] font-normal",
              ${className}`}
            style={{
              borderWidth: isFocused ? "2px" : "1px",
              borderColor: borderColor,
              borderStyle: "solid"
            }}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              setHasBeenTouched(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {showPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={type === "password" ? "Show password" : "Hide password"}
          >
            {type === "password" ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        </div>
        <div className="overflow-hidden">
          <div
            className={`transition-all duration-300 ease-in-out ${
              shouldShowError
                ? "max-h-8 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2"
            }`}
          >
            <p className="text-[#dd1618] [font-family:'Sky_Text',Helvetica] font-normal text-[15px] leading-[22.5px]">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    );
};
Input.displayName = "Input";

export default Input ;