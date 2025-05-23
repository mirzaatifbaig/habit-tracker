import { tags } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function TagStatsChart({ data }) {
  const getTagColor = (tagName) => {
    const tag = tags.find((t) => t.name === tagName);
    return tag?.color || "#6b7280";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habits by Tag</CardTitle>
        <CardDescription>
          Distribution and completion rates by tag
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="tagName"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getTagColor(entry.tagName)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const entry = props.payload;
                return [
                  `${value} habits, ${entry.completionRate.toFixed(0)}% completion`,
                  entry.tagName,
                ];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
