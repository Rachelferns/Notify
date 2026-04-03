import { useEffect, useState } from "react";
import NoticeList from "../components/NoticeList";
import API_URL from "../config/api";
import { CATEGORIES } from "../data/notices";
import "../styles/Admin.css";
const FORM_INITIAL = { title: "", description: "", category: "General" };

async function parseJsonResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed with status ${res.status}`);
  }

  const data = await res.json();
  console.log("API data:", data);
  return data;
}

export default function Admin() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(FORM_INITIAL);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchNotices = async () => {
    try {
      const role = (localStorage.getItem("role") || "").trim().toLowerCase();
      console.log("ROLE SENT:", role);

      const res = await fetch(`${API_URL}/notices`, {
        headers: {
          "Content-Type": "application/json",
          role: role,
        },
      });

      const data = await parseJsonResponse(res);
      setNotices(data);
    } catch (error) {
      console.error("Failed to load notices:", error.message);
      setNotices([]);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";

    return nextErrors;
  };

  const handleDelete = async (id) => {
    try {
      const role = (localStorage.getItem("role") || "").trim().toLowerCase();
      console.log("ROLE SENT:", role);

      const res = await fetch(`${API_URL}/notices/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          role: role,
        },
      });

      await parseJsonResponse(res);
      setNotices((prev) => prev.filter((notice) => notice._id !== id));
    } catch (error) {
      console.error("Failed to delete notice:", error.message);
      alert(error.message);
    }
  };

  const handleToggleImportant = async (id) => {
    try {
      const role = (localStorage.getItem("role") || "").trim().toLowerCase();
      console.log("ROLE SENT:", role);

      const res = await fetch(`${API_URL}/notices/${id}/important`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          role: role,
        },
      });

      const updatedNotice = await parseJsonResponse(res);
      setNotices((prev) =>
        prev.map((notice) => (notice._id === id ? updatedNotice : notice))
      );
    } catch (error) {
      console.error("Failed to toggle important:", error.message);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const role = (localStorage.getItem("role") || "").trim().toLowerCase();
    console.log("ROLE SENT:", role);

    const newNotice = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: new Date().toISOString().split("T")[0],
      important: false,
    };

    try {
      const res = await fetch(`${API_URL}/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role: role,
        },
        body: JSON.stringify(newNotice),
      });

      await parseJsonResponse(res);
      await fetchNotices();
      setForm(FORM_INITIAL);
      setErrors({});
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Failed to create notice:", error.message);
      alert(error.message);
    }
  };

  const contentCategories = CATEGORIES.filter((category) => category !== "All");

  return (
    <main className="admin">
      <div className="admin__header">
        <div>
          <p className="admin__eyebrow">Control Panel</p>
          <h1 className="admin__title">Admin Dashboard</h1>
        </div>
        <div className="admin__stats-row">
          <div className="admin__stat-pill">
            <div className="admin__stat-num">{notices.length}</div>
            <div className="admin__stat-label">Total</div>
          </div>
          <div className="admin__stat-pill">
            <div className="admin__stat-num">
              {notices.filter((notice) => notice.important).length}
            </div>
            <div className="admin__stat-label">Important</div>
          </div>
        </div>
      </div>

      <div className="admin__layout">
        <aside className="admin__form-panel">
          <h2 className="admin__form-title">Post New Notice</h2>

          <form className="admin__form" onSubmit={handleSubmit} noValidate>
            <div className="admin__form-group">
              <label className="admin__label" htmlFor="title">
                Notice Title *
              </label>
              <input
                id="title"
                name="title"
                className="admin__input"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Exam Schedule Released"
                style={errors.title ? { borderColor: "#c0392b" } : undefined}
              />
              {errors.title && (
                <span style={{ fontSize: "0.75rem", color: "#c0392b" }}>
                  {errors.title}
                </span>
              )}
            </div>

            <div className="admin__form-group">
              <label className="admin__label" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                className="admin__textarea"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide full details of the notice..."
                style={errors.description ? { borderColor: "#c0392b" } : undefined}
              />
              {errors.description && (
                <span style={{ fontSize: "0.75rem", color: "#c0392b" }}>
                  {errors.description}
                </span>
              )}
            </div>

            <div className="admin__form-group">
              <label className="admin__label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="admin__select"
                value={form.category}
                onChange={handleChange}
              >
                {contentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="admin__submit-btn">
              Publish Notice
            </button>

            {showSuccess && (
              <div className="admin__toast">Notice published successfully.</div>
            )}
          </form>
        </aside>

        <section className="admin__notices-panel">
          <div className="admin__panel-header">
            <h2 className="admin__panel-title">All Notices</h2>
            <span className="admin__panel-count">{notices.length} total</span>
          </div>

          {notices.length === 0 ? (
            <div className="admin__empty">No notices yet. Post one!</div>
          ) : (
            <div className="admin__notices-list">
              <NoticeList
                notices={notices}
                onDelete={handleDelete}
                onToggleImportant={handleToggleImportant}
                isAdmin
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
