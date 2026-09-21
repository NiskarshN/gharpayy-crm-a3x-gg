import { useEffect, useState } from "react";
import { GraduationCap, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Capture } from "./Capture";
import { BatchBoard } from "./BatchBoard";
import { Board } from "./Board";
import { Workspace } from "./Workspace";
import { useBookingFlow } from "./store";

type Screen = "CAPTURE" | "BATCH" | "BOARD" | "LEAD";

export function BookingFlow() {
  const { mode, setMode, leads, batches, me, round } = useBookingFlow();

  const [screen, setScreen] = useState<Screen>("CAPTURE");
  const [leadId, setLeadId] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const lead = leads.find((l) => l.id === leadId);

  function openNextUnmarked() {
    const batch = batches.find((b) => b.handler === me && b.round === round);

    const next = batch?.leadIds
      .map((id) => leads.find((l) => l.id === id))
      .find((l) => l && !l.owner);

    const fallback = leads.find((l) => !l.owner) ?? leads[0];
    const pick = next ?? fallback;

    if (pick) {
      setLeadId(pick.id);
      setScreen("LEAD");
    } else {
      setScreen("BOARD");
    }
  }

  const totalLeads = leads.length;
  const assignedLeads = leads.filter((l) => l.owner).length;
  const pendingLeads = leads.filter((l) => !l.owner).length;
  const completion = totalLeads
    ? Math.round((assignedLeads / totalLeads) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">🏠 Gharpayy Booking Flow CRM</h1>
          <p className="text-sm text-muted-foreground">
            WhatsApp Screenshot → CRM → Batch Assignment → Lead Workspace
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "GUIDED" ? "default" : "outline"}
            onClick={() => setMode("GUIDED")}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Guided Mode
          </Button>

          <Button
            size="sm"
            variant={mode === "EXPERT" ? "default" : "outline"}
            onClick={() => setMode("EXPERT")}
          >
            <Zap className="mr-2 h-4 w-4" />
            Expert Mode
          </Button>
        </div>
      </div>

      {/* ================= DASHBOARD KPI CARDS ================= */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-blue-100 p-4 shadow-sm">
          <p className="text-xs text-blue-700">Total Leads</p>
          <h2 className="text-3xl font-bold text-blue-900">{totalLeads}</h2>
        </div>

        <div className="rounded-xl bg-yellow-100 p-4 shadow-sm">
          <p className="text-xs text-yellow-700">Pending Leads</p>
          <h2 className="text-3xl font-bold text-yellow-900">{pendingLeads}</h2>
        </div>

        <div className="rounded-xl bg-green-100 p-4 shadow-sm">
          <p className="text-xs text-green-700">Assigned Leads</p>
          <h2 className="text-3xl font-bold text-green-900">{assignedLeads}</h2>
        </div>

        <div className="rounded-xl bg-purple-100 p-4 shadow-sm">
          <p className="text-xs text-purple-700">Completion</p>
          <h2 className="text-3xl font-bold text-purple-900">{completion}%</h2>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-2 flex justify-between text-sm font-medium">
          <span>Lead Assignment Progress</span>
          <span>{completion}%</span>
        </div>

        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-green-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* ================= SCREEN TABS ================= */}
      <div className="flex flex-wrap gap-2">
        {(["CAPTURE", "BATCH", "BOARD", "LEAD"] as Screen[]).map((s, i) => (
          <Button
            key={s}
            size="sm"
            variant={screen === s ? "default" : "outline"}
            onClick={() =>
              s === "LEAD" ? openNextUnmarked() : setScreen(s)
            }
          >
            {i + 1}. {s}
          </Button>
        ))}

        {mounted && (
          <Badge variant="outline" className="ml-auto text-[10px]">
            {mode} MODE • Round {round}
          </Badge>
        )}
      </div>

      {/* ================= CRM MODULES ================= */}
      {screen === "CAPTURE" && (
        <Capture onDone={() => setScreen("BATCH")} />
      )}

      {screen === "BATCH" && (
        <BatchBoard
          onOpenLead={(id) => {
            setLeadId(id);
            setScreen("LEAD");
          }}
        />
      )}

      {screen === "BOARD" && (
        <Board
          onOpenLead={(id) => {
            setLeadId(id);
            setScreen("LEAD");
          }}
        />
      )}

      {screen === "LEAD" && lead ? (
        <Workspace
          lead={lead}
          onBack={() => setScreen("BOARD")}
          onNext={openNextUnmarked}
        />
      ) : (
        screen === "LEAD" && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No lead selected. Open a lead from Batch or Board.
          </div>
        )
      )}
    </div>
  );
}