 function FeedbackTabs({
  activeTab,
  onTabChange,
  inboxCount = 0,
  archiveCount = 0,
}) {
  const tabs = [
    {
      id: "inbox",
      label: "Inbox",
      count: inboxCount,
    },
    {
      id: "archive",
      label: "Archive",
      count: archiveCount,
    },
  ];

  return (
    <div className="mt-6 inline-flex rounded-2xl border border-slate-800 bg-slate-900 p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 font-bold transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>{tab.label}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default FeedbackTabs;