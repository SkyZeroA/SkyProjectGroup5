import GradientAccent from "./GradientAccent";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

const HeaderBanner = ({
  className,
  navbar = null,
  colorblindButton = null,
  centerLogo = false,
  logoLinked = true
}) => {
  const hasToggle = Boolean(colorblindButton);

  return (
    <div>
      <GradientAccent className={cn("top-0 left-0 z-20", className)} />

      <header
        className={cn(
          "top-1 left-0 w-full h-[60px] border-b border-solid border-[#dddddd] bg-white flex items-center px-6 z-30 gap-10",
          className
        )}
      >
        {centerLogo || hasToggle ? (
          // === Centered layout (Sign-In / Sign-Up) ===
          <>
            {/* Left spacer */}
            <div className="flex-1"></div>

            {/* Centered logo - NOT clickable on sign in/up */}
            <div className="mx-auto">
              <img
                className="h-[40px] w-auto object-contain"
                alt="Sky Zero Logo"
                src="/image-5.png"
              />
            </div>

            {/* Right side: optional colorblind toggle */}
            <div className="flex-1 flex justify-end">
              {colorblindButton && colorblindButton}
            </div>
          </>
        ) : (
          // === Default layout (logo on left, clickable) ===
          <>
            {logoLinked ? (
            <Link to="/dashboard" className="cursor-pointer">
              <img
                className="h-[40px] w-auto object-contain pl-2"
                alt="Sky Zero Logo"
                src="/image-5.png"
              />
            </Link>) : (
              <img
                className="h-[40px] w-auto object-contain pl-2"
                alt="Sky Zero Logo"
                src="/image-5.png"
              />
            )}

            {navbar && (
              <nav className="flex items-center gap-4 w-full">{navbar}</nav>
            )}
          </>
        )}
      </header>
    </div>
  );
};

export default HeaderBanner;
