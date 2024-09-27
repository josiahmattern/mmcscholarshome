import { useState, useEffect } from "react";
import { themeChange } from "theme-change";

const ThemeSwitcher = () => {
  const LIGHT = "cmyk";
  const DARK = "dim";
  const [theme, setTheme] = useState(LIGHT);

  useEffect(() => {
    // Initialize theme change
    themeChange(false);

    // Get the saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme") || LIGHT;
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleChange = () => {
    // Toggle the theme
    const newTheme = theme === LIGHT ? DARK : LIGHT;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <label className="cursor-pointer grid ml-3">
      <input
        data-toggle-theme="true"
        data-act-class="ACTIVECLASS"
        checked={theme === LIGHT}
        onChange={handleChange}
        type="checkbox"
        className="toggle theme-controller"
      />
    </label>
  );
};

export default ThemeSwitcher;
