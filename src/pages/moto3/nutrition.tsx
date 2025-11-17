import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Utensils, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  description: string;
}

export default function NutritionDiary() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast' as Meal['type'],
    protein: '',
    carbs: '',
    fats: '',
    description: '',
  });

  const goals = {
    calories: 2800,
    protein: 180,
    carbs: 320,
    fats: 85,
  };

  useEffect(() => {
    // Load today's meals
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`moto3_nutrition_${today}`);
    if (stored) {
      setMeals(JSON.parse(stored));
    }
  }, []);

  const totals = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
      calories: acc.calories + meal.calories,
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );

  const addMeal = () => {
    const protein = parseFloat(newMeal.protein) || 0;
    const carbs = parseFloat(newMeal.carbs) || 0;
    const fats = parseFloat(newMeal.fats) || 0;
    const calories = protein * 4 + carbs * 4 + fats * 9;

    const meal: Meal = {
      type: newMeal.type,
      protein,
      carbs,
      fats,
      calories,
      description: newMeal.description || `${newMeal.type}`,
    };

    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);

    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`moto3_nutrition_${today}`, JSON.stringify(updatedMeals));

    // Reset form
    setNewMeal({
      type: 'breakfast',
      protein: '',
      carbs: '',
      fats: '',
      description: '',
    });
  };

  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMealIcon = (type: Meal['type']) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎',
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Utensils className="w-8 h-8" />
            Nutrition Diary
          </h1>
          <p className="text-green-100">Track macros & meals</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Goals</CardTitle>
            <CardDescription>{new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-sm font-bold">
                  {totals.calories.toFixed(0)} / {goals.calories}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                  style={{ width: `${getProgress(totals.calories, goals.calories)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {totals.protein.toFixed(0)}g
                  </div>
                  <div className="text-xs text-muted-foreground">/ {goals.protein}g</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${getProgress(totals.protein, goals.protein)}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1 font-medium">Protein</div>
              </div>

              <div>
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-green-600">
                    {totals.carbs.toFixed(0)}g
                  </div>
                  <div className="text-xs text-muted-foreground">/ {goals.carbs}g</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${getProgress(totals.carbs, goals.carbs)}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1 font-medium">Carbs</div>
              </div>

              <div>
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-yellow-600">
                    {totals.fats.toFixed(0)}g
                  </div>
                  <div className="text-xs text-muted-foreground">/ {goals.fats}g</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${getProgress(totals.fats, goals.fats)}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1 font-medium">Fats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Meal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Meal Type</label>
              <Select
                value={newMeal.type}
                onValueChange={(value) => setNewMeal({ ...newMeal, type: value as Meal['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                  <SelectItem value="lunch">☀️ Lunch</SelectItem>
                  <SelectItem value="dinner">🌙 Dinner</SelectItem>
                  <SelectItem value="snack">🍎 Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                placeholder="e.g., Chicken breast with rice and vegetables"
                value={newMeal.description}
                onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Protein (g)</label>
                <Input
                  type="number"
                  placeholder="40"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Carbs (g)</label>
                <Input
                  type="number"
                  placeholder="60"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Fats (g)</label>
                <Input
                  type="number"
                  placeholder="15"
                  value={newMeal.fats}
                  onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                />
              </div>
            </div>

            <Button
              onClick={addMeal}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Meal
            </Button>
          </CardContent>
        </Card>

        {meals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meals.map((meal, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getMealIcon(meal.type)}</span>
                        <div>
                          <div className="font-semibold capitalize">{meal.type}</div>
                          <div className="text-xs text-muted-foreground">{meal.description}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{meal.calories.toFixed(0)} cal</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{meal.protein}g</div>
                        <div className="text-muted-foreground">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{meal.carbs}g</div>
                        <div className="text-muted-foreground">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600">{meal.fats}g</div>
                        <div className="text-muted-foreground">Fats</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
