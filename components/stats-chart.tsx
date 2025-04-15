"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useState } from "react";
import { useFinancial } from "@/contexts/FinancialContext";

export function StatsChart() {
  const { profile, isLoading } = useFinancial();
  const [timePeriod, setTimePeriod] = useState<"quarter" | "6months" | "year">(
    "year"
  );

  const getFilteredData = () => {
    if (!profile) return [];
    const currentMonth = new Date().getMonth(); // 0-11
    const monthsInYear = 12;
    const data = profile.monthlyStats;

    switch (timePeriod) {
      case "quarter":
        const quarterStart = (currentMonth - 2 + monthsInYear) % monthsInYear;
        return [
          ...data.slice(quarterStart),
          ...data.slice(0, currentMonth + 1),
        ].slice(-3);
      case "6months":
        const sixMonthStart = (currentMonth - 5 + monthsInYear) % monthsInYear;
        return [
          ...data.slice(sixMonthStart),
          ...data.slice(0, currentMonth + 1),
        ].slice(-6);
      case "year":
        return data;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No data available</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTimePeriod("quarter")}
          className={`px-4 py-2 rounded-lg text-sm ${
            timePeriod === "quarter"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          Last Quarter
        </button>
        <button
          onClick={() => setTimePeriod("6months")}
          className={`px-4 py-2 rounded-lg text-sm ${
            timePeriod === "6months"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          Last 6 Months
        </button>
        <button
          onClick={() => setTimePeriod("year")}
          className={`px-4 py-2 rounded-lg text-sm ${
            timePeriod === "year"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          Last Year
        </button>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getFilteredData()}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Income
                          </span>
                          <span className="font-bold text-[#04d9ff]">
                            ${payload[0].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Expenses
                          </span>
                          <span className="font-bold text-[#ff0055]">
                            ${payload[1].value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-black">
                            {payload[0].payload.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              name="Income"
              stroke="#04d9ff"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="spendings"
              name="Expenses"
              stroke="#ff0055"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
