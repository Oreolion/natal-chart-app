"use client";

import Navbar from "@/components/Navbar";

// import { useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";

export default function Home() {
  //   const latestChart = useQuery(api.charts.getLatestChart);
  return (
    <div>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">ReadAstra Natal Chart Calculator</h1>
        <p className="text-lg">
          Calculate your natal chart based on your birth data.
        </p>

      </main>
    </div>
  );
}
