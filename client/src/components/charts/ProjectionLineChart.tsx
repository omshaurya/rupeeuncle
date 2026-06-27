import {
  LineChart,
  Line,
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
  /** Which numeric keys from YearlyRow to plot as lines, with display labels and colors. */
  lines: { key: string; label: string; color: string }[];
}

export default function ProjectionLineChart({ data, lines }: Props) {
  return (
    <div className="h-96 w-full" role="img" aria-label="Year-wise projection line chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
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
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #dde6e6",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={3}
              dot={false}
              animationDuration={600}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
