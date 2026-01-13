import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Flame,
  Snowflake,
  Wind,
  Circle,
  CheckCircle2,
  Play,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Moto3-specific warmup protocol
const warmupExercises = [
  {
    name: "Neck Rolls",
    sets: 2,
    reps: 10,
    duration: 60,
    focus: "Cervical mobility for helmet comfort",
    instructions: "Slow, controlled circles. Both directions.",
  },
  {
    name: "Shoulder Circles",
    sets: 2,
    reps: 15,
    duration: 90,
    focus: "Shoulder girdle activation",
    instructions: "Forward and backward. Keep arms extended.",
  },
  {
    name: "Cat-Cow",
    sets: 2,
    reps: 12,
    duration: 90,
    focus: "Spinal mobility",
    instructions: "Smooth transitions between flexion and extension.",
  },
  {
    name: "Hip Circles",
    sets: 2,
    reps: 10,
    duration: 60,
    focus: "Hip mobility for riding position",
    instructions: "Wide circles. Maintain balance.",
  },
  {
    name: "Ankle Bounces",
    sets: 2,
    reps: 20,
    duration: 60,
    focus: "Ankle stiffness for gear changes",
    instructions: "Quick, light bounces. Stay on balls of feet.",
  },
  {
    name: "Wrist Prep",
    sets: 2,
    reps: 15,
    duration: 60,
    focus: "Grip strength and wrist endurance",
    instructions: "Circles, flexion, extension with tension.",
  },
];

const cooldownExercises = [
  {
    name: "Walking (Active Cool)",
    duration: 300,
    focus: "Heart rate reduction",
    instructions: "5 minutes slow walking to bring HR down gradually.",
  },
  {
    name: "Quad Stretch",
    duration: 60,
    focus: "Quadriceps release",
    instructions: "Standing quad stretch, 30s each leg.",
  },
  {
    name: "Hip Flexor Stretch",
    duration: 60,
    focus: "Hip flexor lengthening",
    instructions: "Kneeling lunge position, 30s each side.",
  },
  {
    name: "Spinal Twist",
    duration: 60,
    focus: "Spinal decompression",
    instructions: "Seated twist, 30s each direction.",
  },
  {
    name: "Child's Pose",
    duration: 90,
    focus: "Full body relaxation",
    instructions: "Deep breathing. Release tension.",
  },
];

const stretchingProtocol = [
  {
    name: "Neck Stretch Series",
    duration: 120,
    focus: "Cervical release",
    instructions: "Side bend, rotation, forward flexion. 20s each.",
  },
  {
    name: "Shoulder External Rotation",
    duration: 60,
    focus: "Rotator cuff",
    instructions: "Doorway stretch with arm at 90°. 30s each.",
  },
  {
    name: "Thoracic Extension",
    duration: 90,
    focus: "Upper back mobility",
    instructions: "Over foam roller or bolster. Deep breaths.",
  },
  {
    name: "Hip Flexor Stretch",
    duration: 90,
    focus: "Psoas lengthening",
    instructions: "Deep lunge. Contract glute to enhance stretch.",
  },
  {
    name: "Piriformis Stretch",
    duration: 90,
    focus: "Hip external rotator",
    instructions: "Figure-4 position. Gentle pull toward chest.",
  },
  {
    name: "Hamstring Stretch",
    duration: 90,
    focus: "Posterior chain",
    instructions: "Supine with strap. Keep knee straight.",
  },
  {
    name: "Calf Stretch",
    duration: 60,
    focus: "Ankle mobility",
    instructions: "Wall lean. Bent and straight knee variations.",
  },
  {
    name: "Forearm/Wrist Stretch",
    duration: 60,
    focus: "Grip fatigue relief",
    instructions: "Extension and flexion. Each position 15s.",
  },
];

const foamRollingProtocol = [
  {
    name: "Upper Back (Thoracic)",
    duration: 90,
    focus: "Reduce upper back tension",
    instructions: "Roll slowly. Pause on tender spots. Arms crossed over chest.",
  },
  {
    name: "Lats",
    duration: 60,
    focus: "Shoulder girdle release",
    instructions: "Side-lying position. Arm extended overhead.",
  },
  {
    name: "Glutes",
    duration: 90,
    focus: "Hip stability muscles",
    instructions: "Cross ankle over knee. Tilt to targeted side.",
  },
  {
    name: "IT Band",
    duration: 90,
    focus: "Lateral thigh release",
    instructions: "Side-lying. Roll from hip to just above knee.",
  },
  {
    name: "Quads",
    duration: 90,
    focus: "Anterior thigh",
    instructions: "Prone position. Roll slowly. Rotate leg internally/externally.",
  },
  {
    name: "Hamstrings",
    duration: 90,
    focus: "Posterior thigh",
    instructions: "Seated. One leg at a time. Rotate foot side to side.",
  },
  {
    name: "Calves",
    duration: 60,
    focus: "Lower leg release",
    instructions: "Cross legs for added pressure. Roll entire calf.",
  },
  {
    name: "Forearms",
    duration: 60,
    focus: "Grip fatigue relief",
    instructions: "Use small ball or roller. Both flexors and extensors.",
  },
];

const quickReference = [
  {
    category: "Pre-Track",
    items: [
      "5-min warmup jog",
      "Dynamic stretching (8 min)",
      "Neck/shoulder activation",
      "Wrist prep",
    ],
  },
  {
    category: "Post-Track",
    items: [
      "5-min cool-down walk",
      "Static stretching (10 min)",
      "Foam rolling (12 min)",
      "Hydration + nutrition",
    ],
  },
  {
    category: "Rest Day",
    items: [
      "Morning routine (12 min)",
      "Full stretching protocol (15 min)",
      "Foam rolling (15 min)",
      "Optional: 20-30min walk",
    ],
  },
  {
    category: "Red Flags (STOP)",
    items: [
      "Sharp pain during movement",
      "Swelling in joints",
      "HRV drop >10ms from baseline",
      "Persistent muscle soreness >48h",
    ],
  },
];

export default function Preparation() {
  const navigate = useNavigate();
  const [completedWarmup, setCompletedWarmup] = useState<number[]>([]);
  const [completedCooldown, setCompletedCooldown] = useState<number[]>([]);
  const [completedStretching, setCompletedStretching] = useState<number[]>([]);
  const [completedFoamRoll, setCompletedFoamRoll] = useState<number[]>([]);

  const toggleComplete = (
    index: number,
    list: number[],
    setter: (val: number[]) => void
  ) => {
    if (list.includes(index)) {
      setter(list.filter((i) => i !== index));
    } else {
      setter([...list, index]);
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Preparation & Recovery
            </h1>
            <p className="text-sm text-muted-foreground">
              Moto3-specific protocols for optimal performance
            </p>
          </div>
        </div>

        <Tabs defaultValue="warmup" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="warmup" className="text-xs md:text-sm">
              <Flame className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Warmup</span>
            </TabsTrigger>
            <TabsTrigger value="cooldown" className="text-xs md:text-sm">
              <Snowflake className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Cooldown</span>
            </TabsTrigger>
            <TabsTrigger value="stretching" className="text-xs md:text-sm">
              <Wind className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Stretch</span>
            </TabsTrigger>
            <TabsTrigger value="foam" className="text-xs md:text-sm">
              <Circle className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Foam Roll</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="text-xs md:text-sm">
              <Play className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Quick Ref</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="warmup">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Training Warmup</CardTitle>
                <CardDescription>
                  8-minute dynamic warmup for Moto3 riders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {warmupExercises.map((exercise, idx) => (
                  <Card
                    key={idx}
                    className={`transition-all ${
                      completedWarmup.includes(idx)
                        ? "bg-green-500/10 border-green-500/30"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">
                              {exercise.name}
                            </CardTitle>
                            {completedWarmup.includes(idx) && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <CardDescription className="text-xs mt-1">
                            {exercise.sets}×{exercise.reps} • {exercise.duration}s
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant={completedWarmup.includes(idx) ? "outline" : "default"}
                          onClick={() =>
                            toggleComplete(idx, completedWarmup, setCompletedWarmup)
                          }
                        >
                          {completedWarmup.includes(idx) ? "Done" : "Mark"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {exercise.focus}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {exercise.instructions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Progress: {completedWarmup.length}/{warmupExercises.length} exercises
                  </p>
                  {completedWarmup.length === warmupExercises.length && (
                    <Badge className="mt-2 bg-green-500">Warmup Complete!</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cooldown">
            <Card>
              <CardHeader>
                <CardTitle>Post-Training Cooldown</CardTitle>
                <CardDescription>
                  10-minute active recovery and static stretching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {cooldownExercises.map((exercise, idx) => (
                  <Card
                    key={idx}
                    className={`transition-all ${
                      completedCooldown.includes(idx)
                        ? "bg-blue-500/10 border-blue-500/30"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">
                              {exercise.name}
                            </CardTitle>
                            {completedCooldown.includes(idx) && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <CardDescription className="text-xs mt-1">
                            {exercise.duration}s
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant={completedCooldown.includes(idx) ? "outline" : "default"}
                          onClick={() =>
                            toggleComplete(idx, completedCooldown, setCompletedCooldown)
                          }
                        >
                          {completedCooldown.includes(idx) ? "Done" : "Mark"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {exercise.focus}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {exercise.instructions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Progress: {completedCooldown.length}/{cooldownExercises.length} exercises
                  </p>
                  {completedCooldown.length === cooldownExercises.length && (
                    <Badge className="mt-2 bg-blue-500">Cooldown Complete!</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stretching">
            <Card>
              <CardHeader>
                <CardTitle>Stretching Protocol</CardTitle>
                <CardDescription>
                  15-minute dedicated stretching (rest days or post-training)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stretchingProtocol.map((exercise, idx) => (
                  <Card
                    key={idx}
                    className={`transition-all ${
                      completedStretching.includes(idx)
                        ? "bg-purple-500/10 border-purple-500/30"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">
                              {exercise.name}
                            </CardTitle>
                            {completedStretching.includes(idx) && (
                              <CheckCircle2 className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                          <CardDescription className="text-xs mt-1">
                            {exercise.duration}s
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant={completedStretching.includes(idx) ? "outline" : "default"}
                          onClick={() =>
                            toggleComplete(idx, completedStretching, setCompletedStretching)
                          }
                        >
                          {completedStretching.includes(idx) ? "Done" : "Mark"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {exercise.focus}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {exercise.instructions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Progress: {completedStretching.length}/{stretchingProtocol.length} exercises
                  </p>
                  {completedStretching.length === stretchingProtocol.length && (
                    <Badge className="mt-2 bg-purple-500">Stretching Complete!</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foam">
            <Card>
              <CardHeader>
                <CardTitle>Foam Rolling Protocol</CardTitle>
                <CardDescription>
                  12-15 minute self-myofascial release for recovery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {foamRollingProtocol.map((exercise, idx) => (
                  <Card
                    key={idx}
                    className={`transition-all ${
                      completedFoamRoll.includes(idx)
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">
                              {exercise.name}
                            </CardTitle>
                            {completedFoamRoll.includes(idx) && (
                              <CheckCircle2 className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <CardDescription className="text-xs mt-1">
                            {exercise.duration}s
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant={completedFoamRoll.includes(idx) ? "outline" : "default"}
                          onClick={() =>
                            toggleComplete(idx, completedFoamRoll, setCompletedFoamRoll)
                          }
                        >
                          {completedFoamRoll.includes(idx) ? "Done" : "Mark"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {exercise.focus}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {exercise.instructions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Progress: {completedFoamRoll.length}/{foamRollingProtocol.length} areas
                  </p>
                  {completedFoamRoll.length === foamRollingProtocol.length && (
                    <Badge className="mt-2 bg-orange-500">Foam Rolling Complete!</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference">
            <div className="grid md:grid-cols-2 gap-4">
              {quickReference.map((ref, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{ref.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {ref.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-4 border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>⚠️</span> Recovery Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Hydration:</strong> 500ml water within 30min post-training
                </p>
                <p>
                  <strong>Nutrition:</strong> Protein + carbs within 1 hour (3:1 ratio)
                </p>
                <p>
                  <strong>Sleep:</strong> Target 8-9 hours for optimal recovery
                </p>
                <p>
                  <strong>Compression:</strong> Consider compression garments for long travel
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
