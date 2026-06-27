import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlyRow } from "../../types/calculator";
import { formatCompactINR, formatINR } from "../../utils/formatters";

interface Props {
  data: YearlyRow[];
  bars: { key: string; label: string; color: string }[];
}

export default function YearlyBarChart({ data, bars }: Props) {
  return (
    <div className="h-96 w-full" role="img" aria-label="Year-wise bar chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#b8cccc" opacity={0.5} />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `Yr ${y}`}
            tick={{ fontSize: 12, fill: "#5c8688" }}
          />
          <YAxis
            tickFormatter={(v) => formatCompactINR(v)}
            tick={{ fontSize: 12, fill: "#5c8688" }}
            width={64}
          />
          <Tooltip
            formatter={(value: number) => formatINR(value)}
            labelFormatter={(y) => `Year ${y}`}
            contentStyle={{ borderRadius: 12, border: "1px solid #dde6e6", fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
