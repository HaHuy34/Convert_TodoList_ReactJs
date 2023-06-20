import React, { useState } from "react";
import "./App.css";

const TodoList = () => {
  const [workTitle, setWorkTitle] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingJobTitle, setEditingJobTitle] = useState("");

  const handleInputChange = (e) => {
    setWorkTitle(e.target.value);
  };

  const handleAddJob = () => {
    if (workTitle !== "") {
      const existingJobs = jobs.map((job) => job.title);
      if (existingJobs.includes(workTitle)) {
        alert(
          "Công việc đã tồn tại trong danh sách. Hãy thêm một công việc mới 😊"
        );
      } else {
        const newJob = {
          id: Date.now(),
          title: workTitle,
          isDone: false,
        };
        setJobs([...jobs, newJob]);
      }
      setWorkTitle("");
    } else {
      alert("Hãy nhập công việc bạn muốn thêm.");
    }
  };

  const handleDeleteJob = (id) => {
    const confirmDelete = window.confirm(
      "Bạn muốn xóa công việc này ra khỏi danh sách"
    );
    if (confirmDelete) {
      const updatedJobs = jobs.filter((job) => job.id !== id);
      setJobs(updatedJobs);
    }
  };

  const handleToggleDone = (id) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === id) {
        return {
          ...job,
          isDone: !job.isDone,
        };
      }
      return job;
    });
    setJobs(updatedJobs);
  };

  const handleEditJob = (id, title) => {
    setEditingJobId(id);
    setEditingJobTitle(title);
  };

  const handleUpdateJob = (id, newTitle) => {
    const existingJobs = jobs.map((job) => job.title);
    if (existingJobs.includes(newTitle)) {
      alert(
        "Công việc đã tồn tại trong danh sách. Vui lòng nhập một công việc khác"
      );
    } else {
      const updatedJobs = jobs.map((job) => {
        if (job.id === id) {
          return {
            ...job,
            title: newTitle,
          };
        }
        return job;
      });
      setJobs(updatedJobs);
      setEditingJobId(null);
      setEditingJobTitle("");
      alert("Bạn đã chỉnh sửa công việc thành công");
    }
  };

  const handleDeleteAll = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmDelete) {
      setJobs([]);
    }
  };


  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggingJobId = parseInt(e.dataTransfer.getData("text/plain"));
    const targetJobId = parseInt(e.target.getAttribute("data-id"));
    const draggingJobIndex = jobs.findIndex((job) => job.id === draggingJobId);
    const targetJobIndex = jobs.findIndex((job) => job.id === targetJobId);
    const updatedJobs = [...jobs];
    const [draggingJob] = updatedJobs.splice(draggingJobIndex, 1);
    updatedJobs.splice(targetJobIndex, 0, draggingJob);

    setJobs(updatedJobs);
  };
  return (
    <>
      <div className="container">
        <div className="todo-wrapper">
          <div className="list-work-main">
            <input
              placeholder="Enter work......"
              type="text"
              id="work-title"
              value={workTitle}
              onChange={handleInputChange}
            />
            <button className="add-job" onClick={handleAddJob}>
              Add Job
            </button>
          </div>
          <ul className="list-job">
            {jobs.map((job) => (
              <li
                key={job.id}
                className={job.isDone ? "item check-done" : "item"}
                draggable
                onDragStart={(e) => handleDragStart(e, job.id)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-id={job.id} // Add data-id attribute for identifying the job
              >
                <input
                  type="checkbox"
                  checked={job.isDone}
                  onChange={() => handleToggleDone(job.id)}
                />
                <div className="main-icons-title">
                  <i
                    className="bx bx-trash"
                    onClick={() => handleDeleteJob(job.id)}
                  ></i>
                  {editingJobId === job.id ? (
                    <i
                      className="bx bx-check"
                      onClick={() => handleUpdateJob(job.id, editingJobTitle)}
                    ></i>
                  ) : (
                    <>
                      {!job.isDone && (
                        <>
                          <i
                            className="bx bx-edit"
                            onClick={() => handleEditJob(job.id, job.title)}
                          ></i>
                        </>
                      )}
                    </>
                  )}
                </div>
                {editingJobId === job.id ? (
                  <input
                    type="text"
                    value={editingJobTitle}
                    onChange={(e) => setEditingJobTitle(e.target.value)}
                  />
                ) : (
                  job.title
                )}
              </li>
            ))}
          </ul>
          {jobs.length > 0 && (
            <button className="delete-all" onClick={handleDeleteAll}>
              Delete All
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TodoList;
