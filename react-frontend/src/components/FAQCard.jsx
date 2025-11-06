import React, { useState, useId } from 'react';

const FAQCard = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <button
      className="w-full text-left bg-white rounded-lg p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors"
      aria-expanded={open}
      aria-controls={`faq-${id}`}
      onClick={() => setOpen((s) => !s)}
    >
      <div className="flex items-start gap-4">
        <h2 className="text-[16px] md:text-[18px] lg:text-[24px] [font-family:'Sky_Text',Helvetica] flex-1">
          {question}
        </h2>

        <div
          className="flex-none flex items-center justify-center w-9 h-9 bg-transparent text-gray-700"
          aria-hidden="true"
        >
          <span className="text-xl font-bold leading-none select-none">{open ? '−' : '+'}</span>
        </div>
      </div>

      <div
        id={`faq-${id}`}
        role="region"
        aria-hidden={!open}
        className={`mt-4 text-gray-700 [font-family:'Sky_Text',Helvetica] transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-[15px] md:text-[16px] lg:text-[18px] text-left">{answer}</p>
      </div>
    </button>
  );
};

export default FAQCard;