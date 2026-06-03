"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AreaMetricChart({ data, dataKey, color }: { data: Array<Record<string, string | number>>; dataKey: string; color: string }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
        Data grafik belum tersedia
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.18} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProfitTrendChart({ data }: { data: Array<Record<string, string | number>> }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
        Data profit belum tersedia
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} />
        <Line type="monotone" dataKey="profit" stroke="#0f172a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data, dataKey }: { data: Array<Record<string, string | number>>; dataKey: string }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
        Data belum tersedia
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#10b981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
