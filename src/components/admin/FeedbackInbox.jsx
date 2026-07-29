function FeedbackInbox({
  feedback = [],
  onReview,
  onResolve,
  onArchive,
}) {
  if (feedback.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
        No feedback in the inbox.
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">
                {item.name || "Anonymous"}
              </h3>

              <p className="text-sm text-slate-400">
                {item.email || "No email provided"}
              </p>
            </div>

            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white capitalize">
              {item.status}
            </span>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-slate-300">
            {item.message}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onReview(item.id)}
              className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400"
            >
              Mark Reviewed
            </button>

            <button
              onClick={() => onResolve(item.id)}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500"
            >
              Mark Resolved
            </button>

            <button
              onClick={() => onArchive(item.id)}
              className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-600"
            >
              Archive
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedbackInbox;