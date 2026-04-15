import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { api } from "../api/api";

import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async () => {

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await api(
      "/auth/login",
      "POST",
      {
        email,
        password,
      }
    );

    setLoading(false);

    if (res?.token) {

      localStorage.setItem(
        "token",
        res.token
      );

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/projects");
      }, 800);

    }

    else {

      toast.error("Invalid credentials");

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full
          max-w-md
          p-8
          rounded-2xl
          glass
          shadow-xl
        "
      >

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Welcome Back
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && submit()
          }
          className="
            w-full
            p-3
            mb-3
            rounded-xl
            border
            focus:ring-2
            focus:ring-indigo-500
            transition
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && submit()
          }
          className="
            w-full
            p-3
            mb-4
            rounded-xl
            border
            focus:ring-2
            focus:ring-indigo-500
          "
        />

        <button
          onClick={submit}
          disabled={loading}
          className="
            w-full
            py-3
            rounded-xl
            font-medium
            text-white
            bg-indigo-500
            hover:bg-indigo-600
            transition
            disabled:opacity-50
          "
        >

          {loading
            ? "Signing in..."
            : "Login"}

        </button>

        <p className="mt-5 text-center text-sm">

          No account?

          <Link
            to="/register"
            className="ml-2 text-indigo-500 font-medium hover:underline"
          >
            Register
          </Link>

        </p>

      </motion.div>

    </div>
  );
}