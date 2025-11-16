import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Activity,
  Dumbbell,
  Zap,
} from "lucide-react";

// Expected progressions for Moto3 training
const expectedProgressions = {
  strength: [
    {
      exercise: "Back Squat",
      week1: { weight: 60, reps: 8 },
      week6: { weight: 80, reps: 8 },
      week12: { weight: 90, reps: 5 },
      week18: { weight: 95, reps: 3 },
      unit: "kg",
    },
    {
      exercise: "Romanian Deadlift",
      week1: { weight: 50, reps: 10 },
      week6: { weight: 70, reps: 10 },
      week12: { weight: 85, reps: 6 },
      week18: { weight: 90, reps: 4 },
      unit: "kg",
    },
    {
      exercise: "Bench Press",
      week1: { weight: 40, reps: 10 },
      week6: { weight: 55, reps: 10 },
      week12: { weight: 65, reps: 6 },
      week18: { weight: 70, reps: 3 },
      unit: "kg",
    },
  ],
  power: [
    {
      exercise: "Box Jump",
      week1: { height: 50, reps: 5 },
      week6: { height: 60, reps: 5 },
      week12: { height: 70, reps: 5 },
      week18: { height: 75, reps: 5 },
      unit: "cm",
    },
    {
      exercise: "Med Ball Slam",
      week1: { weight: 6, reps: 10 },
      week6: { weight: 8, reps: 10 },
      week12: { weight: 10, reps: 8 },
      week18: { weight: 12, reps: 8 },
      unit: "kg",
    },
    {
      exercise: "Broad Jump",
      week1: { distance: 180, reps: 5 },
      week6: { distance: 200, reps: 5 },
      week12: { distance: 220, reps: 5 },
      week18: { distance: 230, reps: 5 },
      unit: "cm",
    },
  ],
  core: [
    {
      exercise: "Plank",
      week1: { duration: 60 },
      week6: { duration: 90 },
      week12: { duration: 120 },
      week18: { duration: 150 },
      unit: "sec",
    },
    {
      exercise: "Pallof Press",
      week1: { weight: 15, reps: 12 },
      week6: { weight: 20, reps: 12 },
      week12: { weight: 25, reps: 10 },
      week18: { weight: 30, reps: 10 },
      unit: "kg",
    },
    {
      exercise: "Dead Bug",
      week1: { reps: 10 },
      week6: { reps: 15 },
      week12: { reps: 20 },
      week18: { reps: 25 },
      unit: "reps",
    },
  ],
  conditioning: [
    {
      exercise: "Assault Bike",
      week1: { duration: 180, distance: 2.5 },
      week6: { duration: 180, distance: 3.0 },
      week12: { duration: 180, distance: 3.5 },
      week18: { duration: 180, distance: 4.0 },
      unit: "km",
    },
    {
      exercise: "Rowing",
      week1: { duration: 300, distance: 1000 },
      week6: { duration: 300, distance: 1100 },
      week12: { duration: 300, distance: 1200 },
      week18: { duration: 300, distance: 1250 },
      unit: "m",
    },
  ],
};

const milestones = [
  { week: 3, title: "Anatomical Adaptation Complete", description: "Movement patterns established" },
  { week: 7, title: "Hypertrophy Phase Complete", description: "Muscle mass gained" },
  { week: 11, title: "Strength Base Achieved", description: "Max strength improved" },
  { week: 15, title: "Power Transfer Complete", description: "Peak power developed" },
  { week: 18, title: "Competition Peak", description: "Ready for season start" },
];

export default function Progressions() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof expectedProgressions>("strength");

  const currentWeek = Math.min(
    18,
    Math.max(
      1,
      Math.ceil((Date.now() - new Date("2025-11-06").getTime()) / (7 * 24 * 60 * 60 * 1000))
    )
  );

  const { data: progressionsData } = useQuery({
    queryKey: ["progressions"],
    queryFn: async () => {
      const res = await apiClient.progressions.$get();
      return res.json();
    },
  });

  const getProgressPercentage = (exercise: any, currentWeek: number) => {
    const startValue = exercise.week1.weight || exercise.week1.height || exercise.week1.distance || exercise.week1.duration;
    const endValue = exercise.week18.weight || exercise.week18.height || exercise.week18.distance || exercise.week18.duration;
    const range = endValue - startValue;
    const weekProgress = (currentWeek / 18) * range;
    const expectedCurrent = startValue + weekProgress;

    // Find actual progress from data
    const actual = progressionsData?.progressions?.find(
      (p: any) => p.exerciseName === exercise.exercise && p.week === currentWeek
    );

    const actualValue = actual?.actualWeight || actual?.actualDuration || 0;
    const percentage = actualValue > 0 ? (actualValue / expectedCurrent) * 100 : 0;

    return {
      expected: expectedCurrent,
      actual: actualValue,
      percentage: Math.min(100, percentage),
      onTrack: percentage >= 90,
    };
  };

  const categories = [
    { key: "strength", label: "Strength", icon: Dumbbell, color: "text-red-500" },
    { key: "power", label: "Power", icon: Zap, color: "text-orange-500" },
    { key: "core", label: "Core", icon: Activity, color: "text-blue-500" },
    { key: "conditioning", label: "Conditioning", icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
              Expected Progressions
            </h1>
            <p className="text-sm text-muted-foreground">
              Week {currentWeek} of 18 • Target vs Actual Performance
            </p>
          </div>
        </div>

        {/* Milestone Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Training Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border ml-2" />
              <div className="space-y-6">
                {milestones.map((milestone, idx) => {
                  const isPast = currentWeek > milestone.week;
                  const isCurrent = currentWeek === milestone.week;
                  return (
                    <div key={idx} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 ${
                          isPast
                            ? "bg-green-500 border-green-500"
                            : isCurrent
                            ? "bg-yellow-500 border-yellow-500 animate-pulse"
                            : "bg-background border-muted-foreground"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{milestone.title}</p>
                          <Badge variant={isPast ? "default" : "outline"} className="text-xs">
                            Week {milestone.week}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(val) => setSelectedCategory(val as any)}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.key} value={cat.key} className="text-xs md:text-sm">
                  <Icon className={`w-4 h-4 md:mr-1 ${cat.color}`} />
                  <span className="hidden md:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(expectedProgressions).map(([category, exercises]) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {exercises.map((exercise: any, idx: number) => {
                  const progress = getProgressPercentage(exercise, currentWeek);
                  const currentTarget = `${Math.round(progress.expected)}${exercise.unit}`;
                  const actualValue = progress.actual > 0 ? `${progress.actual}${exercise.unit}` : "Not recorded";
                  const week18Target = exercise.week18.weight || exercise.week18.height || exercise.week18.distance || exercise.week18.duration;

                  return (
                    <Card key={idx} className={progress.onTrack ? "border-green-500/30" : "border-orange-500/30"}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{exercise.exercise}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Target: {week18Target}{exercise.unit} by Week 18
                            </CardDescription>
                          </div>
                          <Badge variant={progress.onTrack ? "default" : "secondary"} className={progress.onTrack ? "bg-green-500" : ""}>
                            {progress.onTrack ? "On Track" : "Behind"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Week {currentWeek} Target</p>
                            <p className="text-lg font-bold text-purple-500">{currentTarget}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Your Actual</p>
                            <p className={`text-lg font-bold ${progress.actual > 0 ? (progress.onTrack ? "text-green-500" : "text-orange-500") : "text-muted-foreground"}`}>
                              {actualValue}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Progress to Target</span>
                            <span className="text-xs font-medium">{Math.round(progress.percentage)}%</span>
                          </div>
                          <Progress value={progress.percentage} className="h-2" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-1">W1</p>
                            <p className="font-medium">
                              {exercise.week1.weight || exercise.week1.height || exercise.week1.distance || exercise.week1.duration}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground mb-1">W6</p>
                            <p className="font-medium">
                              {exercise.week6.weight || exercise.week6.height || exercise.week6.distance || exercise.week6.duration}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground mb-1">W12</p>
                            <p className="font-medium">
                              {exercise.week12.weight || exercise.week12.height || exercise.week12.distance || exercise.week12.duration}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground mb-1">W18</p>
                            <p className="font-medium text-purple-500">
                              {week18Target}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Info Card */}
        <Card className="mt-6 border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progression Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p><strong>Strength:</strong> Progress 2-5% per week. Prioritize form over weight.</p>
            <p><strong>Power:</strong> Quality over quantity. Full recovery between sets.</p>
            <p><strong>Core:</strong> Increase difficulty before duration. Maintain perfect form.</p>
            <p><strong>Conditioning:</strong> Gradual volume increase. Monitor heart rate recovery.</p>
            <p className="text-yellow-600 dark:text-yellow-500 pt-2">
              ⚠️ If falling behind, don't rush. Adjust targets with your coach.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
