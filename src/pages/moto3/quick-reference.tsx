import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, CheckCircle, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickReference() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-slate-700 via-gray-600 to-zinc-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Quick Reference</h1>
          <p className="text-gray-200">Protocolli e linee guida essenziali</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {/* Pre-Training Protocol */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Protocollo Pre-Allenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-600 mt-0.5">1</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Readiness Check (5 min)</h4>
                  <p className="text-sm text-muted-foreground">HRV, sonno, dolori muscolari, energia</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-600 mt-0.5">2</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Warmup Generale (10-12 min)</h4>
                  <p className="text-sm text-muted-foreground">Jumping jacks, high knees, arm circles, torso twists</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-600 mt-0.5">3</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Mobility & Activation (8 min)</h4>
                  <p className="text-sm text-muted-foreground">Hip circles, spinal twists, glute bridges, band walks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-600 mt-0.5">4</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Warmup Specifico (5 min)</h4>
                  <p className="text-sm text-muted-foreground">Esercizi simili all'allenamento principale a bassa intensità</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post-Training Protocol */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Protocollo Post-Allenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-600 mt-0.5">1</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Cooldown Attivo (5 min)</h4>
                  <p className="text-sm text-muted-foreground">Walking o jogging leggero per abbassare FC gradualmente</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-600 mt-0.5">2</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Stretching Statico (10 min)</h4>
                  <p className="text-sm text-muted-foreground">30-45 sec per gruppo muscolare. Focus: quad, hamstring, hip flexors</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-600 mt-0.5">3</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Foam Rolling (5-8 min)</h4>
                  <p className="text-sm text-muted-foreground">IT band, quadricipiti, polpacci, schiena</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-600 mt-0.5">4</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold">Nutrizione (30 min)</h4>
                  <p className="text-sm text-muted-foreground">30-40g proteine + 0.5g/kg carboidrati entro 30 minuti</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Race Day Protocol */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Protocollo Giorno Gara
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600">-3h</Badge>
                  Pasto Pre-Gara
                </h4>
                <p className="text-sm text-muted-foreground ml-14">
                  Carboidrati complessi + proteine magre. Evita fibre eccessive e grassi pesanti.
                  <br />Esempio: riso basmati + pollo + verdure cotte
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600">-90min</Badge>
                  Idratazione
                </h4>
                <p className="text-sm text-muted-foreground ml-14">
                  500ml acqua + elettroliti. Piccoli sorsi ogni 15 minuti.
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600">-45min</Badge>
                  Mental Prep
                </h4>
                <p className="text-sm text-muted-foreground ml-14">
                  Visualizzazione circuito, box breathing (5 min), review track notes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600">-30min</Badge>
                  Physical Warmup
                </h4>
                <p className="text-sm text-muted-foreground ml-14">
                  Warmup completo (15 min) + activation drills specifici per moto.
                </p>
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Badge className="bg-red-600">-10min</Badge>
                  Final Check
                </h4>
                <p className="text-sm text-muted-foreground ml-14">
                  Reaction time drills, neck activation, focus cues (es: "smooth throttle, late apex").
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Red Flags - Quando Fermarsi */}
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Red Flags - Fermarsi Immediatamente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-semibold text-red-900">🚨 Dolore acuto/improvviso</p>
              <p className="text-red-700">Dolore sharp, localizzato, che peggiora con movimento. NON "spingi attraverso".</p>
            </div>
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-semibold text-red-900">🚨 Vertigini o nausea</p>
              <p className="text-red-700">Possibile iponatremia, ipoglicemia o sovrallenamento. Fermati e idratati.</p>
            </div>
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-semibold text-red-900">🚨 FC elevata a riposo (&gt;10% baseline)</p>
              <p className="text-red-700">Segno di sovrallenamento o infezione in arrivo. Rest day obbligatorio.</p>
            </div>
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-semibold text-red-900">🚨 HRV drop &gt;15% per 3+ giorni</p>
              <p className="text-red-700">Sistema nervoso stressato. Riduci volume/intensità immediatamente.</p>
            </div>
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-semibold text-red-900">🚨 Insonnia persistente</p>
              <p className="text-red-700">Overtraining classico. Settimana deload + sleep hygiene protocol.</p>
            </div>
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-semibold text-red-900">🚨 Performance drop inspiegabile</p>
              <p className="text-red-700">Lap time +2% senza motivo tecnico. Possibile fatigue cumulativa.</p>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Guidelines */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle>Linee Guida Recupero</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Sonno:</span>
                <span className="text-muted-foreground">8-9 ore/notte. Routine fissa. Camera buia e fresca (&lt;19°C).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Idratazione:</span>
                <span className="text-muted-foreground">35ml/kg peso corporeo. Più elettroliti se allenamento &gt;60 min.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Proteine:</span>
                <span className="text-muted-foreground">1.8-2.2g/kg/giorno. Distribuite in 4-5 pasti (30-40g/pasto).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Carboidrati:</span>
                <span className="text-muted-foreground">4-7g/kg/giorno. Più alto nei giorni allenamento intenso.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Deload:</span>
                <span className="text-muted-foreground">Ogni 3-4 settimane. Riduci volume del 40-50%, mantieni intensità.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Active Recovery:</span>
                <span className="text-muted-foreground">Walking, swimming leggero, yoga. &lt;60% FC max.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">📞 Contatti Emergenza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Team Doctor:</strong> Sempre disponibile giorno gara</p>
            <p><strong>Fisioterapista:</strong> Per infortuni acuti o dolori persistenti</p>
            <p><strong>Performance Coach:</strong> Per modifiche al programma allenamento</p>
            <p><strong>Nutrizionista:</strong> Per aggiustamenti dieta/integratori</p>
            <p className="mt-4 pt-4 border-t border-amber-200">
              <strong>Regola d'oro:</strong> Se hai dubbi, chiedi. Meglio un giorno di riposo in più che 2 mesi di infortunio.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
