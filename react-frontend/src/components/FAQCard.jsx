import React, { useState, useId } from 'react';

const FAQCard = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="bg-white rounded-lg p-4 border-t border-gray-200">
      <div className="flex items-start gap-4">
        <h2 className="text-[16px] md:text-[18px] lg:text-[24px] [font-family:'Sky_Text',Helvetica]">
          {question}
        </h2>

        <div className="ml-auto">
          <button
            aria-expanded={open}
            aria-controls={`faq-${id}`}
            onClick={() => setOpen((s) => !s)}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            title={open ? 'Collapse answer' : 'Show answer'}
          >
            <span className="text-xl font-bold leading-none">{open ? '−' : '+'}</span>
            <span className="sr-only">{open ? 'Collapse' : 'Expand'}</span>
          </button>
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
        <p className="text-[15px] md:text-[16px] lg:text-[18px]">{answer}</p>
      </div>
    </div>
  );
};

export default FAQCard;