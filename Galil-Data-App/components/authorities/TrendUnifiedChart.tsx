"use client";

/**
 * TrendUnifiedChart.tsx
 *
 * EN DOC (written by me):
 * - This component is used ONLY in the "Unified Trend" tab.
 * - It fetches REAL population time-series from our server endpoint:
 *   GET /api/authorities/trend?startYear=...&endYear=...&metric=total_population&limit=9999
 * - The API returns multiple series (one per authority).
 * - Here I aggregate them into ONE unified series by summing values per year.
 * - If the user selects a year in the side panel (e.g. year=2017),
 *   I show data from that year until 2023 (2017–2023).
 */

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendChartCard from "@/components/ui/TrendChartCard";

type Point = { x: number | string; y: number };
type Series = { name: string; points: Point[] };

export default function TrendUnifiedChart() {
  const sp = useSearchParams();
  const isMobile = useIsMobile();

  // EN DOC:
  // The "year" comes from the URL query params because SideFilterPanel updates it:
  // example: ?year=2017
  const yearParam = sp?.get("year"); // "2017" | "none" | null

  const startYear =
    yearParam && yearParam !== "none" ? parseInt(yearParam, 10) : 2002;

  // EN DOC:
  // Dataset ends at 2023 in our current population table.
  const endYear = 2023;

  const [series, setSeries] = React.useState<Series[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUnified = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("startYear", String(startYear));
        params.set("endYear", String(endYear));
        params.set("metric", "total_population");

        // EN DOC:
        // We want to aggregate ALL authorities into a single line,
        // so we request a high limit.
        params.set("limit", "9999");

        const res = await fetch(`/api/authorities/trend?${params.toString()}`);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data: Series[] = await res.json();

        // EN DOC:
        // Aggregate (SUM) population across all authorities per year.
        const sumByYear = new Map<number, number>();

        (data || []).forEach((s) => {
          (s.points || []).forEach((p) => {
            const y = typeof p.x === "string" ? parseInt(p.x, 10) : p.x;
            const prev = sumByYear.get(y) || 0;
            sumByYear.set(y, prev + (p.y || 0));
          });
        });

        const unifiedPoints: Point[] = Array.from(sumByYear.entries())
          .map(([x, y]) => ({ x, y }))
          .sort((a, b) => Number(a.x) - Number(b.x))
          .filter((p) => Number(p.x) >= startYear && Number(p.x) <= endYear);

        setSeries([
          {
            name: "מגמה אחודה",
            points: unifiedPoints,
          },
        ]);
      } catch (e: any) {
        setError(String(e?.message ?? e));
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnified();
  }, [startYear]);

  const yearRangeText =
    yearParam && yearParam !== "none"
      ? `שנים ${startYear} - ${endYear}`
      : `שנים 2002 - ${endYear}`;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        טוען נתונים...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        שגיאה בטעינת הנתונים: {error}
      </div>
    );
  }

  return (
    <TrendChartCard
      className="h-full"
      title={`מגמה אחודה של הרשויות שנבחרו במדד אוכלוסיה (אנשים) ב${yearRangeText}`}
      subtitle={'קובץ רשויות מקומיות, למ"ס'}
      yLabel="אנשים"
      xLabel="שנה"
      series={series}
      variant="bare"
    />
  );
}
