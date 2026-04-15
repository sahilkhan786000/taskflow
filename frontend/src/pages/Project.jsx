import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { api } from "../api/api";

import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Projects() {

  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // -------------------------
  // Load Projects
  // -------------------------

  const load = async () => {

    setLoading(true);

    const data = await api("/projects");

    setProjects(data || []);
    setFiltered(data || []);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // -------------------------
  // Search with Debounce
  // -------------------------

  useEffect(() => {

    const timer = setTimeout(() => {

      const result = projects.filter((p) =>
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

      setFiltered(result);

    }, 300);

    return () => clearTimeout(timer);

  }, [search, projects]);

  // -------------------------
  // Create Project
  // -------------------------

  const create = async () => {

    if (!name) {
      toast.error("Enter project name");
      return;
    }

    await api(
      "/projects",
      "POST",
      { name }
    );

    toast.success(
      "Project created successfully"
    );

    setName("");

    load();
  };

  // -------------------------
  // Delete Modal
  // -------------------------

  const openDeleteModal = (project) => {

    setSelectedProject(project);

    setShowModal(true);
  };

  const confirmDelete = async () => {

    await api(
      `/projects/${selectedProject.id}`,
      "DELETE"
    );

    toast.success(
      "Project deleted successfully"
    );

    setShowModal(false);

    load();
  };

  // -------------------------
  // Stats
  // -------------------------

  const totalProjects = projects.length;

  // -------------------------
  // Skeleton Loader
  // -------------------------

  const SkeletonCard = () => (

    <div className="animate-pulse glass rounded-2xl p-5 h-24" />

  );

  return (
    <div className="min-h-screen">

      <Navbar />

      <ToastContainer />

      <div className="p-6 max-w-7xl mx-auto">

        {/* -------------------------
           Dashboard Stats
        ------------------------- */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-6 shadow"
          >

            <h3 className="
              text-sm
              text-gray-600
              dark:text-gray-300
            ">
              Total Projects
            </h3>

            <p className="
              text-3xl
              font-bold
              mt-2
              text-gray-800
              dark:text-white
            ">
              {totalProjects}
            </p>

          </motion.div>

        </div>

        {/* -------------------------
           Create + Search
        ------------------------- */}

        <div className="glass rounded-2xl p-6 shadow mb-8">

          <h2 className="
            text-2xl
            font-semibold
            mb-4
            text-gray-800
            dark:text-white
          ">
            Projects
          </h2>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && create()
              }
              placeholder="Enter project name..."
              className="
                flex-1
                p-3
                rounded-xl
                border
                text-gray-800
                dark:text-white
                bg-white/70
                dark:bg-black/40
                border-gray-300
                dark:border-gray-600
                focus:ring-2
                focus:ring-indigo-500
                outline-none
              "
            />

            <button
              onClick={create}
              className="
                px-6
                py-3
                bg-indigo-500
                hover:bg-indigo-600
                text-white
                rounded-xl
                transition
                shadow
              "
            >
              Create Project
            </button>

          </div>

          {/* Search */}

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search projects..."
            className="
              mt-4
              w-full
              p-3
              rounded-xl
              border
              text-gray-800
              dark:text-white
              bg-white/70
              dark:bg-black/40
              border-gray-300
              dark:border-gray-600
              focus:ring-2
              focus:ring-indigo-500
              outline-none
            "
          />

        </div>

        {/* -------------------------
           Loading Skeleton
        ------------------------- */}

        {loading && (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {Array(6)
              .fill()
              .map((_, i) => (

                <SkeletonCard key={i} />

              ))}

          </div>

        )}

        {/* -------------------------
           Empty State
        ------------------------- */}

        {!loading && filtered.length === 0 && (

          <div className="
            text-center
            text-gray-600
            dark:text-gray-400
          ">
            No projects found
          </div>

        )}

        {/* -------------------------
           Project Grid
        ------------------------- */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {filtered.map((p) => (

            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                relative
                group
                glass
                rounded-2xl
                p-5
                shadow
                hover:scale-[1.03]
                transition
              "
            >

              <Link
                to={`/projects/${p.id}`}
              >

                <h3 className="
                  font-semibold
                  text-lg
                  mb-2
                  text-gray-800
                  dark:text-white
                ">
                  {p.name}
                </h3>

                <p className="
                  text-sm
                  text-gray-600
                  dark:text-gray-400
                ">
                  Open project →
                </p>

              </Link>

              <button
                onClick={() =>
                  openDeleteModal(p)
                }
                className="
                  absolute
                  top-3
                  right-3
                  opacity-0
                  group-hover:opacity-100
                  transition
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  px-3
                  py-1
                  rounded-lg
                  text-sm
                "
              >
                Delete
              </button>

            </motion.div>

          ))}

        </div>

      </div>

      {/* -------------------------
         Delete Modal
      ------------------------- */}

      {showModal && (

        <div className="
          fixed
          inset-0
          flex
          items-center
          justify-center
          bg-black/50
          backdrop-blur-sm
          z-50
        ">

          <div className="glass p-6 rounded-2xl shadow-xl w-96">

            <h3 className="
              text-lg
              font-semibold
              mb-4
              text-gray-800
              dark:text-white
            ">
              Confirm Deletion
            </h3>

            <p className="
              mb-6
              text-gray-600
              dark:text-gray-300
            ">
              Are you sure you want to delete this project?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-gray-200
                  hover:bg-gray-300
                  dark:bg-gray-700
                  dark:hover:bg-gray-600
                  text-gray-800
                  dark:text-white
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  transition
                "
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}