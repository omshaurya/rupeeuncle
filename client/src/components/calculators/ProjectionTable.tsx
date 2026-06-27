import type { YearlyRow } from "../../types/calculator";
import { formatINR } from "../../utils/formatters";

interface Props {
  data: YearlyRow[];
}

export default function ProjectionTable({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-800 text-white dark:bg-surface-900">
            <tr>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Invested</th>
              <th className="px-4 py-3 font-semibold">Returns</th>
              <th className="px-4 py-3 font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.year}
                className={i % 2 === 0 ? "bg-white dark:bg-surface-800" : "bg-ink-50 dark:bg-surface-700/60"}
              >
                <td className="px-4 py-2.5 font-medium text-ink-700 dark:text-ink-200">
                  {row.year}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-ink-600 dark:text-ink-300">
                  {formatINR(row.invested)}
                </td>
                <td className="px-4 py-2.5 tabular-nums text-gain dark:text-gain-dark">
                  {formatINR(row.returns)}
                </td>
                <td className="px-4 py-2.5 tabular-nums font-semibold text-ink-900 dark:text-ink-50">
                  {formatINR(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
