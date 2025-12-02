import type { Lesson } from "@/model/lesson/lessonTypes";
import type { LearningContent } from "@/model/ai/aiTypes";

/**
 * Generate learning content from lesson data (client-side, no backend required)
 */
export function generateLearningContentFromLesson(lesson: Lesson): LearningContent {
  const now = new Date().toISOString();
  
  // Extract key information from lesson
  const title = lesson.title || "Untitled Lesson";
  const description = lesson.description || "";
  const category = lesson.category || "";
  const duration = lesson.durationMinutes || 0;

  // Create summary from description or title
  const summary = description 
    ? `${description.substring(0, 200)}${description.length > 200 ? "..." : ""}`
    : `This lesson covers ${title}. You will learn the fundamental concepts and practical applications.`;

  // Generate sections based on lesson data
  const sections = generateSections(title, description, category, duration);

  // Generate key takeaways
  const keyTakeaways = generateKeyTakeaways(title, description, category);

  return {
    id: `generated-${lesson.id}-${Date.now()}`,
    lessonId: lesson.id,
    sections,
    summary,
    keyTakeaways,
    generatedByAI: true,
    createdAt: now,
  };
}

function generateSections(
  title: string,
  description: string,
  category: string,
  duration: number
): Array<{
  title: string;
  content: string;
  order: number;
  keyPoints: string[];
  examples?: string[];
}> {
  const sections: Array<{
    title: string;
    content: string;
    order: number;
    keyPoints: string[];
    examples?: string[];
  }> = [];

  // Section 1: Introduction
  sections.push({
    title: "Introduction",
    content: `Welcome to ${title}. This lesson will introduce you to the core concepts and provide a solid foundation for your learning journey.`,
    order: 1,
    keyPoints: [
      "Understanding the basics",
      "Setting up your learning environment",
      "Overview of key concepts",
    ],
    examples: description ? [description.substring(0, 100)] : undefined,
  });

  // Section 2: Main Concepts
  if (description) {
    sections.push({
      title: "Core Concepts",
      content: description.length > 300 
        ? description.substring(0, 300) + "..."
        : description,
      order: 2,
      keyPoints: extractKeyPoints(description),
      examples: category ? [`Example from ${category} category`] : undefined,
    });
  }

  // Section 3: Practical Application
  sections.push({
    title: "Practical Application",
    content: `In this section, you'll apply what you've learned through hands-on exercises and real-world examples related to ${title}.`,
    order: 3,
    keyPoints: [
      "Practice exercises",
      "Real-world applications",
      "Common use cases",
    ],
    examples: [
      "Try implementing the concepts yourself",
      "Work through provided examples",
      "Experiment with variations",
    ],
  });

  // Section 4: Summary and Next Steps
  sections.push({
    title: "Summary and Next Steps",
    content: `You've completed ${title}. Review the key concepts and consider how to apply them in your future learning.`,
    order: 4,
    keyPoints: [
      "Review key concepts",
      "Practice regularly",
      "Explore advanced topics",
    ],
  });

  return sections;
}

function extractKeyPoints(text: string): string[] {
  // Simple extraction: look for sentences that might be key points
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints: string[] = [];
  
  // Take first few meaningful sentences as key points
  for (let i = 0; i < Math.min(3, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (sentence.length > 0) {
      keyPoints.push(sentence.substring(0, 100) + (sentence.length > 100 ? "..." : ""));
    }
  }

  // If not enough key points, add generic ones
  if (keyPoints.length < 2) {
    keyPoints.push("Understand the fundamental principles");
    keyPoints.push("Apply concepts in practical scenarios");
  }

  return keyPoints;
}

function generateKeyTakeaways(
  title: string,
  description: string,
  category: string
): string[] {
  const takeaways: string[] = [];

  takeaways.push(`Master the core concepts of ${title}`);
  
  if (description) {
    takeaways.push("Understand the practical applications");
  }

  if (category) {
    takeaways.push(`Apply ${category} principles effectively`);
  }

  takeaways.push("Build a strong foundation for advanced topics");
  takeaways.push("Practice regularly to reinforce learning");

  return takeaways;
}

/**
 * Try to extract text from document URL (for future enhancement)
 * Currently returns null as we can't read files from frontend
 */
export async function extractTextFromDocument(documentUrl: string | undefined): Promise<string | null> {
  if (!documentUrl) return null;
  
  // Note: Reading documents from URLs requires CORS and proper file handling
  // This is a placeholder for future implementation
  // In a real scenario, you might:
  // 1. Use a document parsing service
  // 2. Have backend extract text and send to frontend
  // 3. Use browser APIs if document is accessible
  
  return null;
}





