import { cn } from "../lib/utils";


const GradientAccent = ({ className }) => {
  return (
    <div 
      className={cn(
        "w-full h-1 bg-[linear-gradient(90deg,var(--gradient-start)_0%,var(--gradient-middle)_50%,var(--gradient-end)_100%)]",
        className
      )}
    />
  );
};

export default GradientAccent;