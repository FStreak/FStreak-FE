"use client";

import React from "react";
import { useParams } from "next/navigation";
import { BookOpen, FileText, ExternalLink } from "lucide-react";
import { useLesson } from "@/hooks/useLesson";
import LessonDocumentViewer from "../components/LessonDocumentViewer";

export default function ResourcesPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { lesson, isLoading } = useLesson(lessonId);

  type ResourceItem = {
    id: number;
    title: string;
    link: string;
    icon: React.ReactElement;
    desc: string;
  };

  const resources: ResourceItem[] = [
    lesson?.videoUrl && {
      id: 2,
      title: "Lesson Video",
      link: lesson.videoUrl,
      icon: <BookOpen className="w-5 h-5 text-orange-500" />,
      desc: "Watch the lesson video.",
    },
  ].filter((item): item is ResourceItem => Boolean(item));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600 dark:text-gray-400 py-10">
          Loading resources...
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600 dark:text-gray-400 py-10">
          Lesson not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resources
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Access course materials, readings, and helpful links.
        </p>
      </div>

      {/* Document Viewer */}
      {lesson.documentUrl && (
        <LessonDocumentViewer
          documentUrl={lesson.documentUrl}
          title={`${lesson.title} - Document`}
        />
      )}

      {/* Other Resources */}
      {resources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-6 rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md hover:bg-orange-50/40 dark:hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-50">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-500 mt-4 font-medium">
                  Open Resource
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {!lesson.documentUrl && resources.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No resources available for this lesson.
        </div>
      )}
    </div>
  );
}
