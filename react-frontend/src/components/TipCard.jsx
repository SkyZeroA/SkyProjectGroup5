import React, { useState } from "react";

const TipCard = ({ tip, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);

  const handleDelete = async () => {
    // Show "Generating Tip..." placeholder
    setIsDeleting(true);
    await onDelete(); // parent handles the API call and replacement
    setIsDeleting(false);
		setIsHoveringDelete(false);
  };

  return (
    <div
      className={`
        w-full flex items-center justify-between p-4 py-8 rounded-md transition-all duration-150
        ${isDeleting ? "bg-gray-100" : "bg-white"}
        ${isHoveringDelete ? "opacity-50" : "opacity-100"}
        hover:border hover:border-gray-300
      `}
      style={{ minHeight: "100px" }} // ensures consistent height
    >
      {isDeleting ? (
        <div className="w-full text-center text-gray-400 italic [font-family:'Sky_Text',Helvetica] font-normal text-[20px]">
          Generating Tip…
        </div>
      ) : (
        <>
          <div className="w-full [font-family:'Sky_Text',Helvetica] font-normal text-[20px] pr-4">
            {tip}
          </div>
          <button
            onMouseEnter={() => setIsHoveringDelete(true)}
            onMouseLeave={() => setIsHoveringDelete(false)}
            onClick={handleDelete}
            className="text-gray-500 text-lg hover:text-red-500 transition-colors flex-shrink-0"
          >
            ⨉
          </button>
        </>
      )}
    </div>
  );
};

export default TipCard;
