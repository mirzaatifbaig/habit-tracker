import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, BarChart3, ListChecks } from "lucide-react";
import {
  habits,
  habitEntries,
  tags,
  weeklyStats,
  monthlyStats,
  tagStats,
} from "@/lib/mock-data";
import { HabitStreakCard } from "@/components/habit-streak-card";
import { WeeklyChart } from "@/components/analytics/WeeklyChart.jsx";
import { MonthlyChart } from "@/components/analytics/MonthlyChart.jsx";
import { TagStatsChart } from "@/components/analytics/TagStats.jsx";
import { HabitForm } from "@/components/HabitForm.jsx";
import { TagBadge } from "@/components/TagBadge.jsx";
import { useToast } from "@/hooks/use-toast";

function App() {
  const [activeTab, setActiveTab] = useState("habits");
  const [habitsData, setHabitsData] = useState(habits);
  const [entriesData, setEntriesData] = useState(habitEntries);
  const [selectedTags, setSelectedTags] = useState([]);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(undefined);
  const { toast } = useToast();

  const filteredHabits = useMemo(() => {
    if (selectedTags.length === 0) return habitsData;
    return habitsData.filter((habit) =>
      habit.tags.some((tagId) => selectedTags.includes(tagId)),
    );
  }, [habitsData, selectedTags]);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const toggleHabitCompletion = (entry) => {
    const updatedEntries = entriesData.map((e) =>
      e.id === entry.id ? { ...e, completed: !e.completed } : e,
    );
    setEntriesData(updatedEntries);

    const habit = habitsData.find((h) => h.id === entry.habitId);
    toast({
      title: entry.completed
        ? "Habit marked as incomplete"
        : "Habit completed!",
      description: `You've ${entry.completed ? "unmarked" : "marked"} "${habit?.name}" as ${entry.completed ? "incomplete" : "complete"} for today.`,
      variant: entry.completed ? "destructive" : "default",
    });
  };

  const handleHabitSubmit = (data) => {
    if (editingHabit) {
      setHabitsData((prev) => prev.map((h) => (h.id === data.id ? data : h)));
      toast({
        title: "Habit updated",
        description: `"${data.name}" has been updated successfully.`,
      });
    } else {
      setHabitsData((prev) => [...prev, data]);
      const today = new Date();
      const newEntry = {
        id: `${data.id}-${today.toISOString().split("T")[0]}`,
        habitId: data.id,
        date: today,
        completed: false,
      };
      setEntriesData((prev) => [...prev, newEntry]);
      toast({
        title: "Habit created",
        description: `"${data.name}" has been added to your habits.`,
      });
    }
    setEditingHabit(undefined);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">HabitHub</h1>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="habits" className="flex items-center gap-1">
                <ListChecks size={16} />
                <span className="hidden sm:inline">Habits</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-1"
              >
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setEditingHabit(undefined);
              setHabitFormOpen(true);
            }}
            className="hidden sm:flex"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => {
              setEditingHabit(undefined);
              setHabitFormOpen(true);
            }}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/63869168"
              alt="User"
            />
            <AvatarFallback>MAB</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <HabitForm
        open={habitFormOpen}
        onOpenChange={setHabitFormOpen}
        onSubmit={handleHabitSubmit}
        availableTags={tags}
        editHabit={editingHabit}
      />

      <main>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="habits" className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Filter by tag:
              </span>
              {tags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                  selected={selectedTags.includes(tag.id)}
                  onClick={() => toggleTag(tag.id)}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHabits.map((habit) => (
                <HabitStreakCard
                  key={habit.id}
                  habit={habit}
                  entries={entriesData.filter((e) => e.habitId === habit.id)}
                  onToggleComplete={toggleHabitCompletion}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <WeeklyChart data={weeklyStats} />
              <TagStatsChart data={tagStats} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MonthlyChart data={monthlyStats} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
