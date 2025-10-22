"use client";

export default function LeaderboardSection() {
  const data = [
    { rank: 1, name: "Person 1", score: 30, color: "bg-blue-500" },
    { rank: 2, name: "Person 2", score: 25, color: "bg-green-500" },
    { rank: 3, name: "Person 3", score: 18, color: "bg-purple-500" },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Leaderboards
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-t-4 border-orange-400 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Friends Ranking
          </h3>
          <button className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-md text-xs font-medium hover:from-orange-600 hover:to-yellow-500 transition">
            Invite
          </button>
        </div>
        <div className="space-y-4">
          {data.map((r, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`${r.color} w-8 h-8 text-white flex items-center justify-center rounded-full text-sm font-bold shadow-sm`}
                >
                  {r.rank}
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {r.name}
                </span>
              </div>
              <span className="text-orange-500 font-semibold">{r.score}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
