import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import API_URL from "../config/api";
import "../styles/Home.css";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/notices`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("NOTICES:", data);
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notices:", error.message);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    window.addEventListener("focus", fetchNotices);
    return () => window.removeEventListener("focus", fetchNotices);
  }, []);

  const filtered =
    activeCategory === "All"
      ? notices
      : notices.filter((n) => n.category === activeCategory);

  const counts = { All: notices.length };
  notices.forEach((n) => {
    counts[n.category] = (counts[n.category] || 0) + 1;
  });

  const importantCount = notices.filter((n) => n.important).length;

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__hero-text">
          <p className="home__hero-eyebrow">Official Announcements</p>
          <h1 className="home__hero-title">
            Notify<br />
          </h1>
          <p className="home__hero-sub">
            All your college updates. One place.
          </p>
        </div>
        <div className="home__hero-stats">
          <div className="home__stat">
            <div className="home__stat-num">{notices.length}</div>
            <div className="home__stat-label">Notices</div>
          </div>
          <div className="home__stat">
            <div className="home__stat-num">{importantCount}</div>
            <div className="home__stat-label">Important</div>
          </div>
    
        </div>
      </section>

      <div className="home__toolbar">
        <FilterBar
          active={activeCategory}
          onChange={setActiveCategory}
          counts={counts}
        />
        <span className="home__section-label">
          Showing
          <span className="home__count">{filtered.length}</span> notices
        </span>
      </div>

      <hr className="home__divider" />

      <div className="home__grid">
        {loading ? (
          <div className="home__empty">
            <div className="home__empty-title">Loading notices...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="home__empty">
            <div className="home__empty-icon">📋</div>
            <div className="home__empty-title">No notices found</div>
            <p className="home__empty-text">
              There are no notices in the "{activeCategory}" category yet.
            </p>
          </div>
        ) : (
          Array.isArray(filtered) && filtered.map((notice) => (
            <div key={notice._id || `${notice.title}-${notice.date}`} className="notice-card">
              <h3>{notice.title}</h3>
              <p>{notice.description}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
