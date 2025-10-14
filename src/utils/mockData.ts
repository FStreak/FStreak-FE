export interface Classroom {
  id: string;
  name: string;
  description: string;
  participants: number;
  theme: string;
  icon: string;
}

export const mockClassrooms: Classroom[] = [
  {
    id: "1",
    name: "Algorithm Masters",
    description: "Deep dive into data structures and algorithms",
    participants: 156,
    theme: "Computer Science",
    icon: "💻"
  },
  {
    id: "2",
    name: "English Excellence",
    description: "Improve your English communication skills",
    participants: 203,
    theme: "Languages",
    icon: "🗣️"
  },
  {
    id: "3",
    name: "Math Warriors",
    description: "Conquer calculus and linear algebra together",
    participants: 189,
    theme: "Mathematics",
    icon: "📐"
  },
  {
    id: "4",
    name: "Web Dev Club",
    description: "Build modern web applications together",
    participants: 245,
    theme: "Web Development",
    icon: "🌐"
  },
  {
    id: "5",
    name: "Business Analytics",
    description: "Master data analysis and business insights",
    participants: 134,
    theme: "Business",
    icon: "📊"
  },
  {
    id: "6",
    name: "Design Thinking",
    description: "Creative problem solving and UX design",
    participants: 167,
    theme: "Design",
    icon: "🎨"
  }
];
