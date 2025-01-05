import React from "react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="theme-button">
            {theme === "dark" ? "🌞" : "🌙"}
        </button>
    );
};

export default ThemeToggleButton;
