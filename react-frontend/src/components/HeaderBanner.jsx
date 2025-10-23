import GradientAccent from "./GradientAccent";
import { cn } from "../lib/utils";


const HeaderBanner = ({ className , navbar= null, logoAlign = "center" }) => {
  const justifyLogo = logoAlign === "left" ? "justify-start" : "justify-center";

  return (
    <div>
  <GradientAccent className={cn("top-0 left-0 z-20", className)} />

  <header className={cn("top-1 left-0 w-full h-[60px] border-b border-solid border-[#dddddd] bg-white flex items-center px-6 z-30 gap-10", justifyLogo, className)}>
    <img
      className="h-[40px] w-auto object-contain pl-2"
      alt="Sky Zero Logo"
      src="/image-5.png"
    />

    {logoAlign === "left" && navbar && (
      <nav className="flex items-center gap-4 w-full">
        {navbar}
      </nav>
    )}
  </header>
</div>

  );
};

export default HeaderBanner;

