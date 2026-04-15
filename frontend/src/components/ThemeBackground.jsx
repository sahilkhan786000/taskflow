import { useEffect, useState } from "react";

export default function ThemeBackground({ children }) {

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {

    const observer = new MutationObserver(() => {

      setDark(
        document.documentElement.classList.contains("dark")
      );

    });

    observer.observe(
      document.documentElement,
      { attributes: true }
    );

    return () => observer.disconnect();

  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Layer */}

      {dark ? (

        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-indigo-950">

          {/* Stars */}

          <div className="absolute inset-0 opacity-40 animate-pulse">

            <div className="stars" />

          </div>

        </div>

      ) : (

        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-100 to-lime-200">

          {/* Floating blobs */}

          <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-40 animate-float" />

          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-40 animate-float-slow" />

        </div>

      )}

      {/* Content */}

      <div className="relative z-10">

        {children}

      </div>

    </div>
  );
}