import NoticeCard from "./NoticeCard";

export default function NoticeList({ notices, onDelete, onToggleImportant, isAdmin }) {
  if (notices.length === 0) return null;

  return (
    <>
      {notices.map((notice, i) => (
        <div
          key={notice._id}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <NoticeCard
            notice={notice}
            onDelete={onDelete}
            onToggleImportant={onToggleImportant}
            isAdmin={isAdmin}
          />
        </div>
      ))}
    </>
  );
}
