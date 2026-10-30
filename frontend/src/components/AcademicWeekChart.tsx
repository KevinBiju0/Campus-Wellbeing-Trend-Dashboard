import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import type { AcademicWeekPoint } from "../types";

export default function AcademicWeekChart({
  data,
}: {
  data: AcademicWeekPoint[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.08,
        ease: "easeOut",
      }}
      className="h-[280px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 8,
            right: 12,
            left: -12,
            bottom: 8,
          }}
        >
          {/* GRADIENTS */}
          <defs>
            <linearGradient
              id="moodGradAnimated"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#42d6c5"
                stopOpacity={0.42}
              />
              <stop
                offset="95%"
                stopColor="#42d6c5"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient
              id="workloadGradAnimated"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#f4c95d"
                stopOpacity={0.42}
              />
              <stop
                offset="95%"
                stopColor="#f4c95d"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* GRID */}
          <CartesianGrid
            stroke="#355666"
            strokeDasharray="4 6"
            vertical={false}
            opacity={0.65}
          />

          {/* X AXIS */}
          <XAxis
            dataKey="academic_week"
            tickFormatter={(v) => `W${v}`}
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

          {/* TOOLTIP */}
          <Tooltip
            formatter={(value: number) => [
              value.toFixed(2),
              "Score",
            ]}
            labelFormatter={(label) =>
              `Academic Week ${label}`
            }
            cursor={{
              stroke: "#42d6c5",
              strokeDasharray: "4 4",
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

          {/* MOOD */}
          <Area
            type="monotone"
            dataKey="avg_mood"
            name="Avg mood"
            stroke="#42d6c5"
            strokeWidth={2.7}
            fillOpacity={1}
            fill="url(#moodGradAnimated)"
            isAnimationActive
            animationDuration={1200}
            animationEasing="ease-out"
            activeDot={{
              r: 5,
            }}
          />

          {/* WORKLOAD */}
          <Area
            type="monotone"
            dataKey="avg_workload"
            name="Avg workload"
            stroke="#f4c95d"
            strokeWidth={2.7}
            fillOpacity={1}
            fill="url(#workloadGradAnimated)"
            isAnimationActive
            animationDuration={1350}
            animationEasing="ease-out"
            activeDot={{
              r: 5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}