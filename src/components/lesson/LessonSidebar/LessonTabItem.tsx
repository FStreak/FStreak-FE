import React from "react";

interface LessonTabItemProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export default function LessonTabItem({
  label,
  icon,
  active,
  onClick,
}: LessonTabItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
        ${
          active
            ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-sm"
            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
        }`}
    >
      <span className={`${active ? "text-white" : "text-orange-500"}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}
