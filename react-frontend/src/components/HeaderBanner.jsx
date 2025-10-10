import GradientAccent from "./GradientAccent";
import { cn } from "../lib/utils";


const HeaderBanner = ({ className }) => {
  return (
    <div>
  <GradientAccent className={cn("top-0 left-0 z-20", className)} />

  <header className={cn("top-1 left-0 w-full h-[60px] border-b border-solid border-[#dddddd] bg-white flex items-center justify-center z-30", className)}>
    <img
      className="h-[40px] w-auto object-contain"
      alt="Sky Zero Logo"
      src="/image-5.png"
    />
  </header>
</div>

  );
};

export default HeaderBanner;

