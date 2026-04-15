import { useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

export default function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div
      className="
        sticky
        top-0
        z-40
        flex
        justify-between
        items-center
        px-6
        py-4
        m-4
        backdrop-blur-xl
        bg-white/10
        dark:bg-black/20
        border
        border-white/20
        rounded-2xl
        shadow-lg
        transition
      "
    >

      {/* Logo */}

      <div
        className="
          flex
          items-center
          gap-2
          cursor-pointer
        "
        onClick={() => navigate("/projects")}
      >

        <div
          className="
            w-9
            h-9
            flex
            items-center
            justify-center
            rounded-xl
            bg-indigo-500
            text-white
            font-bold
            shadow
          "
        >
          T
        </div>

        <h1
          className="
            text-xl
            font-semibold
            text-gray-800
            dark:text-white
            tracking-tight
          "
        >
          TaskFlow
        </h1>

      </div>

      {/* Right Controls */}

      <div className="flex items-center gap-3">

        <ThemeToggle />

        <button
          onClick={logout}
          className="
            px-4
            py-2
            rounded-xl
            font-medium
            text-white
            bg-red-500
            hover:bg-red-600
            shadow
            hover:scale-105
            transition
            duration-200
          "
        >
          Logout
        </button>

      </div>

    </div>
  );
}