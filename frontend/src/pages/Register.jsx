import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/api";

import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async () => {

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await api(
      "/auth/register",
      "POST",
      {
        name,
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

      toast.success("Account created");

      setTimeout(() => {
        navigate("/projects");
      }, 800);

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
          Create Account
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full p-3 mb-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 mb-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
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
          className="w-full p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-indigo-500"
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
            bg-green-500
            hover:bg-green-600
            transition
            disabled:opacity-50
          "
        >

          {loading
            ? "Creating account..."
            : "Register"}

        </button>

      </motion.div>

    </div>
  );
}