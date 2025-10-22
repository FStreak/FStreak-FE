"use client";

export default function LearningProgress() {
  const data = [
    { label: "Lesson Completion", percent: 75, color: "bg-green-500" },
    { label: "XP Earned", percent: 85, color: "bg-yellow-400" },
    { label: "Weekly Goal", percent: 60, color: "bg-orange-500" },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Learning Progress
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-orange-100 dark:border-gray-700 shadow-[0_4px_20px_rgba(255,165,0,0.08)] hover:shadow-[0_6px_25px_rgba(255,165,0,0.15)] transition-all duration-300">
        {data.map((item, i) => (
          <div key={i} className="mb-6">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-gray-500">{item.percent}%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-3 rounded-full transition-all`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
