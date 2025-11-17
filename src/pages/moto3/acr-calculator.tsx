import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ACRCalculator() {
  const navigate = useNavigate();
  const [acuteLoad, setAcuteLoad] = useState('');
  const [chronicLoad, setChronicLoad] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState('');

  const calculateACR = () => {
    const acute = parseFloat(acuteLoad);
    const chronic = parseFloat(chronicLoad);

    if (isNaN(acute) || isNaN(chronic) || chronic === 0) {
      setResult(null);
      setInterpretation('⚠️ Inserisci valori validi (carico cronico > 0)');
      return;
    }

    const ratio = acute / chronic;
    setResult(ratio);

    if (ratio < 0.8) {
      setInterpretation('🔵 DETRAINING - Carico troppo basso. Rischio perdita forma fisica. Aumenta gradualmente il volume.');
    } else if (ratio >= 0.8 && ratio <= 1.3) {
      setInterpretation('✅ ZONA OTTIMALE - Carico bilanciato. Continua così per progressione sicura e costante.');
    } else if (ratio > 1.3 && ratio <= 1.5) {
      setInterpretation('⚠️ ATTENZIONE - Carico elevato. Possibile affaticamento. Monitora recupero e sintomi.');
    } else {
      setInterpretation('🚨 OVERTRAINING - Rischio infortuni alto! Riduci volume o intensità immediatamente.');
    }
  };

  const getRiskLevel = (): { color: string; gradient: string; label: string } => {
    if (result === null) return { color: 'gray', gradient: 'from-gray-400 to-gray-500', label: 'N/A' };
    if (result < 0.8) return { color: 'blue', gradient: 'from-blue-400 to-blue-600', label: 'Basso' };
    if (result >= 0.8 && result <= 1.3) return { color: 'green', gradient: 'from-green-400 to-green-600', label: 'Ottimale' };
    if (result > 1.3 && result <= 1.5) return { color: 'amber', gradient: 'from-amber-400 to-amber-600', label: 'Attenzione' };
    return { color: 'red', gradient: 'from-red-500 to-red-700', label: 'Alto' };
  };

  const riskLevel = getRiskLevel();

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
          <h1 className="text-3xl font-bold mb-2">ACR Calculator</h1>
          <p className="text-purple-100">Acute:Chronic Ratio - Prevenzione infortuni</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Cos'è l'ACR?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Acute:Chronic Ratio</strong> confronta il carico di allenamento dell'ultima settimana
              (acuto) con la media delle ultime 4 settimane (cronico).
            </p>
            <p className="mt-3">
              <strong>Formula:</strong> ACR = Carico Settimana Attuale ÷ Media Ultime 4 Settimane
            </p>
            <p className="mt-3">
              Ratio troppo alto = sovraccarico improvviso = rischio infortuni ⬆️<br />
              Ratio troppo basso = detraining = perdita prestazioni ⬇️
            </p>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Calcola ACR</CardTitle>
            <CardDescription>Inserisci i carichi di allenamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Carico Acuto (ultima settimana)
                </label>
                <Input
                  type="number"
                  placeholder="es. 3500"
                  value={acuteLoad}
                  onChange={(e) => setAcuteLoad(e.target.value)}
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Training load dell'ultima settimana
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Carico Cronico (media 4 settimane)
                </label>
                <Input
                  type="number"
                  placeholder="es. 3000"
                  value={chronicLoad}
                  onChange={(e) => setChronicLoad(e.target.value)}
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Media delle ultime 4 settimane
                </p>
              </div>
            </div>
            <Button onClick={calculateACR} className="w-full" size="lg">
              Calcola ACR
            </Button>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result !== null && (
          <Card className={`border-2 border-${riskLevel.color}-500 bg-gradient-to-br ${riskLevel.gradient} text-white`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Risultato ACR</CardTitle>
                <Badge className="bg-white/20 text-white text-lg px-3 py-1">
                  {riskLevel.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-center mb-4">
                {result.toFixed(2)}
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <p className="font-semibold text-lg">{interpretation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guide Section */}
        <Card>
          <CardHeader>
            <CardTitle>Guida Interpretazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-16 h-16 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  &lt;0.8
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900">Detraining</h4>
                  <p className="text-sm text-blue-700">
                    Carico troppo basso rispetto alla media. Rischio perdita adattamenti.
                    <br /><strong>Azione:</strong> Aumenta gradualmente volume o intensità.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="w-16 h-16 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  0.8-1.3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-900">Zona Ottimale</h4>
                  <p className="text-sm text-green-700">
                    Sweet spot! Carico bilanciato per progressione sicura.
                    <br /><strong>Azione:</strong> Mantieni questo range per massimizzare adattamenti.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="w-16 h-16 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  1.3-1.5
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900">Attenzione</h4>
                  <p className="text-sm text-amber-700">
                    Carico elevato. Possibile affaticamento cumulativo.
                    <br /><strong>Azione:</strong> Monitora attentamente recupero, sonno e HRV.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="w-16 h-16 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  &gt;1.5
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-900">Overtraining</h4>
                  <p className="text-sm text-red-700">
                    Rischio infortuni molto elevato (spike superiore al 50%).
                    <br /><strong>Azione:</strong> Riduci immediatamente volume/intensità. Rest day obbligatorio.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Esempio Pratico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Scenario:</strong> Pilota con media 3000 load/settimana</p>
            <p className="mt-2">
              • <strong>Settimana gara:</strong> 4500 load → ACR = 1.5 (⚠️ limite massimo)
            </p>
            <p>
              • <strong>Settimana deload:</strong> 2000 load → ACR = 0.67 (recupero attivo ok)
            </p>
            <p>
              • <strong>Settimana normale:</strong> 3300 load → ACR = 1.1 (✅ perfetto)
            </p>
            <p className="mt-4 pt-4 border-t border-purple-200">
              <strong>Pro Tip:</strong> Usa Load Tracker per calcolare automaticamente il training load!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
