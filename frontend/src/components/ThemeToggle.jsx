import { useEffect, useState } from "react";

export default function ThemeToggle() {

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
      className="
        relative
        flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        backdrop-blur-xl
        bg-white/10
        dark:bg-black/20
        border
        border-white/20
        text-sm
        font-medium
        text-gray-700
        dark:text-gray-200
        shadow
        hover:scale-105
        hover:shadow-lg
        transition
        duration-200
      "
    >

      {/* Icon */}

      <span className="text-lg transition">

        {dark ? "☀️" : "🌙"}

      </span>

      {/* Label */}

      <span>

        {dark
          ? "Light"
          : "Dark"}

      </span>

    </button>
  );
}