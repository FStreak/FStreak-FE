"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Lesson, LessonFormData } from "@/model/lesson/lessonTypes";
import { LESSON_CATEGORIES } from "@/model/lesson/lessonTypes";

interface LessonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson | null;
  onSubmit: (formData: LessonFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LessonForm({
  open,
  onOpenChange,
  lesson,
  onSubmit,
  isLoading = false,
}: LessonFormProps) {
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    description: "",
    category: undefined,
    startAt: "",
    durationMinutes: 60,
    isPublished: false,
    documentFile: null,
    videoFile: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when lesson changes or dialog opens
  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        description: lesson.description || "",
        category: lesson.category,
        startAt: lesson.startAt ? new Date(lesson.startAt).toISOString().slice(0, 16) : "",
        durationMinutes: lesson.durationMinutes || 60,
        isPublished: lesson.isPublished || false,
        documentFile: null,
        videoFile: null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: undefined,
        startAt: "",
        durationMinutes: 60,
        isPublished: false,
        documentFile: null,
        videoFile: null,
      });
    }
    setErrors({});
  }, [lesson, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (formData.durationMinutes && (formData.durationMinutes < 1 || formData.durationMinutes > 1440)) {
      newErrors.durationMinutes = "Duration must be between 1 and 1440 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
          <DialogDescription>
            {lesson ? "Update the lesson details below." : "Fill in the details to create a new lesson."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter lesson title"
              maxLength={200}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter lesson description"
              maxLength={1000}
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as LessonFormData["category"] || undefined })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Chọn category</option>
              {LESSON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date/Time */}
          <div className="space-y-2">
            <Label htmlFor="startAt">Start Date & Time</Label>
            <Input
              id="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Duration (minutes)</Label>
            <Input
              id="durationMinutes"
              type="number"
              min={1}
              max={1440}
              value={formData.durationMinutes || ""}
              onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
              placeholder="60"
              className={errors.durationMinutes ? "border-red-500" : ""}
            />
            {errors.durationMinutes && <p className="text-xs text-red-500">{errors.durationMinutes}</p>}
          </div>

          {/* Document File */}
          <div className="space-y-2">
            <Label htmlFor="documentFile">Document File</Label>
            <Input
              id="documentFile"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFormData({ ...formData, documentFile: e.target.files?.[0] || null })}
            />
            <p className="text-xs text-muted-foreground">Upload a document (PDF, DOC, DOCX, TXT)</p>
          </div>

          {/* Video File */}
          <div className="space-y-2">
            <Label htmlFor="videoFile">Video File</Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={(e) => setFormData({ ...formData, videoFile: e.target.files?.[0] || null })}
            />
            <p className="text-xs text-muted-foreground">Upload a video file</p>
          </div>

          {/* Is Published */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Label htmlFor="isPublished">Publish Lesson</Label>
              <p className="text-xs text-muted-foreground">
                Make this lesson visible to students
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : lesson ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



