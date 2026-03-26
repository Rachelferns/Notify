import "../styles/NoticeCard.css";
import { getCategoryStyle, formatDate } from "../categoryUtils";

export default function NoticeCard({ notice, onDelete, onToggleImportant, isAdmin }) {
  const catStyle = getCategoryStyle(notice.category);

  return (
    <article
      className={`notice-card${notice.important ? " notice-card--important" : ""}`}
      style={{ "--cat-color": catStyle.color }}
    >
      <div className="notice-card__header">
        <div className="notice-card__meta">
          <span
            className="notice-card__category"
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            {notice.category}
          </span>
          {notice.important && (
            <span className="notice-card__important-tag">⚡ Important</span>
          )}
        </div>
      </div>

      <h3 className="notice-card__title">{notice.title}</h3>
      <p className="notice-card__desc">{notice.description}</p>

      <div className="notice-card__footer">
        <div className="notice-card__info">
          <span className="notice-card__by">
            <span className="notice-card__icon">✍</span>
            {notice.postedBy}
          </span>
          <span className="notice-card__date">
            <span className="notice-card__icon">📅</span>
            {formatDate(notice.date)}
          </span>
        </div>

        {isAdmin && (
          <>
            <button
              className="notice-card__delete-btn"
              onClick={() => onToggleImportant(notice._id)}
              title="Toggle important"
            >
              {notice.important ? "Unmark Important" : "Mark Important"}
            </button>
            <button
              className="notice-card__delete-btn"
              onClick={() => onDelete(notice._id)}
              title="Delete notice"
            >
              🗑 Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
