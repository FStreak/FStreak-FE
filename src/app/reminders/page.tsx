"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { privateApiService } from "@/services/ApiPrivate";
import type { ReminderEntry, ReminderType } from "@/model/reminder/reminderTypes";

export default function RemindersPage() {
  const [items, setItems] = useState<ReminderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await privateApiService.getReminders();
        if (mounted) setItems(res);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Không thể tải reminders");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const grouped = items.reduce<Record<ReminderType, ReminderEntry[]>>((acc, it) => {
    const key = (it.type || 'streak') as ReminderType;
    if (!acc[key]) acc[key] = [];
    acc[key].push(it);
    return acc;
  }, { streak: [], studyRoom: [], lesson: [] });

  const toggle = async (id: string, enabled: boolean) => {
    try {
      const updated = await privateApiService.updateReminder(id, { enabled });
      setItems((s) => s.map(i => i.id === id ? updated : i));
    } catch (e) {
      console.error('Toggle failed', e);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Reminders</h1>
        {error && <div className="text-red-600">{error}</div>}
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['streak','studyRoom','lesson'] as ReminderType[]).map((type) => (
                <div key={type} className="p-3 border rounded">
                  <div className="font-semibold mb-2">{type.toUpperCase()}</div>
                  <div className="space-y-2">
                    {grouped[type]?.length ? grouped[type].map(r => (
                      <div key={r.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-muted-foreground">{r.schedule || r.detail}</div>
                        </div>
                        <div>
                          <button
                            onClick={() => toggle(r.id, !r.enabled)}
                            className={`px-3 py-1 rounded ${r.enabled ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                            {r.enabled ? 'On' : 'Off'}
                          </button>
                        </div>
                      </div>
                    )) : <div className="text-sm text-muted-foreground">No reminders</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
