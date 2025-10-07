import GradientAccent from "./GradientAccent";


const HeaderBanner = ({ className }) => {
  return (
    <div className={className}>
      <GradientAccent className="fixed top-0 left-0 z-20" />
      <header className="fixed top-1 left-0 w-full h-[60px] border-b border-solid border-[#dddddd] bg-white">
        <img
          className="absolute top-3 left-[835px] w-auto h-[40px] object-cover"
          alt="Sky Zero Logo"
          src="/image-5.png"
        />
      </header>
    </div>
  );
};

export default HeaderBanner;