import GradientAccent from "./GradientAccent";


const FooterBanner = ({ className }) => {

   const footerLinks = [
    "Privacy options",
    "Terms & conditions",
    "Privacy & cookies notice",
    "Accessibility",
    "Site map",
    "Contact us",
    "Complaints",
    "Sky Group",
    "Store locator",
  ];

  return (
    <div className={className}>
      <footer className="bottom-1 left-0 w-full h-[70px] border-t border-solid border-[#dddddd] bg-white flex items-center px-16">
        <div className="flex items-center space-x-4">
          <img
            className="w-14 h-[34px] object-cover"
            alt="Sky Logo"
            src="/image-8.png"
          />
          <span className="[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[17px] leading-[23.2px]">
            © 2025 Sky UK
          </span>
        </div>

        <div className="ml-[200px]">
          <nav className="[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[16px] leading-[22.5px]">
            {footerLinks.map((link, index) => (
              <span key={index}>
                {link}
                {index < footerLinks.length - 1 && (
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </footer>
      <GradientAccent className="bottom-0 left-0 z-10" />
    </div>
  );
};

export default FooterBanner;