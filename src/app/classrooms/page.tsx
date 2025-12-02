"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { RoomList } from "@/components/RoomList";
import { useUserPlan } from "@/hooks/useUserPlan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

export default function ClassroomsPage() {
  const router = useRouter();
  const { userPlan, loading } = useUserPlan();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  useEffect(() => {
    // Chờ loading xong rồi mới check
    if (!loading) {
      // Nếu user chưa có Premium, hiển thị dialog
      if (!userPlan?.isPremium) {
        setShowPremiumDialog(true);
      }
    }
  }, [loading, userPlan]);

  const handleUpgrade = () => {
    router.push("/plans");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {userPlan?.isPremium ? (
          <RoomList />
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Lock className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Classroom feature requires a Premium membership
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Premium Required Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 bg-linear-to-br from-orange-500 to-yellow-500 p-4 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Premium Membership Required
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              The Classroom feature is only available for Premium members.
              Upgrade now to unlock:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-orange-500">✓</div>
              <div>
                <p className="font-semibold">Virtual Study Rooms</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join unlimited study sessions with video calls
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-orange-500">✓</div>
              <div>
                <p className="font-semibold">AI Study Assistant</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get personalized learning recommendations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-orange-500">✓</div>
              <div>
                <p className="font-semibold">Premium Mascots & Frames</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your profile with exclusive items
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              Upgrade to Premium
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
