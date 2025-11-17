import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  zone: string;
  duration: string;
  notes: string;
}

const MOBILITY_EXERCISES: Exercise[] = [
  { id: '1', zone: 'Cervicale', name: 'Cervical CARs', duration: '3 min', notes: 'Controlled Articular Rotations. Rotazioni complete controllate. 5 rep per direzione lente.' },
  { id: '2', zone: 'Scapole', name: 'Scapular Circles', duration: '2 min', notes: 'Cerchi completi con le scapole. Protrazione, elevazione, retrazione, depressione.' },
  { id: '3', zone: 'Spalle', name: 'Shoulder CARs', duration: '3 min per lato', notes: 'Rotazione articolare completa. Inizia avanti, sopra, dietro, giù. Controllo totale.' },
  { id: '4', zone: 'Toracica', name: 'Thoracic Rotations', duration: '2 min per lato', notes: 'Ginocchia piegate, ruota spine. Segui mano con occhi. Mantieni bacino stabile.' },
  { id: '5', zone: 'Anche', name: 'Hip 90-90', duration: '2 min totale', notes: 'Transizioni da rotazione interna a esterna. Mantieni spine neutrale.' },
  { id: '6', zone: 'Anche', name: 'Hip CARs', duration: '3 min per lato', notes: 'Cerchi completi con gamba. Mantieni controllo e tensione. ROM massimo.' },
  { id: '7', zone: 'Ginocchia', name: 'Knee CARs', duration: '2 min per lato', notes: 'Flessione ed estensione controllata. Rotazioni tibia delicate.' },
  { id: '8', zone: 'Caviglie', name: 'Ankle CARs', duration: '2 min per lato', notes: 'Cerchi completi caviglia. Dorsi/plantar flex. Inversione/eversione.' },
  { id: '9', zone: 'Polsi', name: 'Wrist CARs', duration: '2 min', notes: 'Rotazioni complete polso. Estensione/flessione/deviazioni radiali.' },
  { id: '10', zone: 'Dita', name: 'Finger CARs', duration: '2 min', notes: 'Apertura/chiusura completa. Ogni dito singolarmente. Grip importante per moto.' },
];

export default function Mobility() {
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('moto3_mobility_completed_today');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCompletedIds(data.ids);
      } else {
        setCompletedIds([]);
        localStorage.setItem('moto3_mobility_completed_today', JSON.stringify({ date: today, ids: [] }));
      }
    }
  }, []);

  const toggleComplete = (id: string) => {
    const newCompleted = completedIds.includes(id)
      ? completedIds.filter(cid => cid !== id)
      : [...completedIds, id];

    setCompletedIds(newCompleted);
    const today = new Date().toDateString();
    localStorage.setItem('moto3_mobility_completed_today', JSON.stringify({ date: today, ids: newCompleted }));
  };

  const totalProgress = Math.round((completedIds.length / MOBILITY_EXERCISES.length) * 100);
  const totalDuration = MOBILITY_EXERCISES.reduce((sum, ex) => {
    const mins = parseInt(ex.duration);
    return sum + (isNaN(mins) ? 2 : mins);
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Mobility Protocol</h1>
          <p className="text-purple-100">CARs - Controlled Articular Rotations</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Progress {totalProgress}%</CardTitle>
                <CardDescription>{completedIds.length}/{MOBILITY_EXERCISES.length} • ~{totalDuration} min totali</CardDescription>
              </div>
              <Badge className="bg-purple-600">CARs</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>💡 Cosa sono i CARs?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Controlled Articular Rotations</strong> sono movimenti articolari completi eseguiti con massimo controllo e tensione.</p>
            <p className="mt-3"><strong>Benefici:</strong> Mantengono e migliorano ROM, lubrificano articolazioni, prevengono compensi, identificano limitazioni.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Esercizi</CardTitle>
            <CardDescription>Sequence completa testa-piedi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOBILITY_EXERCISES.map((exercise, idx) => (
                <div
                  key={exercise.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    completedIds.includes(exercise.id)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Checkbox
                    checked={completedIds.includes(exercise.id)}
                    onCheckedChange={() => toggleComplete(exercise.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                      <Badge variant="outline" className="text-xs">{exercise.zone}</Badge>
                    </div>
                    <div className="font-semibold">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">⏱️ {exercise.duration}</div>
                    <div className="text-xs text-muted-foreground mt-1">{exercise.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>📋 Principi Esecuzione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• <strong>Lento e controllato</strong> - Ogni movimento richiede 10-15 secondi</p>
            <p>• <strong>Massimo ROM attivo</strong> - Usa solo forza muscolare, no momentum</p>
            <p>• <strong>Tensione costante</strong> - Mantieni tutti muscoli attivi durante movimento</p>
            <p>• <strong>Respirazione</strong> - Respira normalmente, non trattenere</p>
            <p>• <strong>Giornaliero</strong> - Meglio 10 min al giorno che 60 min una volta/settimana</p>
          </CardContent>
        </Card>

        {totalProgress === 100 && (
          <Card className="border-green-300 bg-gradient-to-r from-green-100 to-emerald-100">
            <CardContent className="py-6 text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-xl font-bold text-green-700">Mobility Session Completa!</div>
              <p className="text-sm text-green-600 mt-2">Ottimo lavoro! Articolazioni pronte per performance.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
