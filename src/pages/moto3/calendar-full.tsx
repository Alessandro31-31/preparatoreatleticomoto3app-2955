import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from '@/components/MobileNav';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { COMPLETE_TRAINING_DATA, TRAINING_TYPES, type WeekPlan, type Exercise } from '@/data/trainingData';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Moto3Calendar() {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed sessions from localStorage
    const stored = localStorage.getItem('moto3_completed_sessions');
    if (stored) {
      setCompletedSessions(new Set(JSON.parse(stored)));
    }
  }, []);

  const toggleSession = (weekNum: number, day: string, sessionType: string) => {
    const key = `${weekNum}-${day}-${sessionType}`;
    const newCompleted = new Set(completedSessions);

    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }

    setCompletedSessions(newCompleted);
    localStorage.setItem('moto3_completed_sessions', JSON.stringify(Array.from(newCompleted)));
  };

  const isSessionCompleted = (weekNum: number, day: string, sessionType: string) => {
    return completedSessions.has(`${weekNum}-${day}-${sessionType}`);
  };

  // Exercise Detail View
  if (selectedWeek && selectedDay) {
    const week = COMPLETE_TRAINING_DATA.find((w) => w.week === selectedWeek);
    const dayPlan = week?.days[selectedDay as keyof typeof week.days];

    if (!dayPlan) return null;

    const renderExercises = (exercises: Exercise[], sessionType: string) => (
      <div className="space-y-3">
        {exercises.map((ex, idx) => (
          <Card key={idx} className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{ex.name}</h4>
                {ex.rpe && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'ml-2',
                      ex.rpe >= 8 ? 'bg-red-500 text-white border-red-500' :
                      ex.rpe >= 6 ? 'bg-orange-500 text-white border-orange-500' :
                      'bg-green-500 text-white border-green-500'
                    )}
                  >
                    RPE {ex.rpe}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                {ex.sets && <div>Sets: <span className="font-medium text-foreground">{ex.sets}</span></div>}
                {ex.reps && <div>Reps: <span className="font-medium text-foreground">{ex.reps}</span></div>}
                {ex.tempo && <div>Tempo: <span className="font-medium text-foreground">{ex.tempo}</span></div>}
                {ex.rest && <div>Rest: <span className="font-medium text-foreground">{ex.rest}s</span></div>}
              </div>
              {ex.notes && (
                <p className="text-xs text-muted-foreground mt-2 italic">💡 {ex.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={() => toggleSession(selectedWeek, selectedDay, sessionType)}
          className={cn(
            'w-full',
            isSessionCompleted(selectedWeek, selectedDay, sessionType)
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-500 hover:bg-red-600'
          )}
        >
          {isSessionCompleted(selectedWeek, selectedDay, sessionType) ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </Button>
      </div>
    );

    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-6 py-6 max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedDay(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Week {selectedWeek}
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                Week {selectedWeek} • {selectedDay}
              </CardTitle>
              <CardDescription>{week?.mesocycle}</CardDescription>
            </CardHeader>
          </Card>

          {dayPlan.morning && (
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">🌅 Morning Routine</CardTitle>
                    <CardDescription>{dayPlan.morning.type}</CardDescription>
                  </div>
                  {isSessionCompleted(selectedWeek, selectedDay, 'morning') && (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {renderExercises(dayPlan.morning.exercises, 'morning')}
              </CardContent>
            </Card>
          )}

          {dayPlan.main && (
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {TRAINING_TYPES[dayPlan.main.type as keyof typeof TRAINING_TYPES]?.emoji || '💪'}
                      Main Session
                    </CardTitle>
                    <CardDescription>{dayPlan.main.type}</CardDescription>
                  </div>
                  {isSessionCompleted(selectedWeek, selectedDay, 'main') && (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {renderExercises(dayPlan.main.exercises, 'main')}
              </CardContent>
            </Card>
          )}

          {dayPlan.recovery && (
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">♻️ Recovery</CardTitle>
                    <CardDescription>{dayPlan.recovery.type}</CardDescription>
                  </div>
                  {isSessionCompleted(selectedWeek, selectedDay, 'recovery') && (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {renderExercises(dayPlan.recovery.exercises, 'recovery')}
              </CardContent>
            </Card>
          )}
        </div>
        <MobileNav />
      </div>
    );
  }

  // Week Detail View
  if (selectedWeek) {
    const week = COMPLETE_TRAINING_DATA.find((w) => w.week === selectedWeek);
    if (!week) return null;

    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-6 py-6 max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedWeek(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Week {week.week}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mr-2">{week.mesocycle}</Badge>
                {week.focus}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {DAYS.map((day) => {
              const dayPlan = week.days[day as keyof typeof week.days];
              const sessionsCount = [dayPlan.morning, dayPlan.main, dayPlan.recovery].filter(Boolean).length;
              const completedCount = [
                dayPlan.morning && isSessionCompleted(week.week, day, 'morning'),
                dayPlan.main && isSessionCompleted(week.week, day, 'main'),
                dayPlan.recovery && isSessionCompleted(week.week, day, 'recovery'),
              ].filter(Boolean).length;

              const mainType = dayPlan.main?.type || dayPlan.morning?.type || 'Rest';
              const trainingInfo = TRAINING_TYPES[mainType as keyof typeof TRAINING_TYPES];

              return (
                <Card
                  key={day}
                  className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                  onClick={() => setSelectedDay(day)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">
                          {trainingInfo?.emoji || '📅'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{day}</h3>
                          <p className="text-sm text-muted-foreground">{mainType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {completedCount > 0 && (
                          <Badge variant="outline" className="bg-green-600 text-white border-green-600">
                            {completedCount}/{sessionsCount}
                          </Badge>
                        )}
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  // Week Overview
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white px-6 pt-8 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📅 18-Week Calendar</h1>
          <p className="text-red-100">Complete Moto3 Training Program</p>
        </div>
      </div>

      <div className="px-6 -mt-8 mb-6 max-w-screen-xl mx-auto">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {Array.from(completedSessions).filter(s => s.includes('-main')).length}
                </div>
                <div className="text-xs text-muted-foreground">Sessions Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {Math.ceil((Array.from(completedSessions).length / (18 * 7 * 2)) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {18 - Math.floor(Array.from(completedSessions).filter(s => s.includes('-main')).length / 5)}
                </div>
                <div className="text-xs text-muted-foreground">Weeks Left</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 mb-6 max-w-screen-xl mx-auto">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Training Phases</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Anatomical (W1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span>Hypertrophy (W5-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Strength (W9-11)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Peak (W13-15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>Deload (W4,8,12,16)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Taper (W17-18)</span>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COMPLETE_TRAINING_DATA.map((week) => {
            const weekSessions = DAYS.flatMap((day) => {
              const dayPlan = week.days[day as keyof typeof week.days];
              return [
                dayPlan.morning ? `${week.week}-${day}-morning` : null,
                dayPlan.main ? `${week.week}-${day}-main` : null,
                dayPlan.recovery ? `${week.week}-${day}-recovery` : null,
              ].filter(Boolean) as string[];
            });

            const completedCount = weekSessions.filter((s) => completedSessions.has(s)).length;
            const totalSessions = weekSessions.length;
            const completionPercentage = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

            const phaseColor =
              week.week <= 3 ? 'bg-blue-400' :
              week.week === 4 ? 'bg-green-400' :
              week.week <= 7 ? 'bg-purple-400' :
              week.week === 8 ? 'bg-green-400' :
              week.week <= 11 ? 'bg-red-600' :
              week.week === 12 ? 'bg-green-400' :
              week.week <= 15 ? 'bg-orange-500' :
              week.week === 16 ? 'bg-green-300' :
              'bg-yellow-400';

            return (
              <Card
                key={week.week}
                className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
                onClick={() => setSelectedWeek(week.week)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">Week {week.week}</CardTitle>
                    <div className={`w-4 h-4 rounded-full ${phaseColor}`}></div>
                  </div>
                  <CardDescription className="text-xs line-clamp-1">
                    {week.mesocycle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {completionPercentage > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{completionPercentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="w-full justify-center">
                      Not Started
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
