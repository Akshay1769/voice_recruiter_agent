"use client";

import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { UserCircleIcon, Info } from "lucide-react";

type Candidate = {
  email: string;
  ats_score: number;
  shortlisted: boolean;
  role: string;
};

function InfoTooltip({ content }: { content: string }) {
  return (
    <div title={content}>
      <Info
        className="h-2 w-2 text-[#4F46E5] inline-block ml-0 align-super font-bold"
        strokeWidth={2.5}
      />
    </div>
  );
}

function AnalyticsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    getCandidates();
  }, []);

  const getCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCandidates(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const totalCandidates = candidates.length;

  const shortlisted = candidates.filter(
    (item) => item.shortlisted
  ).length;

  const rejected = totalCandidates - shortlisted;

  const averageScore =
    totalCandidates > 0
      ? Math.round(
          candidates.reduce(
            (acc, item) => acc + item.ats_score,
            0
          ) / totalCandidates
        )
      : 0;

  const scoreDistribution = {
    excellent: candidates.filter((c) => c.ats_score >= 80).length,
    moderate: candidates.filter(
      (c) => c.ats_score >= 60 && c.ats_score < 80
    ).length,
    low: candidates.filter((c) => c.ats_score < 60).length,
  };

  return (
    <div className="h-screen z-[10] mx-2">

      <div className="bg-slate-200 rounded-2xl min-h-[120px] p-2">

        {/* HEADER */}
        <div className="flex flex-row gap-2 justify-between items-center mx-2">

          <div className="flex flex-row gap-2 items-center">
            <p className="font-semibold my-2">
              ATS Analytics
            </p>
          </div>

          <p className="text-sm">
            Total Candidates:{" "}
            <span className="font-medium">
              {totalCandidates}
            </span>
          </p>
        </div>

        <p className="my-3 ml-2 text-sm">
          Overview of candidate ATS performance and
          shortlist statistics
        </p>

        <div className="flex flex-row gap-1 my-2 justify-center">

 
  <div className="flex flex-col">

    
    <div className="flex flex-col gap-1 my-2 mt-4 mx-2 p-3 rounded-2xl bg-slate-50 shadow-md w-[260px] h-[130px]">

      <div className="flex flex-row items-center justify-center gap-1 font-semibold mb-1 text-[15px]">
        Average ATS Score
        <InfoTooltip content="Average ATS score across all resumes" />
      </div>

      <div className="flex items-center justify-center flex-1">
        <p className="text-2xl font-semibold text-indigo-600 w-fit p-1 px-2 bg-indigo-100 rounded-md">
          {averageScore}
        </p>
      </div>
    </div>

    
    <div className="flex flex-col items-center justify-center gap-1 mx-2 p-3 rounded-2xl bg-slate-50 shadow-md w-[260px] h-[130px]">

      <div className="flex flex-row gap-1 font-semibold mb-1 text-[15px] mx-auto text-center">
        Shortlist Rate
        <InfoTooltip content="Percentage of shortlisted candidates" />
      </div>

      <p className="w-fit text-2xl font-semibold text-indigo-600 p-1 px-2 bg-indigo-100 rounded-md">
        {totalCandidates > 0
          ? Math.round((shortlisted / totalCandidates) * 100)
          : 0}
        %
      </p>
    </div>
  </div>

  
  <div className="flex flex-col gap-1 my-2 mt-4 mx-2 p-4 rounded-2xl bg-slate-50 shadow-md max-w-[360px]">

    <div className="flex flex-row gap-2 text-[15px] font-bold mb-3 mx-auto">
      ATS Score Distribution
      <InfoTooltip content="Distribution of ATS scores" />
    </div>

    <PieChart
      sx={{
        "& .MuiChartsLegend-series text": {
          fontSize: "0.8rem !important",
        },
      }}
      series={[
        {
          data: [
            {
              id: 0,
              value: scoreDistribution.excellent,
              label: `80-100 (${scoreDistribution.excellent})`,
              color: "#22c55e",
            },
            {
              id: 1,
              value: scoreDistribution.moderate,
              label: `60-79 (${scoreDistribution.moderate})`,
              color: "#eab308",
            },
            {
              id: 2,
              value: scoreDistribution.low,
              label: `0-59 (${scoreDistribution.low})`,
              color: "#eb4444",
            },
          ],
          highlightScope: {
            faded: "global",
            highlighted: "item",
          },
          faded: {
            innerRadius: 10,
            additionalRadius: -10,
            color: "gray",
          },
        },
      ]}
      width={360}
      height={120}
    />
  </div>

  
  <div className="flex flex-col gap-1 my-2 mt-4 mx-2 p-4 rounded-2xl bg-slate-50 shadow-md">

    <div className="flex flex-row gap-2 text-[15px] font-bold mx-auto mb-1">
      <UserCircleIcon />
      Candidate Status
      <InfoTooltip content="Breakdown of shortlisted vs rejected candidates" />
    </div>

    <div className="text-sm text-center mb-1">
      Total Candidates: {totalCandidates}
    </div>

    <PieChart
      sx={{
        "& .MuiChartsLegend-series text": {
          fontSize: "0.8rem !important",
        },
      }}
      series={[
        {
          data: [
            {
              id: 0,
              value: shortlisted,
              label: `Shortlisted (${shortlisted})`,
              color: "#22c55e",
            },
            {
              id: 1,
              value: rejected,
              label: `Rejected (${rejected})`,
              color: "#eb4444",
            },
          ],
          highlightScope: {
            faded: "global",
            highlighted: "item",
          },
          faded: {
            innerRadius: 10,
            additionalRadius: -10,
            color: "gray",
          },
        },
      ]}
      width={360}
      height={120}
      slotProps={{
        legend: {
          direction: "column",
          position: {
            vertical: "middle",
            horizontal: "right",
          },
          padding: 0,
          itemMarkWidth: 10,
          itemMarkHeight: 10,
          markGap: 5,
          itemGap: 5,
        },
      }}
    />
  </div>
</div>

        {/* TABLE */}
        <div className="flex flex-col gap-1 my-2 mt-4 mx-2 p-4 rounded-2xl bg-slate-50 shadow-md">

          <p className="font-semibold mb-3">
            Candidate ATS Results
          </p>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Email
                  </th>

                  <th className="text-left py-3">
                     Role
                  </th>

                  <th className="text-left py-3">
                    ATS Score
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate, index) => (
                  <tr
                    key={index}
                    className="border-b"
                  >
                    <td className="py-4">
                      {candidate.email}
                    </td>

                    <td className="py-4">
                      {candidate.role}
                    </td>

                    <td className="py-4">
                      {candidate.ats_score}
                    </td>

                    <td className="py-4">
                      {candidate.shortlisted ? (
                        <span className="text-green-600 font-medium">
                          Shortlisted
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
