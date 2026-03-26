export const CATEGORY_STYLES = {
  Academic: { color: "#2563eb", bg: "#eff6ff" },
  Exam:     { color: "#c0392b", bg: "#fef2f2" },
  Events:   { color: "#7c3aed", bg: "#f5f3ff" },
  Sports:   { color: "#059669", bg: "#ecfdf5" },
  General:  { color: "#b45309", bg: "#fffbeb" },
};

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || { color: "#555", bg: "#f3f3f3" };
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
