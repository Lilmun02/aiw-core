function FeedbackArchive({
  feedback = [],
  onRestore,
  onDelete,
}) {
  if (feedback.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
        No archived feedback.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {feedback.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">
                {item.name || "Anonymous"}
              </h3>

              <p className="text-sm text-slate-400">
                {item.email || "No email provided"}
              </p>
            </div>

            <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold capitalize text-slate-200">
              {item.status || "archived"}
            </span>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-slate-300">
            {item.message}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onRestore(item.id)}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Restore
            </button>

            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedbackArchive;