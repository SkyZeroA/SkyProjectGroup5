function ColorblindToggle({ colorblind, setColorblind }) {
  return (
    <button
  onClick={() => setColorblind(!colorblind)}
  className="bg-[var(--color-button-bg)] text-[var(--color-button-text)] px-2 sm:px-4 py-1 sm:py-2 rounded text-[8px] sm:text-sm w-[70px] sm:w-auto whitespace-normal text-center"
>
  {colorblind ? "Disable Colorblind Mode" : "Enable Colorblind Mode"}
</button>

  );
}

export default ColorblindToggle;
