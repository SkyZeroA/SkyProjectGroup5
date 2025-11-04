import { useEffect, useState } from "react";

function ColorblindToggle({ colorblind, setColorblind }) {
  return (
    <button
      onClick={() => setColorblind(!colorblind)}
      className="bg-[var(--color-button-bg)] text-[var(--color-button-text)] px-4 py-2 rounded text-sm"
    >
      {colorblind ? "Disable Colorblind Mode" : "Enable Colorblind Mode"}
    </button>
  );
}

export default ColorblindToggle;
