"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Key, Loader2 } from "lucide-react";
import { privateApiService } from "@/services/ApiPrivate";
import type { JoinRoomByCodeResponse } from "@/model/studyRoom/studyRoomTypes";

interface JoinRoomByCodeProps {
  onJoined?: (response: JoinRoomByCodeResponse) => void;
  onCancel?: () => void;
}

export function JoinRoomByCode({ onJoined, onCancel }: JoinRoomByCodeProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError("Please enter an invite code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await privateApiService.joinRoomByCode(code.trim().toUpperCase(), true);
      console.log("✅ Joined room by code:", response);
      
      onJoined?.(response);
      setCode("");
    } catch (err) {
      console.error("❌ Failed to join room:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to join room. Please check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Join Study Room</h2>
        <p className="text-muted-foreground mt-2">
          Enter the invite code to join a private study room
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Invite Code Input */}
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium">
            Invite Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="e.g., OIUKY0BE"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            maxLength={8}
            className="w-full px-4 py-3 border border-border rounded-md bg-background text-center text-2xl font-mono tracking-wider uppercase"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground text-center">
            Code format: 8 characters (e.g., OIUKY0BE)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading || !code.trim()} 
            className="flex-1 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Room"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
