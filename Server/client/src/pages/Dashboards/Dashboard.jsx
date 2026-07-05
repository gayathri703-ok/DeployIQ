import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout, { TopBar } from "../../layouts/Dashboardlayouts";
import useProjectStore from "../../store/projectStore";

import {
  StatCard,
  Card,
  CardHeader,
  Badge,
  Button,
  Skeleton,
} from "../../components/ui";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatDistanceToNow } from "date-fns";

const CHART_DATA = [
  { d: "5", builds: 3, errors: 0 },
  { d: "6", builds: 5, errors: 1 },
  { d: "7", builds: 2, errors: 0 },
  { d: "8", builds: 8, errors: 2 },
  { d: "9", builds: 6, errors: 0 },
  { d: "10", builds: 4, errors: 1 },
  { d: "11", builds: 9, errors: 0 },
  { d: "12", builds: 7, errors: 0 },
  { d: "13", builds: 5, errors: 1 },
  { d: "14", builds: 11, errors: 0 },
  { d: "15", builds: 4, errors: 2 },
  { d: "16", builds: 6, errors: 0 },
  { d: "17", builds: 8, errors: 0 },
  { d: "18", builds: 3, errors: 1 },
];

const MOCK_DEPLOYS = [
  {
    _id: "1",
    projectId: "6a1bd69b495a852d708b9494",
    projectName: "frontend-v2",
    branch: "main",
    commitHash: "a3f9c12",
    status: "failed",
    createdAt: new Date(Date.now() - 12 * 60000),
  },
  {
    _id: "2",
    projectId: "6a1bd69b495a852d708b9494",
    projectName: "api-service",
    branch: "feat/auth",
    commitHash: "b21e4f8",
    status: "building",
    createdAt: new Date(Date.now() - 2 * 60000),
  },
  {
    _id: "3",
    projectId: "6a1bd69b495a852d708b9494",
    projectName: "dashboard-ui",
    branch: "main",
    commitHash: "cc29d01",
    status: "live",
    createdAt: new Date(Date.now() - 3600000),
  },
];

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface2 border border-border rounded-xl px-3 py-2 text-xs">
      <div className="mb-1">May {label}</div>

      {payload.map((p) => (
        <div key={p.name}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    projects,
    fetchProjects,
    loading,
  } = useProjectStore();

  const [chartKey, setChartKey] = useState("builds");

  useEffect(() => {
    fetchProjects();
  }, []);

  const liveCount = MOCK_DEPLOYS.filter(
    (d) => d.status === "live"
  ).length;

  const failCount = MOCK_DEPLOYS.filter(
    (d) => d.status === "failed"
  ).length;

  return (
    <DashboardLayout>
      <TopBar
        title="Overview"
        subtitle="Welcome back — here's what's happening"
        actions={
          <Button
            size="sm"
            onClick={() =>
              navigate("/dashboard/projects")
            }
          >
            + New Deploy
          </Button>
        }
      />

      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-32"
                />
              ))
          ) : (
            <>
              <StatCard
                label="Total Projects"
                value={projects.length}
                sub="Projects"
                accent="accent"
                icon="📁"
              />

              <StatCard
                label="Live Deployments"
                value={liveCount}
                sub="Healthy"
                accent="green"
                icon="🟢"
              />

              <StatCard
                label="Failed Builds"
                value={failCount}
                sub="Need attention"
                accent="red"
                icon="❌"
              />

              <StatCard
                label="Avg Build Time"
                value="42s"
                sub="Fast"
                accent="cyan"
                icon="⚡"
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-5">

          <Card className="lg:col-span-3">

            <CardHeader
              title="Build Activity"
            />

            <div className="p-5 h-52">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={CHART_DATA}>
                  <XAxis dataKey="d" />
                  <Tooltip
                    content={<CustomTip />}
                  />
                  <Bar
                    dataKey={chartKey}
                    fill="#6366f1"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </Card>

          <Card className="lg:col-span-2">

            <CardHeader
              title="Recent Deployments"
            />

            <div className="divide-y divide-border">

              {MOCK_DEPLOYS.map((d) => (
                <div
                  key={d._id}
                  onClick={() =>
                    navigate(
                      `/dashboard/logs/${d.projectId}`
                    )
                  }
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {d.projectName}
                    </div>

                    <div className="text-xs">
                      {d.branch}@{d.commitHash}
                    </div>
                  </div>

                  <div>
                    <Badge status={d.status} />

                    <div className="text-xs mt-1">
                      {formatDistanceToNow(
                        d.createdAt,
                        { addSuffix: true }
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>

          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}