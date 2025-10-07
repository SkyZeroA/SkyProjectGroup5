import { cn } from "../lib/utils";


const GradientAccent = ({ className }) => {
  return (
    <div 
      className={cn(
        "w-full h-1 bg-[linear-gradient(90deg,rgba(110,238,135,1)_0%,rgba(89,199,84,1)_50%,rgba(75,173,49,1)_100%)]",
        className
      )}
    />
  );
};

export default GradientAccent;