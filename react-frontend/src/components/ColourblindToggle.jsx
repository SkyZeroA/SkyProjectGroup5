import { useEffect, useState } from "react";

function ColorblindToggle() {
  const [colorblind, setColorblind] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("colorblind", colorblind);
  }, [colorblind]);

  return (
    <button
      onClick={() => setColorblind(!colorblind)}
      className="fixed bottom-4 right-4 bg-[var(--color-button-bg)] text-[var(--color-button-text)] px-4 py-2 rounded"
    >
      {colorblind ? "Disable Colorblind Mode" : "Enable Colorblind Mode"}
    </button>
  );
}

export default ColorblindToggle;
