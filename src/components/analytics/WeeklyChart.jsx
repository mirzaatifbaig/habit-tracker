import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

export function WeeklyChart({ data }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
        <CardDescription>
          Your habit completion for the past week
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value, name) => {
                if (name === "completed")
                  return [`${value} completed`, "Completed"];
                return [`${value} habits`, "Total"];
              }}
            />
            <Legend />
            <Bar
              dataKey="total"
              fill="#e2e8f0"
              radius={[4, 4, 0, 0]}
              name="Total"
            />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} name="Completed">
              {data.map((entry, index) => {
                const completionRate = entry.completed / entry.total;
                let color = "#4ade80";
                if (completionRate < 0.5) {
                  color = "#f87171";
                } else if (completionRate < 0.8) {
                  color = "#fbbf24";
                }

                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
