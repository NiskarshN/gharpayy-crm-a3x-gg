import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users,
  PhoneCall,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  Trophy,
  Search,
  Bell,
  MapPin,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ClientOnly } from "@/components/ClientOnly";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AppShell>
      <ClientOnly fallback={<div className="p-6">Loading Dashboard...</div>}>
        <AdminDashboard />
      </ClientOnly>
    </AppShell>
  ),
});

type Employee = {
  id: number;
  name: string;
  role: string;
  calls: number;
  tours: number;
  bookings: number;
  revenue: number;
};

const team: Employee[] = [
  { id: 1, name: "Neha Verma", role: "Relationship Manager", calls: 42, tours: 11, bookings: 4, revenue: 180000 },
  { id: 2, name: "Rohan Iyer", role: "Relationship Manager", calls: 36, tours: 8, bookings: 3, revenue: 150000 },
  { id: 3, name: "Kunal Singh", role: "Sales Executive", calls: 30, tours: 6, bookings: 1, revenue: 70000 },
  { id: 4, name: "Aditi Rao", role: "Flow Ops", calls: 28, tours: 5, bookings: 2, revenue: 95000 },
];

const zoneStats = [
  { zone: "HSR Layout", leads: 36, bookings: 12, color: "bg-green-500" },
  { zone: "Koramangala", leads: 28, bookings: 8, color: "bg-blue-500" },
  { zone: "Whitefield", leads: 32, bookings: 6, color: "bg-purple-500" },
  { zone: "Indiranagar", leads: 27, bookings: 4, color: "bg-pink-500" },
];

const dailyCalls = [
  { day: "Mon", calls: 38 },
  { day: "Tue", calls: 44 },
  { day: "Wed", calls: 56 },
  { day: "Thu", calls: 48 },
  { day: "Fri", calls: 63 },
  { day: "Sat", calls: 71 },
];

function AdminDashboard() {
  const [search, setSearch] = useState("");

  const filteredTeam = useMemo(() => {
    return team.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totals = useMemo(() => {
    return {
      calls: team.reduce((a, b) => a + b.calls, 0),
      tours: team.reduce((a, b) => a + b.tours, 0),
      bookings: team.reduce((a, b) => a + b.bookings, 0),
      revenue: team.reduce((a, b) => a + b.revenue, 0),
    };
  }, []);

  return (
    <div className="space-y-6 p-6 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-orange-600">
            Founder Dashboard
          </h1>
          <p className="text-gray-500">
            Admin Movement Control • Live CRM Analytics
          </p>
        </div>

        <Button className="bg-orange-600 hover:bg-orange-700">
          Download Report
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card className="p-5 bg-blue-50">
          <Users className="text-blue-600 mb-2" size={28} />
          <p className="text-xs uppercase text-gray-500">Total Leads</p>
          <h2 className="text-3xl font-bold">123</h2>
          <p className="text-green-600 text-sm mt-2">+12 Today</p>
        </Card>

        <Card className="p-5 bg-green-50">
          <PhoneCall className="text-green-600 mb-2" size={28} />
          <p className="text-xs uppercase text-gray-500">Calls Completed</p>
          <h2 className="text-3xl font-bold">{totals.calls}</h2>
          <p className="text-green-600 text-sm mt-2">71% Connected</p>
        </Card>

        <Card className="p-5 bg-purple-50">
          <CalendarCheck className="text-purple-600 mb-2" size={28} />
          <p className="text-xs uppercase text-gray-500">Tours Scheduled</p>
          <h2 className="text-3xl font-bold">{totals.tours}</h2>
          <p className="text-purple-600 text-sm mt-2">17% Conversion</p>
        </Card>

        <Card className="p-5 bg-orange-50">
          <IndianRupee className="text-orange-600 mb-2" size={28} />
          <p className="text-xs uppercase text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold">
            ₹{(totals.revenue / 100000).toFixed(2)}L
          </h2>
          <p className="text-orange-600 text-sm mt-2">Monthly Revenue</p>
        </Card>

      </div>

      {/* SALES FUNNEL */}
      <Card className="p-6 space-y-5">
        <h2 className="text-xl font-bold">Sales Funnel Overview</h2>

        {[
          ["New Leads", 123, "bg-blue-500"],
          ["Qualified", 88, "bg-green-500"],
          ["Site Visits", 42, "bg-yellow-500"],
          ["Negotiation", 18, "bg-orange-500"],
          ["Booked", 10, "bg-red-500"],
        ].map(([label, value, color]) => (
          <div key={String(label)}>
            <div className="flex justify-between text-sm mb-2">
              <span>{label}</span>
              <span>{value}</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200">
              <div
                className={`${color} h-3 rounded-full`}
                style={{
                  width: `${(Number(value) / 123) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* SEARCH */}
      <Card className="p-4 flex items-center gap-3">
        <Search className="text-gray-400" />
        <Input
          placeholder="Search Team Member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* TEAM TABLE */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">
          Team Performance Leaderboard
        </h2>

        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr className="text-left">
              <th className="py-3">Employee</th>
              <th>Calls</th>
              <th>Tours</th>
              <th>Bookings</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeam.map((member) => (
              <tr key={member.id} className="border-b hover:bg-slate-50">
                <td className="py-4">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </td>

                <td>{member.calls}</td>
                <td>{member.tours}</td>
                <td>{member.bookings}</td>
                <td>₹{member.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* DAILY CALL PERFORMANCE */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-orange-600" />
          <h2 className="text-xl font-bold">Daily Call Performance</h2>
        </div>

        {dailyCalls.map((d) => (
          <div key={d.day}>
            <div className="flex justify-between mb-2 text-sm">
              <span>{d.day}</span>
              <span>{d.calls} Calls</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{ width: `${d.calls}%` }}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* ZONE ANALYTICS */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="text-orange-600" />
          <h2 className="text-xl font-bold">Zone Analytics</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {zoneStats.map((zone) => (
            <Card key={zone.zone} className="p-4 border">
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold">{zone.zone}</h3>
                <span className="text-sm text-gray-500">
                  {zone.bookings} Bookings
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${zone.color} h-3 rounded-full`}
                  style={{
                    width: `${(zone.bookings / zone.leads) * 100}%`,
                  }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-3">
                {zone.leads} Leads • Conversion{" "}
                {Math.round((zone.bookings / zone.leads) * 100)}%
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* TOP PERFORMER */}
      <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={34} />
          <div>
            <h2 className="text-2xl font-bold">
              Top Performer of the Week
            </h2>
            <p className="text-yellow-100">
              Highest booking conversion among Relationship Managers.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm">Employee</p>
            <h3 className="text-xl font-bold mt-2">Neha Verma</h3>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm">Calls</p>
            <h3 className="text-xl font-bold mt-2">42</h3>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm">Bookings</p>
            <h3 className="text-xl font-bold mt-2">4</h3>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm">Revenue</p>
            <h3 className="text-xl font-bold mt-2">₹1.8 Lakh</h3>
          </div>

        </div>
      </Card>

      {/* ALERT PANEL */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="text-red-600" />
          <h2 className="text-xl font-bold text-red-600">
            Founder Watchlist
          </h2>
        </div>

        {[
          "18 leads have no owner assigned.",
          "12 leads have overdue follow-up dates.",
          "8 customers completed site visits but quotation is pending.",
          "5 payment-intent customers have not completed booking.",
        ].map((alert) => (
          <div
            key={alert}
            className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-4"
          >
            {alert}
          </div>
        ))}
      </Card>

      {/* BOOKING TARGET */}
      <Card className="p-6 space-y-5">
        <h2 className="text-xl font-bold">
          Monthly Booking Mission
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            ["Target Bookings", "40"],
            ["Completed", "18"],
            ["Remaining", "22"],
            ["Achievement", "45%"],
          ].map(([title, value]) => (
            <Card key={String(title)} className="p-4 text-center">
              <p className="text-sm text-gray-500">{title}</p>
              <h3 className="text-3xl font-bold mt-2">{value}</h3>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Booking Progress</span>
            <span>45%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-green-600 h-4 rounded-full w-[45%]" />
          </div>
        </div>
      </Card>

      {/* AI INSIGHTS */}
      <Card className="p-6 bg-gradient-to-r from-purple-700 to-indigo-700 text-white space-y-5">

        <h2 className="text-2xl font-bold">
          AI Founder Insights
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <Card className="bg-white/10 border-white/20 p-4 text-white">
            <p className="text-sm opacity-80">Best Performing Area</p>
            <h3 className="text-xl font-bold mt-2">HSR Layout</h3>
            <p className="text-sm mt-2">
              33% booking conversion this week.
            </p>
          </Card>

          <Card className="bg-white/10 border-white/20 p-4 text-white">
            <p className="text-sm opacity-80">
              Highest Conversion Employee
            </p>
            <h3 className="text-xl font-bold mt-2">Neha Verma</h3>
            <p className="text-sm mt-2">
              4 bookings from 11 tours.
            </p>
          </Card>

          <Card className="bg-white/10 border-white/20 p-4 text-white">
            <p className="text-sm opacity-80">AI Recommendation</p>
            <ul className="mt-2 list-disc ml-5 text-sm space-y-1">
              <li>Prioritize Hot Leads above AI Score 85.</li>
              <li>Send quotation within 1 hour after site visit.</li>
              <li>Follow up missed calls within 2 hours.</li>
            </ul>
          </Card>

          <Card className="bg-white/10 border-white/20 p-4 text-white">
            <p className="text-sm opacity-80">Revenue Forecast</p>
            <h3 className="text-xl font-bold mt-2">₹8.75 Lakh</h3>
            <p className="text-sm mt-2">
              Projected monthly revenue from the current pipeline.
            </p>
          </Card>

        </div>

      </Card>

      {/* FOOTER */}
      <div className="text-center text-sm text-gray-500 py-6">
        Gharpayy CRM Founder Dashboard • Admin Movement Control • Live Analytics MVP
      </div>

    </div>
  );
}