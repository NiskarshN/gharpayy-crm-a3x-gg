// src/bookingflow/Board.tsx

import { useMemo, useState } from "react";
import { AlertTriangle, Search, ShieldAlert } from "lucide-react";

import { ContactActions } from "@/components/common/ContactActions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { health } from "./engine";
import { GROUPS } from "./journey";
import { useBookingFlow } from "./store";
import { useHydrated } from "./useHydrated";

type Filter =
  | "ALL"
  | "MINE"
  | "NO_OWNER"
  | "NO_NEXT"
  | "LATE"
  | "TOWER"
  | "STUCK"
  | "DONE";

const FILTERS = [
  { key: "ALL", label: "All Leads" },
  { key: "MINE", label: "My Leads" },
  { key: "NO_OWNER", label: "Unassigned" },
  { key: "NO_NEXT", label: "No Follow-up" },
  { key: "LATE", label: "Overdue" },
  { key: "TOWER", label: "Site Visit" },
  { key: "STUCK", label: "Negotiation" },
  { key: "DONE", label: "Closed Won" },
];

export function Board({
  onOpenLead,
}: {
  onOpenLead: (id: string) => void;
}) {
  const { leads, me } = useBookingFlow();
  const hydrated = useHydrated();

  const [filter, setFilter] = useState<Filter>("ALL");
  const [group, setGroup] = useState("ALL");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    if (!hydrated) return [];

    return leads
      .map((l) => ({ l, h: health(l) }))
      .filter(({ l, h }) => {
        if (group !== "ALL" && l.step?.group !== group) return false;

        if (
          q &&
          !`${l.name} ${l.phone} ${l.owner ?? ""}`
            .toLowerCase()
            .includes(q.toLowerCase())
        ) {
          return false;
        }

        switch (filter) {
          case "MINE":
            return l.owner === me;

          case "NO_OWNER":
            return !l.owner;

          case "NO_NEXT":
            return !l.nextAction || !l.nextActionAt;

          case "LATE":
            return h.sla === "LATE";

          case "STUCK":
            return h.signals.some((s: string) =>
              s.startsWith("No movement")
            );

          case "TOWER":
            return h.toTower;

          case "DONE":
            return h.complete;

          default:
            return true;
        }
      })
      .sort(
        (a, b) =>
          b.h.signals.length - a.h.signals.length ||
          a.h.stepNo - b.h.stepNo
      );
  }, [leads, filter, group, q, me, hydrated]);

  const counts = useMemo(() => {
    if (!hydrated) {
      return {
        total: 0,
        noOwner: 0,
        noNext: 0,
        late: 0,
        tower: 0,
        done: 0,
      };
    }

    const hs = leads.map((l) => ({ l, h: health(l) }));

    return {
      total: hs.length,
      noOwner: hs.filter((x) => !x.l.owner).length,
      noNext: hs.filter(
        (x) => !x.l.nextAction || !x.l.nextActionAt
      ).length,
      late: hs.filter((x) => x.h.sla === "LATE").length,
      tower: hs.filter((x) => x.h.toTower).length,
      done: hs.filter((x) => x.h.complete).length,
    };
  }, [leads, hydrated]);

  return (
    <div className="space-y-4 p-3">

      {/* Dashboard Stats */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Stat label="Customers" value={counts.total} />
        <Stat label="No owner" value={counts.noOwner} bad />
        <Stat label="No next step" value={counts.noNext} bad />
        <Stat label="Past deadline" value={counts.late} bad />
        <Stat label="Control Tower" value={counts.tower} bad />
        <Stat label="Checked in" value={counts.done} />
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            onClick={() => setFilter(f.key as Filter)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Search */}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search customer, phone or owner..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Journey Filter */}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={group === "ALL" ? "default" : "outline"}
          onClick={() => setGroup("ALL")}
        >
          All Stages
        </Button>

        {GROUPS.map((g) => (
          <Button
            key={g}
            size="sm"
            variant={group === g ? "default" : "outline"}
            onClick={() => setGroup(g)}
          >
            {g}
          </Button>
        ))}
      </div>

      {/* Customer Cards */}

      <div className="space-y-3">
        {rows.map(({ l, h }) => (
          <Card
            key={l.id}
            className="p-4 cursor-pointer hover:border-blue-500 transition"
            onClick={() => onOpenLead(l.id)}
          >
            <div className="flex justify-between items-start gap-3">

              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{l.name}</h3>

                <p className="text-sm text-muted-foreground">
                  📞 {l.phone}
                </p>

                <p className="text-sm text-muted-foreground">
                  Owner : {l.owner || "Not Assigned"}
                </p>
              </div>

              <ContactActions phone={l.phone} name={l.name} />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">

              <Badge variant="outline">
                Step {h.stepNo}
              </Badge>

              <Badge variant="secondary">
                {l.step?.label ?? "No Stage"}
              </Badge>

              {!l.owner && (
                <Badge variant="destructive">
                  No Owner
                </Badge>
              )}

              {h.sla === "LATE" && (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}

              {h.toTower && (
                <Badge variant="destructive">
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  Control Tower
                </Badge>
              )}

              {h.complete && (
                <Badge className="bg-green-600 text-white">
                  Closed Won
                </Badge>
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="font-medium">
                  Next Step
                </span>

                <span>{l.nextAction || "--"}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Deadline
                </span>

                <span>
                  {l.nextActionAt
                    ? new Date(
                        l.nextActionAt
                      ).toLocaleString()
                    : "--"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Waiting
                </span>

                <span>{h.waitingOn}</span>
              </div>

              {h.signals.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {h.signals.map((signal: string) => (
                    <Badge
                      key={signal}
                      variant="destructive"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {signal}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="mt-4 w-full"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLead(l.id);
              }}
            >
              Open Lead
            </Button>
          </Card>
        ))}
      </div>

      {hydrated && rows.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          No customer matches the current filters.
        </Card>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  bad,
}: {
  label: string;
  value: number;
  bad?: boolean;
}) {
  return (
    <Card className="p-3">
      <p className="text-xs uppercase text-muted-foreground">
        {label}
      </p>

      <p
        className={`text-2xl font-bold ${
          bad && value > 0
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}