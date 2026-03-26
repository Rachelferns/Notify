import "../styles/FilterBar.css";
import { CATEGORIES } from "../data/notices";

export default function FilterBar({ active, onChange, counts }) {
  return (
    <div className="filter-bar">
      <span className="filter-bar__label">Filter:</span>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-bar__btn${active === cat ? " active" : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
          {counts[cat] !== undefined && (
            <span className="filter-bar__count">({counts[cat]})</span>
          )}
        </button>
      ))}
    </div>
  );
}
