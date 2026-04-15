import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import { api } from "../api/api";

import { ToastContainer, toast } from "react-toastify";

import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

export default function ProjectDetail() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const statuses = [
    "todo",
    "in_progress",
    "done"
  ];

  // -------------------------
  // Load Tasks
  // -------------------------

  const load = async () => {

    setLoading(true);

    const data = await api(
      `/projects/${id}/tasks`
    );

    setTasks(data?.tasks || []);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // -------------------------
  // Create Task
  // -------------------------

  const create = async () => {

    if (!title) return;

    await api(
      `/projects/${id}/tasks`,
      "POST",
      {
        title,
        status: "todo",
        priority: "medium",
      }
    );

    toast.success("Task created");

    setTitle("");

    load();
  };

  // -------------------------
  // Delete Task
  // -------------------------

  const openDeleteModal = (task) => {

    setSelectedTask(task);

    setShowModal(true);
  };

  const confirmDelete = async () => {

    await api(
      `/tasks/${selectedTask.id}`,
      "DELETE"
    );

    toast.success("Task deleted");

    setShowModal(false);

    load();
  };

  // -------------------------
  // Drag Handler
  // -------------------------

  const onDragEnd = async (result) => {

    if (!result.destination)
      return;

    const taskId =
      result.draggableId;

    const newStatus =
      result.destination.droppableId;

    await api(
      `/tasks/${taskId}`,
      "PATCH",
      { status: newStatus }
    );

    toast.success("Task moved");

    load();
  };

  // -------------------------
  // Skeleton Loader
  // -------------------------

  const Skeleton = () => (

    <div className="animate-pulse glass rounded-xl p-4 h-24" />

  );

  return (
    <div className="min-h-screen">

      <Navbar />

      <ToastContainer />

      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}

        <div className="glass p-6 rounded-2xl shadow mb-6">

          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Project Tasks
          </h2>

          <div className="flex gap-3">

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                create()
              }
              placeholder="New task..."
              className="
                flex-1
                p-3
                rounded-xl
                border
                text-gray-800
                dark:text-white
                bg-white/70
                dark:bg-black/40
                focus:ring-2
                focus:ring-indigo-500
              "
            />

            <button
              onClick={create}
              className="
                px-6
                py-3
                bg-green-500
                hover:bg-green-600
                text-white
                rounded-xl
                transition
              "
            >
              Add Task
            </button>

          </div>

        </div>

        {/* Loading */}

        {loading && (

          <div className="grid md:grid-cols-3 gap-6">

            <Skeleton />
            <Skeleton />
            <Skeleton />

          </div>

        )}

        {/* Kanban Board */}

        {!loading && (

          <DragDropContext
            onDragEnd={onDragEnd}
          >

            <div className="grid md:grid-cols-3 gap-6">

              {statuses.map(
                (status) => (

                  <Droppable
                    droppableId={status}
                    key={status}
                  >

                    {(provided) => (

                      <div
                        ref={
                          provided.innerRef
                        }
                        {...provided.droppableProps}
                        className="
                          glass
                          rounded-2xl
                          p-4
                          min-h-[400px]
                        "
                      >

                        {/* Column Title */}

                        <h3 className="
                          font-semibold
                          mb-4
                          capitalize
                          text-gray-700
                          dark:text-gray-200
                        ">

                          {status.replace(
                            "_",
                            " "
                          )}

                        </h3>

                        {tasks
                          .filter(
                            (t) =>
                              t.status ===
                              status
                          )
                          .map(
                            (
                              task,
                              index
                            ) => (

                              <Draggable
                                key={task.id}
                                draggableId={String(
                                  task.id
                                )}
                                index={index}
                              >

                                {(provided) => (

                                  <div
                                    ref={
                                      provided.innerRef
                                    }
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="
                                      bg-white/70
                                      dark:bg-black/40
                                      rounded-xl
                                      p-4
                                      mb-3
                                      shadow
                                      hover:scale-[1.02]
                                      transition
                                    "
                                  >

                                    <h4 className="
                                      font-medium
                                      text-gray-800
                                      dark:text-gray-100
                                    ">

                                      {task.title}

                                    </h4>

                                    <button
                                      onClick={() =>
                                        openDeleteModal(
                                          task
                                        )
                                      }
                                      className="
                                        mt-3
                                        w-full
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        px-3
                                        py-2
                                        rounded-lg
                                      "
                                    >
                                      Delete
                                    </button>

                                  </div>

                                )}

                              </Draggable>

                            )
                          )}

                        {
                          provided.placeholder
                        }

                      </div>

                    )}

                  </Droppable>

                )
              )}

            </div>

          </DragDropContext>

        )}

      </div>

      {/* Delete Modal */}

      {showModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="glass p-6 rounded-2xl shadow w-96">

            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h3>

            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Delete this task?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  px-4
                  py-2
                  bg-gray-300
                  dark:bg-gray-700
                  text-gray-800
                  dark:text-white
                  rounded-lg
                "
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="
                  px-4
                  py-2
                  bg-red-500
                  text-white
                  rounded-lg
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