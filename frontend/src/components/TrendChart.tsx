import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import type { WeeklyTrendPoint } from "../types";

export default function TrendChart({
  data,
}: {
  data: WeeklyTrendPoint[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
      }}
      className="h-[320px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
            dataKey="week_label"
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

          {/* LEFT Y AXIS */}
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{
              fontSize: 12,
              fill: "#e2e8f0",
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* RIGHT Y AXIS FOR CHECK-IN COUNT */}
          <YAxis
            yAxisId="right"
            orientation="right"
            hide
            domain={[0, "dataMax + 20"]}
          />

          {/* TOOLTIP */}
          <Tooltip
            cursor={{
              fill: "rgba(66, 214, 197, 0.08)",
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

          {/* LEGEND */}
          <Legend
            wrapperStyle={{
              fontSize: 12,
              paddingTop: 10,
              color: "#e2e8f0",
            }}
            formatter={(value) => (
              <span
                style={{
                  color: "#e2e8f0",
                  fontWeight: 500,
                }}
              >
                {value}
              </span>
            )}
          />

          {/* CHECK-IN BARS */}
          <Bar
            dataKey="checkin_count"
            name="Check-ins"
            fill="#355666"
            radius={[5, 5, 0, 0]}
            yAxisId="right"
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />

          {/* MOOD LINE */}
          <Line
            type="monotone"
            dataKey="avg_mood"
            name="Avg mood"
            stroke="#42d6c5"
            strokeWidth={2.8}
            dot={{
              r: 3.5,
              fill: "#42d6c5",
              strokeWidth: 0,
            }}
            activeDot={{
              r: 6,
            }}
            isAnimationActive
            animationDuration={1100}
            animationEasing="ease-out"
          />

          {/* WORKLOAD LINE */}
          <Line
            type="monotone"
            dataKey="avg_workload"
            name="Avg workload"
            stroke="#f4c95d"
            strokeWidth={2.8}
            dot={{
              r: 3.5,
              fill: "#f4c95d",
              strokeWidth: 0,
            }}
            activeDot={{
              r: 6,
            }}
            isAnimationActive
            animationDuration={1250}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}