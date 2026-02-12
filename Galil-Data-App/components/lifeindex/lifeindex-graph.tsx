// components/lifeindex/lifeindex-graph.tsx
"use client";

import {useMemo} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import {Bar} from "react-chartjs-2";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useIsMobile} from "@/hooks/use-mobile";
import type {LifeIndexFiltersState} from "./lifeindex-filter";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LIFE_INDEX_CHART = {
  labels: [
    "רווחה אישית וחברתית",
    "שירותים",
    "שירותי הבריאות",
    "תעסוקה",
    "תחבורה",
    "השכלה גבוהה",
    "חינוך",
    "דיור ותשתיות",
    "בריאות",
  ],
  values: [56, 46, 42, 41, 36, 31, 25, 20, 16],
};

export function LifeIndexGraph({filters}: {filters: LifeIndexFiltersState}) {
  const isMobile = useIsMobile();
  const barData: ChartData<"bar"> = useMemo(
    () => ({
      labels: LIFE_INDEX_CHART.labels,
      datasets: [
        {
          label: "אחוז",
          data: LIFE_INDEX_CHART.values,
          backgroundColor: "#4fc3e8",
          borderRadius: 6,
        },
      ],
    }),
    [filters]
  );

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {display: false},
      tooltip: {rtl: true},
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        position: "right",
        ticks: {callback: (v) => `${v}%`},
      },
      x: {
        ticks: {
          font: {size: 14},
        },
      },
    },
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-muted-foreground mb-2">
            Charts not available on mobile
          </p>
          <p className="text-sm text-muted-foreground">
            Please use the desktop version to view the graphs
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full border shadow-sm">
      {/* 1. Added px-6 to give the title breathing room from the edge */}
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-xl font-bold">מדד איכות חיים לפי תחום</CardTitle>
      </CardHeader>

      {/* 2. Changed px-0 to p-6 (padding all around) */}
      {/* 3. Replaced h-150 with h-[600px] for a stable, large height */}
      <CardContent className="h-[600px] p-6 pt-0">
        <Bar data={barData} options={barOptions} />
      </CardContent>
    </Card>
  );
}
