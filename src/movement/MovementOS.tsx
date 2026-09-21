import { useEffect, useState } from "react";
import { Compass, Phone, MessageCircle, Calendar, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMovementSync } from "./bridge";
import { seedMovement } from "./seed";
import {
  ActiveList,
  Dashboards,
  DraftingPanel,
  JourneyTimeline,
  UnmatchedQueue,
  WorkPanel,
} from "./components";

export function MovementOS() {
  useEffect(() => {
    seedMovement();
  }, []);

  const { list, nameOf, me } = useMovementSync();
  const [selected, setSelected] = useState<string | null>(null);

  const [leadScore] = useState(87);

  const [whatsappMessage] = useState(`Hi Kavya,

Thank you for choosing Gharpayy.

Your property visit is scheduled. Please confirm your preferred time for the site visit.

Regards,
Gharpayy Team`);

  useEffect(() => {
    if (!selected && list.length) {
      setSelected(list[0].ulid);
    }
  }, [list, selected]);

  const scoreColor =
    leadScore >= 80
      ? "bg-red-500"
      : leadScore >= 60
      ? "bg-yellow-500"
      : "bg-blue-500";

  const scoreLabel =
    leadScore >= 80
      ? "HOT LEAD"
      : leadScore >= 60
      ? "WARM LEAD"
      : "COLD LEAD";

  const copyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    alert("WhatsApp message copied successfully!");
  };

  return (
    <div className="space-y-4 p-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Compass className="h-5 w-5 text-orange-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold">Customer Movement OS</h1>
          <p className="text-sm text-gray-500">
            One Journey • Draft → Priority → Live Work → Handoff → Outcome
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="work">

        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="drafting">Drafting</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboards</TabsTrigger>
          <TabsTrigger value="stream">Journey</TabsTrigger>
          <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
        </TabsList>

        {/* ================= WORK TAB ================= */}
        <TabsContent value="work" className="mt-4">

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">

            {/* Lead List */}
            <ActiveList
              list={list}
              meta={nameOf}
              selected={selected}
              onSelect={setSelected}
              meId={me.id}
            />

            <div className="space-y-4">

              {/* Existing Work Panel */}
              <WorkPanel ulid={selected} meta={nameOf} />

              {/* AI LEAD SCORE */}
              <div className="rounded-xl border shadow-sm p-5 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Star className="text-orange-500" size={20} />
                    AI Lead Score
                  </h2>

                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {scoreLabel}
                  </span>
                </div>

                <div className="text-4xl font-bold text-red-600 mb-3">
                  {leadScore}/100
                </div>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${scoreColor} h-4 rounded-full`}
                    style={{ width: `${leadScore}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 text-sm">

                  <div className="border rounded-lg p-3">
                    <p className="text-gray-500">Budget Match</p>
                    <h3 className="font-semibold text-green-600">95%</h3>
                  </div>

                  <div className="border rounded-lg p-3">
                    <p className="text-gray-500">Tour Probability</p>
                    <h3 className="font-semibold text-blue-600">88%</h3>
                  </div>

                  <div className="border rounded-lg p-3">
                    <p className="text-gray-500">Booking Probability</p>
                    <h3 className="font-semibold text-red-600">87%</h3>
                  </div>

                  <div className="border rounded-lg p-3">
                    <p className="text-gray-500">Priority</p>
                    <h3 className="font-semibold text-orange-600">P0</h3>
                  </div>

                </div>

                <div className="mt-4 rounded-lg bg-orange-50 p-3">
                  <p className="text-sm text-orange-700">
                    AI Recommendation:
                  </p>

                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Call within the next 30 minutes.</li>
                    <li>Customer is highly interested in HSR Layout.</li>
                    <li>Share property options immediately.</li>
                    <li>Schedule site visit today.</li>
                  </ul>
                </div>
              </div>

              {/* WhatsApp FOLLOW-UP GENERATOR */}
              <div className="rounded-xl border shadow-sm p-5 bg-white">

                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="text-green-600" size={22} />
                  <h2 className="font-bold text-lg">
                    WhatsApp Follow-up Generator
                  </h2>
                </div>

                <div className="space-y-3">

                  <div>
                    <label className="text-sm font-medium">
                      Customer Name
                    </label>

                    <input
                      className="border rounded-lg p-2 w-full mt-1"
                      value="Kavya Reddy"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Phone Number
                    </label>

                    <input
                      className="border rounded-lg p-2 w-full mt-1"
                      value="+91 9218040927"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Follow-up Message
                    </label>

                    <textarea
                      rows={8}
                      className="border rounded-lg p-3 w-full mt-1"
                      value={whatsappMessage}
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={copyWhatsApp}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Copy Message
                    </button>

                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Call Customer
                    </button>

                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-2">

                    <button className="border rounded-lg py-2 text-sm hover:bg-gray-100">
                      WhatsApp in 2h
                    </button>

                    <button className="border rounded-lg py-2 text-sm hover:bg-gray-100">
                      Tomorrow Morning
                    </button>

                    <button className="border rounded-lg py-2 text-sm hover:bg-gray-100">
                      Send Property PDF
                    </button>

                  </div>

                </div>
              </div>

              {/* Customer Journey */}
              <JourneyTimeline ulid={selected} />

            </div>

          </div>

        </TabsContent>

        {/* ================= DRAFTING ================= */}
        <TabsContent value="drafting" className="mt-4">
          <DraftingPanel list={list} meta={nameOf} />
        </TabsContent>

        {/* ================= DASHBOARD ================= */}
        <TabsContent value="dashboard" className="mt-4">
          <Dashboards list={list} meta={nameOf} />
        </TabsContent>

        {/* ================= JOURNEY ================= */}
        <TabsContent value="stream" className="mt-4">
          <JourneyTimeline ulid={null} />
        </TabsContent>

        {/* ================= UNMATCHED ================= */}
        <TabsContent value="unmatched" className="mt-4">
          <UnmatchedQueue />
        </TabsContent>

      </Tabs>

      {/* Bottom Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

        <div className="rounded-lg border p-4 bg-orange-50">
          <p className="text-sm text-gray-500">Active Leads</p>
          <h3 className="text-2xl font-bold text-orange-600">
            {list.length}
          </h3>
        </div>

        <div className="rounded-lg border p-4 bg-green-50">
          <p className="text-sm text-gray-500">Today's Calls</p>
          <h3 className="text-2xl font-bold text-green-600">26</h3>
        </div>

        <div className="rounded-lg border p-4 bg-blue-50">
          <p className="text-sm text-gray-500">Tours Scheduled</p>
          <h3 className="text-2xl font-bold text-blue-600">11</h3>
        </div>

        <div className="rounded-lg border p-4 bg-red-50">
          <p className="text-sm text-gray-500">Bookings Closed</p>
          <h3 className="text-2xl font-bold text-red-600">4</h3>
        </div>

      </div>

    </div>
  );
}

export default MovementOS;