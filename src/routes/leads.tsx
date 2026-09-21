import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  Calendar,
  Plus,
  Flame,
  Filter,
  Users,
  IndianRupee,
  MapPin,
  User,
  Star,
  Clock,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ClientOnly } from "@/components/ClientOnly";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/leads")({
  component: () => (
    <AppShell>
      <ClientOnly fallback={<div className="p-6">Loading Leads...</div>}>
        <LeadsCRM />
      </ClientOnly>
    </AppShell>
  ),
});

type Stage =
  | "New Lead"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Booked"
  | "Dropped";

type Priority = "Hot" | "Warm" | "Cold";

interface Lead {
  id: number;
  name: string;
  phone: string;
  area: string;
  budget: string;
  owner: string;
  stage: Stage;
  score: number;
  priority: Priority;
  followUp: string;
  notes: string;
}

const DEMO_LEADS: Lead[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    area: "HSR Layout",
    budget: "₹18,000",
    owner: "Neha Verma",
    stage: "Qualified",
    score: 91,
    priority: "Hot",
    followUp: "2026-09-23",
    notes: "Interested in 2BHK near Metro station.",
  },
  {
    id: 2,
    name: "Kavya Reddy",
    phone: "9012345678",
    area: "Koramangala",
    budget: "₹15,000",
    owner: "Rohan Iyer",
    stage: "Site Visit",
    score: 84,
    priority: "Hot",
    followUp: "2026-09-22",
    notes: "Site visit scheduled tomorrow evening.",
  },
  {
    id: 3,
    name: "Amit Singh",
    phone: "9123456789",
    area: "Whitefield",
    budget: "₹22,000",
    owner: "Kunal Singh",
    stage: "Negotiation",
    score: 72,
    priority: "Warm",
    followUp: "2026-09-24",
    notes: "Negotiating security deposit.",
  },
  {
    id: 4,
    name: "Priya Das",
    phone: "9988776655",
    area: "Indiranagar",
    budget: "₹20,000",
    owner: "Neha Verma",
    stage: "Booked",
    score: 98,
    priority: "Hot",
    followUp: "2026-09-28",
    notes: "Advance payment received.",
  },
  {
    id: 5,
    name: "Sahil Reddy",
    phone: "9090909090",
    area: "Marathahalli",
    budget: "₹14,000",
    owner: "Rohan Iyer",
    stage: "New Lead",
    score: 56,
    priority: "Cold",
    followUp: "2026-09-25",
    notes: "First call pending.",
  },
  {
    id: 6,
    name: "Sneha Kapoor",
    phone: "8800112233",
    area: "Bellandur",
    budget: "₹25,000",
    owner: "Kunal Singh",
    stage: "Qualified",
    score: 80,
    priority: "Warm",
    followUp: "2026-09-24",
    notes: "Needs furnished apartment.",
  },
];

function LeadsCRM() {
  const [leads, setLeads] = useState(DEMO_LEADS);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    area: "",
    budget: "",
    owner: "Neha Verma",
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchMatch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        lead.area.toLowerCase().includes(search.toLowerCase());

      const stageMatch =
        stageFilter === "All" || lead.stage === stageFilter;

      const priorityMatch =
        priorityFilter === "All" ||
        lead.priority === priorityFilter;

      return searchMatch && stageMatch && priorityMatch;
    });
  }, [search, stageFilter, priorityFilter, leads]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter((l) => l.priority === "Hot").length,
      booked: leads.filter((l) => l.stage === "Booked").length,
      qualified: leads.filter((l) => l.stage === "Qualified").length,
      revenue: "₹5.42 Lakh",
    };
  }, [leads]);

  function addLead() {
    if (!newLead.name || !newLead.phone) return;

    setLeads((prev) => [
      {
        id: Date.now(),
        ...newLead,
        stage: "New Lead",
        score: 55,
        priority: "Cold",
        followUp: new Date().toISOString().slice(0, 10),
        notes: "",
      },
      ...prev,
    ]);

    setNewLead({
      name: "",
      phone: "",
      area: "",
      budget: "",
      owner: "Neha Verma",
    });
  }

  function updateStage(id: number, stage: Stage) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, stage } : lead
      )
    );
  }

  function updateFollowUp(id: number, date: string) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, followUp: date } : lead
      )
    );
  }

  function updateNotes(id: number, notes: string) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, notes } : lead
      )
    );
  }

  function badgeColor(priority: Priority) {
    switch (priority) {
      case "Hot":
        return "bg-red-100 text-red-600";
      case "Warm":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  function whatsapp(name: string) {
    return `Hi ${name},

Thank you for choosing Gharpayy.

Your property enquiry has been received successfully.

Our Relationship Manager will connect with you shortly.

Regards,
Gharpayy Team`;
  }

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orange-600">
            Gharpayy Lead Management CRM
          </h1>

          <p className="text-sm text-muted-foreground">
            M-POWER CALL • AI Lead Score • WhatsApp CRM • Follow-up Scheduler
          </p>
        </div>

        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        <Card className="p-5 bg-blue-50">
          <Users className="text-blue-600 mb-2" />
          <p className="text-xs text-muted-foreground uppercase">
            Total Leads
          </p>
          <h2 className="text-3xl font-bold">{stats.total}</h2>
        </Card>

        <Card className="p-5 bg-red-50">
          <Flame className="text-red-600 mb-2" />
          <p className="text-xs text-muted-foreground uppercase">
            Hot Leads
          </p>
          <h2 className="text-3xl font-bold">{stats.hot}</h2>
        </Card>

        <Card className="p-5 bg-green-50">
          <Calendar className="text-green-600 mb-2" />
          <p className="text-xs text-muted-foreground uppercase">
            Qualified
          </p>
          <h2 className="text-3xl font-bold">{stats.qualified}</h2>
        </Card>

        <Card className="p-5 bg-orange-50">
          <Star className="text-orange-600 mb-2" />
          <p className="text-xs text-muted-foreground uppercase">
            Bookings
          </p>
          <h2 className="text-3xl font-bold">{stats.booked}</h2>
        </Card>

        <Card className="p-5 bg-purple-50">
          <IndianRupee className="text-purple-600 mb-2" />
          <p className="text-xs text-muted-foreground uppercase">
            Revenue
          </p>
          <h2 className="text-2xl font-bold">{stats.revenue}</h2>
        </Card>

      </div>

      {/* SEARCH + FILTERS */}

      <Card className="p-4 space-y-4">

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold">Search & Filters</h3>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-10"
              placeholder="Search Name / Phone / Area"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="rounded-lg border p-2"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option>All</option>
            <option>New Lead</option>
            <option>Qualified</option>
            <option>Site Visit</option>
            <option>Negotiation</option>
            <option>Booked</option>
            <option>Dropped</option>
          </select>

          <select
            className="rounded-lg border p-2"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All</option>
            <option>Hot</option>
            <option>Warm</option>
            <option>Cold</option>
          </select>

        </div>

      </Card>

      {/* ADD LEAD FORM */}

      <Card className="p-5 space-y-4">

        <h2 className="text-lg font-semibold">
          ➕ Add New Customer Lead
        </h2>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">

          <Input
            placeholder="Customer Name"
            value={newLead.name}
            onChange={(e) =>
              setNewLead({ ...newLead, name: e.target.value })
            }
          />

          <Input
            placeholder="Phone Number"
            value={newLead.phone}
            onChange={(e) =>
              setNewLead({ ...newLead, phone: e.target.value })
            }
          />

          <Input
            placeholder="Area"
            value={newLead.area}
            onChange={(e) =>
              setNewLead({ ...newLead, area: e.target.value })
            }
          />

          <Input
            placeholder="Budget"
            value={newLead.budget}
            onChange={(e) =>
              setNewLead({ ...newLead, budget: e.target.value })
            }
          />

          <select
            className="rounded-lg border p-2"
            value={newLead.owner}
            onChange={(e) =>
              setNewLead({ ...newLead, owner: e.target.value })
            }
          >
            <option>Neha Verma</option>
            <option>Rohan Iyer</option>
            <option>Kunal Singh</option>
          </select>

        </div>

        <Button onClick={addLead} className="bg-orange-600">
          Add Lead to CRM
        </Button>

      </Card>

      {/* LEAD CARDS START HERE */}
      <div className="grid gap-5 lg:grid-cols-2">
                {filteredLeads.map((lead) => (
          <Card key={lead.id} className="p-5 space-y-4 shadow-md">

            {/* Customer Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{lead.name}</h2>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Phone className="h-4 w-4" />
                  {lead.phone}
                </div>

                <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  {lead.area}
                </div>
              </div>

              <Badge className={badgeColor(lead.priority)}>
                {lead.priority} • {lead.score}/100
              </Badge>
            </div>

            {/* Budget + Owner */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-muted-foreground">Budget</p>
                <h3 className="font-semibold">{lead.budget}</h3>
              </div>

              <div className="rounded-lg bg-slate-100 p-3">
                <p className="text-xs text-muted-foreground">Owner</p>

                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">{lead.owner}</span>
                </div>
              </div>
            </div>

            {/* Stage */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Lead Stage
              </label>

              <select
                value={lead.stage}
                onChange={(e) =>
                  updateStage(lead.id, e.target.value as Stage)
                }
                className="w-full rounded-lg border p-2"
              >
                <option>New Lead</option>
                <option>Qualified</option>
                <option>Site Visit</option>
                <option>Negotiation</option>
                <option>Booked</option>
                <option>Dropped</option>
              </select>
            </div>

            {/* AI Lead Score */}
            <Card className="border-red-200 bg-red-50 p-4 space-y-3">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="text-red-600" />
                  <span className="font-semibold">AI Lead Score</span>
                </div>

                <span className="font-bold text-red-600">
                  {lead.score}/100
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-red-100">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{ width: `${lead.score}%` }}
                />
              </div>

              <p className="text-sm font-medium">
                {lead.priority === "Hot"
                  ? "🔥 High Booking Probability"
                  : lead.priority === "Warm"
                  ? "🟡 Medium Booking Probability"
                  : "🔵 Low Booking Probability"}
              </p>

              <div className="rounded-lg bg-white p-3 text-sm border">
                <p className="font-semibold mb-2">AI Recommendation</p>

                <ul className="list-disc ml-5 space-y-1">
                  <li>Call customer within 30 minutes.</li>
                  <li>Share matching property options.</li>
                  <li>Schedule site visit immediately.</li>
                  <li>Send WhatsApp follow-up after call.</li>
                </ul>
              </div>

            </Card>

            {/* Follow-up Scheduler */}
            <Card className="p-4 space-y-3">

              <div className="flex items-center gap-2">
                <Clock className="text-orange-600" />
                <h3 className="font-semibold">
                  Follow-up Scheduler
                </h3>
              </div>

              <input
                type="date"
                value={lead.followUp}
                onChange={(e) =>
                  updateFollowUp(lead.id, e.target.value)
                }
                className="w-full rounded-lg border p-2"
              />

              <div className="grid grid-cols-3 gap-2">

                <Button size="sm" variant="outline">
                  +30 mins
                </Button>

                <Button size="sm" variant="outline">
                  Today 7 PM
                </Button>

                <Button size="sm" variant="outline">
                  Tomorrow
                </Button>

              </div>

            </Card>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Conversation Notes
              </label>

              <textarea
                rows={3}
                value={lead.notes}
                onChange={(e) =>
                  updateNotes(lead.id, e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* M-POWER CALL */}
            <Card className="p-4 space-y-3 bg-green-50 border-green-200">

              <h3 className="font-semibold text-green-700">
                📞 M-POWER CALL
              </h3>

              <div className="grid grid-cols-2 gap-3">

                <Button className="bg-green-600 hover:bg-green-700">
                  Connected
                </Button>

                <Button variant="outline">
                  Busy
                </Button>

                <Button variant="outline">
                  No Answer
                </Button>

                <Button variant="outline">
                  Wrong Number
                </Button>

                <Button variant="outline">
                  Rejected
                </Button>

                <Button variant="outline">
                  Call Later
                </Button>

              </div>

            </Card>

            {/* WhatsApp Generator */}
            <Card className="p-4 bg-emerald-50 border-emerald-200 space-y-3">

              <div className="flex items-center gap-2">
                <MessageCircle className="text-green-600" />
                <h3 className="font-semibold">
                  WhatsApp Follow-up Generator
                </h3>
              </div>

              <textarea
                rows={5}
                readOnly
                className="w-full rounded-lg border p-3 bg-white"
                value={whatsapp(lead.name)}
              />

              <div className="grid grid-cols-2 gap-3">

                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      whatsapp(lead.name)
                    )
                  }
                >
                  Copy Message
                </Button>

                <Button variant="outline">
                  Share Property PDF
                </Button>

              </div>

            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">

              <Button className="bg-orange-600 hover:bg-orange-700">
                Schedule Site Visit
              </Button>

              <Button variant="outline">
                Mark as Booked
              </Button>

            </div>

          </Card>
        ))}
      </div>

      {/* Team Performance */}
      <Card className="p-6 space-y-5">

        <h2 className="text-xl font-bold">
          Team Performance Summary
        </h2>

        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="py-2 text-left">Owner</th>
              <th className="text-left">Leads</th>
              <th className="text-left">Hot</th>
              <th className="text-left">Booked</th>
            </tr>
          </thead>

          <tbody>
            {["Neha Verma", "Rohan Iyer", "Kunal Singh"].map(
              (owner) => {
                const ownerLeads = leads.filter(
                  (l) => l.owner === owner
                );

                return (
                  <tr key={owner} className="border-b">
                    <td className="py-3 font-medium">{owner}</td>

                    <td>{ownerLeads.length}</td>

                    <td>
                      {
                        ownerLeads.filter(
                          (l) => l.priority === "Hot"
                        ).length
                      }
                    </td>

                    <td>
                      {
                        ownerLeads.filter(
                          (l) => l.stage === "Booked"
                        ).length
                      }
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>

      </Card>

      {/* AI CRM Insights */}
      <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white space-y-4">

        <h2 className="text-2xl font-bold">
          AI CRM Insights
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-lg bg-white/20 p-4">
            <p className="text-sm opacity-80">
              Best Performing Area
            </p>

            <h3 className="text-xl font-bold mt-2">
              HSR Layout
            </h3>

            <p className="text-sm mt-2">
              Highest booking conversion this week.
            </p>
          </div>

          <div className="rounded-lg bg-white/20 p-4">
            <p className="text-sm opacity-80">
              Highest AI Lead Score
            </p>

            <h3 className="text-xl font-bold mt-2">
              Rahul Sharma • 91/100
            </h3>

            <p className="text-sm mt-2">
              Prioritize immediate follow-up.
            </p>
          </div>

          <div className="rounded-lg bg-white/20 p-4">
            <p className="text-sm opacity-80">
              Today's AI Recommendation
            </p>

            <ul className="mt-2 list-disc ml-5 text-sm space-y-1">
              <li>Call all Hot Leads within 30 minutes.</li>
              <li>Send quotation after Site Visit.</li>
              <li>Schedule tomorrow's follow-ups tonight.</li>
            </ul>
          </div>

          <div className="rounded-lg bg-white/20 p-4">
            <p className="text-sm opacity-80">
              Predicted Booking Revenue
            </p>

            <h3 className="text-xl font-bold mt-2">
              ₹8.75 Lakh
            </h3>

            <p className="text-sm mt-2">
              Based on current pipeline probability.
            </p>
          </div>

        </div>

      </Card>

      {/* Footer */}
      <div className="py-6 text-center text-sm text-muted-foreground">
        Gharpayy CRM MVP • Lead Management • AI Lead Score • WhatsApp Generator • M-POWER CALL
      </div>

    </div>
  );
}