import GradientAccent from "./GradientAccent";
import { cn } from "../lib/utils";


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
    <div>
      <footer className={cn("bottom-1 w-full min-h-[70px] border-t border-solid border-[#dddddd] bg-white flex items-center px-4 md:px-16", className)}>
        <div className="flex flex-col-reverse md:flex-row md:justify-between w-full items-start md:items-center py-4 md:py-4 gap-6">
          <div className="flex items-center space-x-4">
            <img
              className="w-auto h-[34px] object-cover"
              alt="Sky Logo"
              src="/image-8.png"
            />
            <span className="[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(14px,2vw,17px)] leading-[23.2px] whitespace-nowrap">
              © 2025 Sky UK
            </span>
          </div>

          <div className="ml-0 md:ml-[100px]">
            <nav
              className={cn(
                "grid grid-cols-2 place-item-center sm:grid-cols-3 lg:flex lg:flex-wrap gap-x-12 xlg:gap-x-6 lg:gap-x-6 md:gap-x-4 sm:gap-x-10 lg:gap-y-2",
                "[font-family:'Sky_Text',Helvetica] font-normal text-[#4a4a4a] text-[clamp(13px,2vw,16px)] leading-[22.5px]"
              )}
            >
              {footerLinks.map((link, index) => (
                <span
                  key={index}
                  className="mb-2"
                >
                  {link}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </footer>
      <GradientAccent className={cn("bottom-0 left-0 z-10", className)} />
    </div>
  );
};

export default FooterBanner;