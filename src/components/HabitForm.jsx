import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  tags: z.array(z.string()),
  color: z.string().optional(),
  customDays: z.array(z.number()).optional(),
});

export function HabitForm({
  open,
  onOpenChange,
  onSubmit,
  availableTags,
  editHabit,
}) {
  const [frequency, setFrequency] = useState(editHabit?.frequency || "daily");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editHabit?.name || "",
      description: editHabit?.description || "",
      frequency: editHabit?.frequency || "daily",
      tags: editHabit?.tags || [],
      color: editHabit?.color || "#3b82f6",
      customDays: editHabit?.customDays || [],
    },
  });

  function handleSubmit(values) {
    onSubmit({
      id: editHabit?.id || crypto.randomUUID(),
      name: values.name,
      description: values.description,
      frequency: values.frequency,
      tags: values.tags,
      color: values.color,
      customDays: values.customDays,
      createdAt: editHabit?.createdAt || new Date(),
    });
    onOpenChange(false);
  }

  const weekdays = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
    { id: 7, label: "Sunday" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editHabit ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
          <DialogDescription>
            {editHabit
              ? "Modify your existing habit details."
              : "Add a new habit to track your progress."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Walk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the habit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFrequency(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often do you want to perform this habit?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {frequency === "custom" && (
              <FormField
                control={form.control}
                name="customDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Select Days</FormLabel>
                      <FormDescription>
                        Which days of the week do you want to perform this
                        habit?
                      </FormDescription>
                    </div>
                    {weekdays.map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name="customDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    const currentDays = field.value || [];
                                    return checked
                                      ? field.onChange([...currentDays, day.id])
                                      : field.onChange(
                                          currentDays.filter(
                                            (id) => id !== day.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Tags</FormLabel>
                    <FormDescription>
                      Categorize your habit for better organization
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTags.map((tag) => (
                      <FormField
                        key={tag.id}
                        control={form.control}
                        name="tags"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={tag.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tag.id)}
                                  onCheckedChange={(checked) => {
                                    const currentTags = field.value || [];
                                    return checked
                                      ? field.onChange([...currentTags, tag.id])
                                      : field.onChange(
                                          currentTags.filter(
                                            (id) => id !== tag.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel
                                className="font-normal flex items-center"
                                style={{ color: tag.color }}
                              >
                                <span
                                  className="h-3 w-3 rounded-full mr-1"
                                  style={{ backgroundColor: tag.color }}
                                ></span>
                                {tag.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <label
                        htmlFor="custom-color"
                        className="w-8 h-8 rounded-xl cursor-pointer"
                        style={{ backgroundColor: field.value }}
                      >
                        <input
                          id="custom-color"
                          type="color"
                          {...field}
                          className="opacity-0 w-0 h-0"
                        />
                      </label>
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Pick a color to represent this habit
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {editHabit ? "Save Changes" : "Create Habit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
