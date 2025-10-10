import GradientAccent from "./GradientAccent";


const HeaderBanner = ({ className }) => {
  return (
    <div className={className}>
  <GradientAccent className="top-0 left-0 z-20" />

  <header className="top-1 left-0 w-full h-[60px] border-b border-solid border-[#dddddd] bg-white flex items-center justify-center z-30">
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

