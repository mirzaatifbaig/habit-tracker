import { format, subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { StreakDots } from "@/components/ui/streak-dots";
import { tags } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";

export function HabitStreakCard({ habit, entries, onToggleComplete }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const entry = entries.find(
      (e) =>
        format(e.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
        e.habitId === habit.id,
    );

    return entry ? { date, entry } : null;
  }).filter((day) => day !== null);

  const getCurrentStreak = () => {
    let streak = 0;
    const sortedEntries = entries
      .filter((e) => e.habitId === habit.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    for (const entry of sortedEntries) {
      if (!entry.completed) break;
      streak++;
    }

    return streak;
  };

  const currentStreak = getCurrentStreak();

  const recentEntries = entries
    .filter((e) => e.habitId === habit.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 7);

  const completionRate =
    recentEntries.length > 0
      ? (recentEntries.filter((e) => e.completed).length /
          recentEntries.length) *
        100
      : 0;

  const today = new Date();
  const todayEntry = entries.find(
    (e) =>
      format(e.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") &&
      e.habitId === habit.id,
  );

  const habitTags = tags.filter((tag) => habit.tags.includes(tag.id));

  const streakData = last7Days.map((day) => day?.entry?.completed || false);

  return (
    <Card className="h-full">
      <CardHeader
        style={{ borderLeft: `4px solid ${habit.color}` }}
        className="pb-2"
      >
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{habit.name}</CardTitle>
          <div className="flex gap-1">
            {habitTags.map((tag) => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color }}
                className="text-white"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <CardDescription>{habit.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Last 7 Days</div>
            <StreakDots days={streakData} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Current Streak</span>
            <span className="font-bold text-primary">{currentStreak} days</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {todayEntry ? (
          <Button
            variant={todayEntry.completed ? "outline" : "default"}
            className="w-full"
            onClick={() => onToggleComplete(todayEntry)}
          >
            {todayEntry.completed ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Not Scheduled Today
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
