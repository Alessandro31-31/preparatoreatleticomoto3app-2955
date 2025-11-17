import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VirtualCoach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'coach'; content: string }>>([
    {
      role: 'coach',
      content: 'Ciao! Sono Coach AI Pro, specializzato in Moto3 con 15+ anni di esperienza. Come posso aiutarti oggi con il tuo allenamento o la tua performance in pista?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Come migliorare la posizione in curva?',
    'Esercizi per la forza delle braccia',
    'Strategia mentale pre-gara',
    'Analisi del mio ultimo lap time',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { role: 'coach', content: response }]);
    }, 1000);

    setInput('');
  };

  const generateResponse = (question: string) => {
    const lower = question.toLowerCase();

    if (lower.includes('curva') || lower.includes('corner')) {
      return '🏍️ Ottima domanda sulla tecnica in curva!\n\nPunti chiave:\n1. **Body Position**: Sposta il peso verso l\'interno, tieni i gomiti alti\n2. **Brake Point**: Frena più tardi progressivamente, non tutto in una volta\n3. **Apex Targeting**: Guarda dove vuoi andare, non dove sei\n4. **Throttle Control**: Apertura progressiva in uscita\n\nEsercizi consigliati:\n- Plank laterale per core stability (3x45s)\n- Rotazioni torso con resistance band\n- Simulazioni postura specifica\n\nVuoi approfondire un aspetto specifico?';
    }

    if (lower.includes('braccia') || lower.includes('arms') || lower.includes('forza')) {
      return '💪 Per migliorare la forza delle braccia specifica per Moto3:\n\n**Programma 3x/settimana:**\n1. Farmer Carry - 4x40m (grip strength)\n2. Dead Hang - 3x max time\n3. TRX Row - 4x12\n4. Wrist Roller - 3x5 up/down\n5. Forearm Plank - 3x60s\n\n**Tips:**\n- RPE 7-8 per costruire resistenza\n- Rest 60-90s tra le serie\n- Combina con stretching polsi/avambracci\n\n🎯 Obiettivo: resistere 20+ giri senza pump!';
    }

    if (lower.includes('mental') || lower.includes('gara') || lower.includes('race')) {
      return '🧠 Preparazione mentale pre-gara - Protocollo Champion:\n\n**-60 min:**\n- Meditation 10min (box breathing)\n- Visualizza circuito lap perfetto\n\n**-30 min:**\n- Warm-up fisico specifico\n- Activation exercises\n\n**-10 min:**\n- Mantra personale\n- Focus su processo, non risultato\n- "Controllo solo ciò che posso controllare"\n\n**On Grid:**\n- Respira profondamente\n- Visualizza prima curva\n- Senti la moto, non pensare\n\n💡 Ricorda: Ansia = Eccitazione mal interpretata!';
    }

    if (lower.includes('lap') || lower.includes('tempo') || lower.includes('time')) {
      return '⏱️ Analisi Lap Time:\n\nPer migliorare i tuoi tempi:\n\n1. **Consistency First** - Prima costanza, poi velocità\n   - Target: ±0.3s tra i giri\n\n2. **Sector Analysis**\n   - Identifica settore più debole\n   - Focus su 1 settore alla volta\n\n3. **Reference Points**\n   - Brake markers precisi\n   - Apex targeting\n   - Throttle opening points\n\n4. **Data Review**\n   - Confronta con piloti reference\n   - Telemetria: speed traces, throttle%, brake pressure\n\n📊 Usa il Lap Simulator per analisi dettagliata!';
    }

    return `Interessante domanda! Come Coach AI, posso aiutarti con:\n\n✅ Tecnica di guida\n✅ Programmi allenamento\n✅ Strategia mentale\n✅ Analisi performance\n✅ Recovery & nutrition\n✅ Bike setup feedback\n\nPuoi essere più specifico sulla tua richiesta? Ad esempio:\n- "Come migliorare il brake point al turn 3?"\n- "Esercizi per resistenza in gara di 20 giri"\n- "Routine pre-qualifying"`;
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white px-6 pt-8 pb-6">
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
            <Sparkles className="w-8 h-8" />
            Virtual Coach AI
          </h1>
          <p className="text-purple-100">15+ anni esperienza Moto3</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto">
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Coach AI Pro</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">Moto3 Specialist</Badge>
                  <Badge variant="outline">Online</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white ml-auto'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Domande rapide:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(prompt);
                  setTimeout(handleSend, 100);
                }}
                className="text-xs h-auto py-2"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Scrivi la tua domanda..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[60px]"
          />
          <Button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
