"use client";

export default function ProgressBar({
  value,
  small,
}: {
  value: number;
  small?: boolean;
}) {
  return (
    <div className={`w-full ${small ? "mt-1" : "mt-2"}`}>
      {/* Nền thanh progress */}
      <div className="h-2.5 rounded-full bg-orange-100/60 dark:bg-[#1A1A1A] overflow-hidden">
        {/* Thanh chạy progress */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 
                     dark:from-[#E69540] dark:to-[#F2C85B]
                     shadow-[0_0_10px_rgba(255,166,0,0.3)]
                     transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>

      {/* Text hiển thị phần trăm */}
      {!small && (
        <div className="mt-2 text-[12px] text-gray-600 dark:text-gray-400 font-medium">
          Progress:{" "}
          <span className="text-orange-600 dark:text-[#F2C85B]">{value}%</span>
        </div>
      )}
    </div>
  );
}
