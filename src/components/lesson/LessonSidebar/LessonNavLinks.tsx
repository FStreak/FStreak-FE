import Link from "next/link";
import {
  Layers,
  BookOpen,
  MessageCircle,
  Mail,
  Info,
  Calendar,
  GraduationCap,
} from "lucide-react";

interface LessonNavLinksProps {
  baseHref: string;
  lessonId: string;
}

export default function LessonNavLinks({
  baseHref,
  lessonId,
}: LessonNavLinksProps) {
  const base = baseHref || `/lessons/${lessonId}`;

  const links = [
    {
      label: "Course",
      icon: <GraduationCap className="w-4 h-4" />,
      href: `${base}/course`,
    },
    {
      label: "Grades",
      icon: <Layers className="w-4 h-4" />,
      href: `${base}/grades`,
    },
    {
      label: "Notes",
      icon: <BookOpen className="w-4 h-4" />,
      href: `${base}/notes`,
    },
    {
      label: "Discussion",
      icon: <MessageCircle className="w-4 h-4" />,
      href: `${base}/discussion`,
    },
    {
      label: "Messages",
      icon: <Mail className="w-4 h-4" />,
      href: `${base}/messages`,
      badge: "1",
    },
    {
      label: "Resources",
      icon: <Info className="w-4 h-4" />,
      href: `${base}/resources`,
    },
    {
      label: "Course Info",
      icon: <Calendar className="w-4 h-4" />,
      href: `${base}/course-info`,
    },
  ];

  return (
    <nav className="p-5 rounded-3xl border border-[#FFEBD2] bg-white shadow-sm hover:shadow-md transition-all">
      <ul className="space-y-3 text-sm text-gray-800">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center justify-between group hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 px-3 py-2.5 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-orange-500 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-medium group-hover:text-orange-600">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="ml-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
