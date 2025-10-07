import GradientAccent from "./GradientAccent";


const HeaderBanner = ({ className }) => {
  return (
    <div className={className}>
      <GradientAccent className="absolute top-0 left-0 z-10" />
      <header className="absolute top-1 left-0 w-full h-[51px] border-b border-solid border-[#dddddd] bg-white">
        <img
          className="absolute top-3 left-[843px] w-[42px] h-[26px] object-cover"
          alt="Sky Logo"
          src="/image-8.png"
        />
      </header>
    </div>
  );
};

export default HeaderBanner;