import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatINR } from "../../utils/formatters";

interface Props {
  data: { name: string; value: number }[];
}

// Ink + gold palette, consistent with the design tokens — not default Recharts colors.
const COLORS = ["#e2a934", "#1f8a5f", "#2c4f51", "#c23b3b", "#5c8688", "#c98c1f"];

export default function BreakdownPieChart({ data }: Props) {
  return (
    <div className="h-80 w-full" role="img" aria-label="Investment breakdown pie chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            animationDuration={600}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatINR(value)} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
