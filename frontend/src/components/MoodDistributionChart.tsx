import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import type { MoodDistribution } from "../types";

const COLORS = [
  "#ef7d7d",
  "#f4c95d",
  "#d9bf6a",
  "#6ed7c8",
  "#42d6c5",
];

export default function MoodDistributionChart({
  data,
}: {
  data: MoodDistribution[];
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.55,
        delay: 0.12,
        ease: "easeOut",
      }}
      className="h-[260px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 8,
            right: 12,
            left: -12,
            bottom: 8,
          }}
        >
          {/* GRID */}
          <CartesianGrid
            stroke="#355666"
            strokeDasharray="4 6"
            vertical={false}
            opacity={0.65}
          />

          {/* X AXIS */}
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              fill: "#e2e8f0",
              fontWeight: 500,
            }}
            axisLine={{
              stroke: "#416273",
            }}
            tickLine={false}
            dy={6}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{
              fontSize: 12,
              fill: "#e2e8f0",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          {/* TOOLTIP */}
          <Tooltip
            cursor={{
              fill: "rgba(66, 214, 197, 0.08)",
            }}
            formatter={(value, _name, item) => {
              const count = Number(value);
              const percentage = item?.payload?.percentage;

              return [
                percentage !== undefined
                  ? `${count} check-ins (${percentage}%)`
                  : `${count} check-ins`,
                "Count",
              ];
            }}
            contentStyle={{
              background: "rgba(7, 18, 30, 0.98)",
              border: "1px solid #426273",
              borderRadius: 14,
              fontSize: 13,
              color: "#f8fafc",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
              padding: "10px 12px",
            }}
            labelStyle={{
              color: "#ffffff",
              fontWeight: 600,
              marginBottom: 6,
            }}
            itemStyle={{
              color: "#e2e8f0",
              fontWeight: 500,
            }}
          />

          {/* BARS */}
          <Bar
            dataKey="count"
            radius={[7, 7, 0, 0]}
            isAnimationActive
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.score}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}