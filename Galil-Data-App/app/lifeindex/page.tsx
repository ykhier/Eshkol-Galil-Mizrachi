"use client";

import {useState} from "react";

import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";

import {LifeIndexFilter, LifeIndexFiltersState} from "@/components/lifeindex/lifeindex-filter";
import {LifeIndexGraph} from "@/components/lifeindex/lifeindex-graph";

export default function LifeIndexPage() {
  const [filters, setFilters] = useState<LifeIndexFiltersState>([]);

  return (
    <>
      {/* 1. Changed 'container' to 'max-w-[1600px]' or 'w-full px-4' for more width */}
      <div dir="rtl" className="max-w-360 mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 text-right">
        {" "}
        <h1 className="text-3xl font-bold text-center mb-8">מדד איכות חיים - אשכול גליל מזרחי</h1>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="flex flex-row-reverse justify-end gap-4 mb-6" dir="ltr">
            <TabsTrigger value="current" className="px-6">
              זרקור
            </TabsTrigger>
          </TabsList>

          {/* CURRENT TAB */}
          <TabsContent value="current" className="space-y-6 w-full">
            {/* Filters */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <LifeIndexFilter onChange={setFilters} />
            </div>

            {/* 2. The Graph Component will now expand into the 1400px width provided above */}
            <LifeIndexGraph filters={filters} />
          </TabsContent>

          {/* COMPARISON TAB */}
          <TabsContent value="comparison">
            <Card>
              <CardContent className="p-6">TODO: comparison view</CardContent>
            </Card>
          </TabsContent>

          {/* RESEARCH TAB */}
          <TabsContent value="research">
            <Card>
              <CardContent className="p-6">TODO: research view</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
