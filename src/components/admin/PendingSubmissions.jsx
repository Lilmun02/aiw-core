function PendingSubmissions({
  submissions = [],
  reviewingId,
  processingId,
  onToggleReview,
  onApprove,
  onReject,
}) {
  if (submissions.length === 0) {
    return (
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Pending Submissions
            </h2>

            <p className="mt-2 text-slate-400">
              Review tools waiting for approval.
            </p>
          </div>

          <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300">
            0 Pending
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-xl font-bold text-white">
            No pending submissions
          </p>

          <p className="mt-3 text-slate-400">
            New tool submissions will appear here automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Pending Submissions
          </h2>

          <p className="mt-2 text-slate-400">
            Review tools waiting for approval.
          </p>
        </div>

        <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300">
          {submissions.length} Pending
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {submissions.map((tool) => {
          const isReviewing = reviewingId === tool.id;
          const isProcessing = processingId === tool.id;

          return (
            <article
              key={tool.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {tool.tool_name}
                  </h3>

                  <p className="mt-1 text-slate-400">
                    {tool.company_name}
                  </p>

                  <span className="mt-4 inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold capitalize text-yellow-300">
                    {tool.status || "pending"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleReview(tool.id)}
                  disabled={isProcessing}
                  className="w-fit rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-3 font-bold text-blue-300 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isReviewing ? "Close Review" : "Review"}
                </button>
              </div>

              {isReviewing && (
                <div className="mt-6 border-t border-slate-800 pt-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-950 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        Company
                      </p>

                      <p className="mt-2 text-lg text-white">
                        {tool.company_name || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-950 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        Website
                      </p>

                      {tool.website_url ? (
                        <a
                          href={tool.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block break-all text-lg text-blue-400 hover:text-blue-300"
                        >
                          {tool.website_url}
                        </a>
                      ) : (
                        <p className="mt-2 text-lg text-slate-400">
                          Not provided
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-950 p-5">
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                      Description
                    </p>

                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                      {tool.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-950 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        Category
                      </p>

                      <p className="mt-2 text-lg text-white">
                        {tool.category || "Other"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-950 p-5">
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                        Contact Email
                      </p>

                      {tool.email ? (
                        <a
                          href={`mailto:${tool.email}`}
                          className="mt-2 block break-all text-lg text-blue-400 hover:text-blue-300"
                        >
                          {tool.email}
                        </a>
                      ) : (
                        <p className="mt-2 text-lg text-slate-400">
                          Not provided
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onApprove(tool)}
                      disabled={isProcessing}
                      className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Approve & Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onReject(tool)}
                      disabled={isProcessing}
                      className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PendingSubmissions;