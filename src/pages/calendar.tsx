import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

const mesocycles = [
  { weeks: [1, 2, 3], name: "Anatomical Adaptation", color: "bg-blue-400" },
  { weeks: [4], name: "Deload 1", color: "bg-green-400" },
  { weeks: [5, 6, 7], name: "Hypertrophy", color: "bg-purple-400" },
  { weeks: [8], name: "Deload 2", color: "bg-green-400" },
  { weeks: [9], name: "Strength Base", color: "bg-red-700" },
  { weeks: [10, 11], name: "Transfer + Power", color: "bg-orange-400" },
  { weeks: [12], name: "Deload 3", color: "bg-green-400" },
  { weeks: [13, 14, 15], name: "Peak Transfer", color: "bg-red-500" },
  { weeks: [16], name: "Deload 4 + Taper", color: "bg-green-300" },
  { weeks: [17, 18], name: "Taper + Peak", color: "bg-yellow-400" },
];

const weekSchedule = {
  Monday: "Lower Body + Core",
  Tuesday: "Upper Body Pull",
  Wednesday: "Conditioning / Active Recovery",
  Thursday: "Lower Body Power",
  Friday: "Upper Body Push + Core",
  Saturday: "Full Body / Skill Work",
  Sunday: "Rest / Stretching",
};

export default function TrainingCalendar() {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  
  const startDate = new Date("2025-11-06");
  
  const getWeekDates = (weekNum: number) => {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMesocycleForWeek = (week: number) => {
    return mesocycles.find((m) => m.weeks.includes(week));
  };

  if (selectedWeek) {
    const dates = getWeekDates(selectedWeek);
    const mesocycle = getMesocycleForWeek(selectedWeek);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Button variant="ghost" onClick={() => setSelectedWeek(null)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">Week {selectedWeek}</CardTitle>
                  <CardDescription>{mesocycle?.name}</CardDescription>
                </div>
                <Badge className={`${mesocycle?.color} text-white`}>
                  {dates[0].toLocaleDateString()} - {dates[6].toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {days.map((day, idx) => (
              <Card
                key={day}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/session/${selectedWeek}/${day.toLowerCase()}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{day}</CardTitle>
                      <CardDescription>{dates[idx].toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant={day === "Sunday" ? "secondary" : "default"}>
                      {weekSchedule[day as keyof typeof weekSchedule]}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-red-500" />
              <div>
                <CardTitle className="text-3xl">18-Week Training Calendar</CardTitle>
                <CardDescription>Nov 6, 2025 → Apr 13, 2026</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Mesocycle Legend</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mesocycles.map((meso, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${meso.color}`}></div>
                <span className="text-sm">
                  {meso.name} (W{meso.weeks.join(", W")})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => {
            const mesocycle = getMesocycleForWeek(week);
            const weekDates = getWeekDates(week);
            
            return (
              <Card
                key={week}
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => setSelectedWeek(week)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>Week {week}</CardTitle>
                    <div className={`w-4 h-4 rounded-full ${mesocycle?.color}`}></div>
                  </div>
                  <CardDescription className="text-xs">
                    {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" - "}
                    {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="outline"
                    className={`${mesocycle?.color} text-white border-0 w-full justify-center`}
                  >
                    {mesocycle?.name}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
