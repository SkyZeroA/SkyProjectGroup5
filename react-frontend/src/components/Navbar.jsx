import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

const Navbar = ({ username, setIsFormOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const mainLinks = [
    { label: "Dashboard", onClick: () => navigate("/dashboard") },
    { label: "Statistics", onClick: () => navigate("/stats") },
  ];

  const userLinks = [
    { label: username, onClick: () => navigate("/profile") },
    { label: "Sign Out", onClick: () => navigate("/") },
  ];

  return (
    <div className="relative w-full flex items-center justify-between [font-family:'Sky_Text',Helvetica] text-[16.5px] leading-[24.8px]">
      
      {/* LEFT SIDE: Navigation Links (desktop only) */}
      <div className="hidden md:flex gap-6 items-center">
        {mainLinks.map((link) => (
          <Button
            key={link.label}
            variant="link"
            className="text-grey-900"
            onClick={link.onClick}
          >
            {link.label}
          </Button>
        ))}
      </div>

      {/* CENTER: Log Activities Button (always visible) */}
      <div className="flex justify-center flex-grow md:flex-grow-0">
        <Button
          variant="link"
          className="text-[var(--log-color)] whitespace-nowrap"
          onClick={() => setIsFormOpen(true)}
        >
          Log your Activities
        </Button>
      </div>

      {/* RIGHT SIDE: User links (desktop) */}
      <div className="hidden md:flex gap-4 items-center">
        {userLinks.map((link) => (
          <Button
            key={link.label}
            variant="link"
            className="text-grey-900"
            onClick={link.onClick}
          >
            {link.label}
          </Button>
        ))}
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 text-gray-700 focus:outline-none"
      >
        {menuOpen ? (
          <span className="text-2xl font-bold">✕</span>
        ) : (
          <span className="text-2xl">☰</span>
        )}
      </button>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white border-t shadow-md flex flex-col items-start p-4 space-y-3 md:hidden z-20">
          {[...mainLinks, ...userLinks].map((link) => (
            <Button
              key={link.label}
              variant="link"
              className="w-full text-left text-gray-900 text-[18px]"
              onClick={() => {
                link.onClick();
                setMenuOpen(false);
              }}
            >
              {link.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
