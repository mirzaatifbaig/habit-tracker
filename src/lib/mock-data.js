import { addDays, format, subDays, subWeeks } from "date-fns";

export const tags = [
  { id: "1", name: "Health", color: "#4CAF50" },
  { id: "2", name: "Productivity", color: "#2196F3" },
  { id: "3", name: "Learning", color: "#9C27B0" },
  { id: "4", name: "Mindfulness", color: "#FF9800" },
  { id: "5", name: "Personal", color: "#F44336" },
];

export const habits = [
  {
    id: "1",
    name: "Morning Walk",
    description: "30 minutes morning walk",
    frequency: "daily",
    createdAt: subWeeks(new Date(), 5),
    tags: ["1"],
    color: "#4CAF50",
  },
  {
    id: "2",
    name: "Read 30 minutes",
    description: "Read a book for at least 30 minutes",
    frequency: "daily",
    createdAt: subWeeks(new Date(), 8),
    tags: ["3", "4"],
    color: "#9C27B0",
  },
  {
    id: "3",
    name: "Meditate",
    description: "10 minutes meditation",
    frequency: "daily",
    createdAt: subWeeks(new Date(), 3),
    tags: ["4"],
    color: "#FF9800",
  },
  {
    id: "4",
    name: "Weekly Review",
    description: "Review goals and plan next week",
    frequency: "weekly",
    createdAt: subWeeks(new Date(), 10),
    tags: ["2"],
    color: "#2196F3",
  },
  {
    id: "5",
    name: "Practice Guitar",
    description: "Practice guitar for 20 minutes",
    frequency: "custom",
    customDays: [1, 3, 5],
    createdAt: subWeeks(new Date(), 2),
    tags: ["5"],
    color: "#F44336",
  },
];

const generateMockEntries = () => {
  const entries = [];

  habits.forEach((habit) => {
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      const dayOfWeek = date.getDay();

      if (habit.frequency === "weekly" && dayOfWeek !== 0) continue;

      if (
        habit.frequency === "custom" &&
        habit.customDays &&
        !habit.customDays.includes(dayOfWeek === 0 ? 7 : dayOfWeek)
      )
        continue;

      const daysFactor = i / 30;
      const baseCompletionRate = 0.7 - daysFactor * 0.4;
      const completed = Math.random() < baseCompletionRate;

      entries.push({
        id: `${habit.id}-${format(date, "yyyy-MM-dd")}`,
        habitId: habit.id,
        date,
        completed,
        note: completed ? undefined : "Missed this day",
      });
    }
  });

  return entries;
};

export const habitEntries = generateMockEntries();

export const generateWeeklyStats = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const stats = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayOfWeek = date.getDay();

    const dayEntries = habitEntries.filter(
      (entry) =>
        format(entry.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    );

    const completed = dayEntries.filter((entry) => entry.completed).length;

    stats.push({
      day: days[dayOfWeek],
      completed,
      total: dayEntries.length,
    });
  }

  return stats;
};

export const generateMonthlyStats = () => {
  const stats = [];

  for (let i = 0; i < 4; i++) {
    const weekStart = subWeeks(new Date(), i);
    const weekStartStr = format(weekStart, "MMM d");
    const weekEnd = subDays(addDays(weekStart, 7), 1);
    const weekEndStr = format(weekEnd, "MMM d");

    const weekEntries = habitEntries.filter(
      (entry) => entry.date >= weekStart && entry.date <= weekEnd,
    );

    const completed = weekEntries.filter((entry) => entry.completed).length;
    const completionRate =
      weekEntries.length > 0 ? (completed / weekEntries.length) * 100 : 0;

    stats.push({
      date: `${weekStartStr} - ${weekEndStr}`,
      completed,
      completionRate,
    });
  }

  return stats.reverse();
};

export const generateTagStats = () => {
  const stats = [];

  tags.forEach((tag) => {
    const taggedHabits = habits.filter((habit) => habit.tags.includes(tag.id));

    if (taggedHabits.length === 0) return;

    const tagEntries = habitEntries.filter((entry) =>
      taggedHabits.some((habit) => habit.id === entry.habitId),
    );

    const completed = tagEntries.filter((entry) => entry.completed).length;
    const completionRate =
      tagEntries.length > 0 ? (completed / tagEntries.length) * 100 : 0;

    stats.push({
      tagName: tag.name,
      count: taggedHabits.length,
      completionRate,
    });
  });

  return stats;
};

export const weeklyStats = generateWeeklyStats();
export const monthlyStats = generateMonthlyStats();
export const tagStats = generateTagStats();
