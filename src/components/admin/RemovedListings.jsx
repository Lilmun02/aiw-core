function RemovedListings({
  listings = [],
  processingId,
  onRestore,
  onDelete,
}) {
  if (listings.length === 0) {
    return (
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Removed Listings
            </h2>

            <p className="mt-2 text-slate-400">
              Listings removed from the public AIWCORE directory.
            </p>
          </div>

          <span className="rounded-full bg-slate-500/10 px-4 py-2 text-sm font-bold text-slate-300">
            0 Removed
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-xl font-bold text-white">
            No removed listings
          </p>

          <p className="mt-3 text-slate-400">
            Removed tools will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Removed Listings
          </h2>

          <p className="mt-2 text-slate-400">
            Restore a listing or delete it permanently.
          </p>
        </div>

        <span className="rounded-full bg-slate-500/10 px-4 py-2 text-sm font-bold text-slate-300">
          {listings.length} Removed
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {listings.map((tool) => {
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
                    {tool.company_name || "Unknown company"}
                  </p>

                  <span className="mt-4 inline-flex rounded-full bg-slate-500/10 px-3 py-1 text-sm font-semibold text-slate-300">
                    Removed
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onRestore(tool)}
                    disabled={isProcessing}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? "Updating..." : "Restore Listing"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(tool)}
                    disabled={isProcessing}
                    className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
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
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RemovedListings;