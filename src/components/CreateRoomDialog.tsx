"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, X } from "lucide-react";
import { privateApiService } from "@/services/ApiPrivate";
import type { CreateRoomDto, StudyRoomDto } from "@/model/studyRoom/studyRoomTypes";

interface CreateRoomFormProps {
  onRoomCreated?: (room: StudyRoomDto) => void;
  onCancel?: () => void;
}

export function CreateRoomForm({ onRoomCreated, onCancel }: CreateRoomFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateRoomDto>({
    name: "",
    description: "",
    isPrivate: false,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const room = await privateApiService.createRoom(formData);
      console.log("✅ Room created:", room);
      
      onRoomCreated?.(room);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        isPrivate: false,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      });
    } catch (err) {
      console.error("❌ Failed to create room:", err);
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Create New Study Room
          </h2>
          <p className="text-muted-foreground mt-1">
            Create a new study room for you and your friends to study together.
          </p>
        </div>
        {onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Room Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Math Study Session"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            placeholder="What will you study?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
          />
        </div>

        {/* Time Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Time */}
          <div className="space-y-2">
            <label htmlFor="startTime" className="text-sm font-medium">
              Start Time *
            </label>
            <input
              id="startTime"
              type="datetime-local"
              value={formData.startTime.slice(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, startTime: new Date(e.target.value).toISOString() })
              }
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label htmlFor="endTime" className="text-sm font-medium">
              End Time *
            </label>
            <input
              id="endTime"
              type="datetime-local"
              value={formData.endTime.slice(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, endTime: new Date(e.target.value).toISOString() })
              }
              required
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>
        </div>

        {/* Private Room Switch */}
        <div className="flex items-center gap-3 p-4 border border-border rounded-md">
          <input
            id="private"
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
            className="w-4 h-4"
          />
          <div>
            <label htmlFor="private" className="text-sm font-medium cursor-pointer">
              Private Room
            </label>
            <p className="text-sm text-muted-foreground">
              Requires invite code to join
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
