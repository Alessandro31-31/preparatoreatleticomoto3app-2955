import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, Play, Pause, RotateCcw } from "lucide-react";

const exercises = [
  { name: "Cat-Cow", sets: 2, reps: 15, duration: 90 },
  { name: "Glute Bridge", sets: 3, reps: 12, duration: 120 },
  { name: "Dead Bug", sets: 3, reps: 8, duration: 120 },
  { name: "Bird Dog", sets: 3, reps: 8, duration: 120 },
  { name: "Psoas March", sets: 2, reps: 20, duration: 90 },
];

export default function MorningRoutine() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"pre" | "exercises" | "post" | "complete">("pre");
  const [stiffnessPre, setStiffnessPre] = useState([5]);
  const [stiffnessPost, setStiffnessPost] = useState([3]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      if (currentExercise < exercises.length - 1) {
        setTimeout(() => {
          setCurrentExercise((prev) => prev + 1);
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentExercise]);

  const saveRoutineMutation = useMutation({
    mutationFn: async () => {
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 12;
      const res = await apiClient.routine.$post({
        json: {
          date: new Date().toISOString().split("T")[0],
          stiffnessPre: stiffnessPre[0],
          stiffnessPost: stiffnessPost[0],
          duration,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine-today"] });
      setStep("complete");
    },
  });

  const startExercise = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setTimeRemaining(exercises[currentExercise].duration);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(exercises[currentExercise].duration);
  };

  const delta = stiffnessPost[0] - stiffnessPre[0];
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  if (step === "pre") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Morning Routine</CardTitle>
              <CardDescription>12-minute mobility protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pre-Routine Stiffness Assessment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Rate your current lower back/hip stiffness on a scale from 0 (no stiffness) to 10
                  (extremely stiff)
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stiffnessPre[0]}/10</span>
                    <Badge
                      variant={
                        stiffnessPre[0] <= 3
                          ? "default"
                          : stiffnessPre[0] <= 6
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {stiffnessPre[0] <= 3 ? "Good" : stiffnessPre[0] <= 6 ? "Moderate" : "Stiff"}
                    </Badge>
                  </div>
                  <Slider
                    value={stiffnessPre}
                    onValueChange={setStiffnessPre}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>No Stiffness</span>
                    <span>Extremely Stiff</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Today's Exercises:</h4>
                {exercises.map((ex, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{ex.name}</span>
                    <span className="text-muted-foreground">
                      {ex.sets}×{ex.reps}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep("exercises")}
                className="w-full bg-red-500 hover:bg-red-600"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Routine
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "exercises") {
    const exercise = exercises[currentExercise];
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Exercise {currentExercise + 1} of {exercises.length}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{exercise.name}</CardTitle>
              <CardDescription>
                {exercise.sets} sets × {exercise.reps} reps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="text-7xl font-bold mb-2">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
                <p className="text-muted-foreground">Time remaining</p>
              </div>

              <div className="flex gap-3 justify-center">
                {!isRunning && timeRemaining === 0 && (
                  <Button onClick={startExercise} size="lg" className="bg-red-500 hover:bg-red-600">
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                )}
                {timeRemaining > 0 && (
                  <>
                    <Button onClick={toggleTimer} size="lg" className="bg-red-500 hover:bg-red-600">
                      {isRunning ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button onClick={resetTimer} size="lg" variant="outline">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
              </div>

              {currentExercise === exercises.length - 1 && timeRemaining === 0 && !isRunning && (
                <Button
                  onClick={() => setStep("post")}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Routine
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "post") {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Routine Complete!</CardTitle>
              <CardDescription>Final stiffness assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-500/10 p-4 rounded-lg text-center">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Great work!</p>
                <p className="text-sm text-muted-foreground">All exercises completed</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Post-Routine Stiffness Assessment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Rate your current stiffness after completing the routine
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stiffnessPost[0]}/10</span>
                    <Badge
                      variant={
                        stiffnessPost[0] <= 3
                          ? "default"
                          : stiffnessPost[0] <= 6
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {stiffnessPost[0] <= 3 ? "Good" : stiffnessPost[0] <= 6 ? "Moderate" : "Stiff"}
                    </Badge>
                  </div>
                  <Slider
                    value={stiffnessPost}
                    onValueChange={setStiffnessPost}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Delta:</span>
                  <span className="text-2xl font-bold">
                    {delta > 0 ? "+" : ""}
                    {delta.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Target: ≥2.0 points improvement
                </p>
                {delta >= 2 ? (
                  <Badge variant="default" className="mt-2 bg-green-500">
                    Target Achieved! ✓
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="mt-2">
                    Below target
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => saveRoutineMutation.mutate()}
                disabled={saveRoutineMutation.isPending}
                className="w-full bg-red-500 hover:bg-red-600"
                size="lg"
              >
                <Check className="w-4 h-4 mr-2" />
                {saveRoutineMutation.isPending ? "Saving..." : "Save & Finish"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Routine Saved!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mx-auto">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                Improvement: {delta > 0 ? "+" : ""}
                {delta.toFixed(1)} points
              </p>
              <p className="text-muted-foreground">Your morning routine has been logged successfully</p>
            </div>
            <Button onClick={() => navigate("/")} className="w-full" size="lg">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
