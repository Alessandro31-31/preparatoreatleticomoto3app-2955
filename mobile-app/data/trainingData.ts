
import { MorningRoutineItem, Exercise, WeekPlan } from '@/types/training';

export const defaultMorningRoutine: MorningRoutineItem[] = [
  { 
    id: '1', 
    title: 'Controllo peso corporeo', 
    completed: false,
    description: 'Pesati sempre alla stessa ora, dopo aver usato il bagno e prima di colazione. Variazioni superiori a 1kg possono indicare disidratazione o sovrallenamento.'
  },
  { 
    id: '2', 
    title: 'Misurazione HRV (Variabilità Frequenza Cardiaca)', 
    completed: false,
    description: 'Misura l\'HRV appena sveglio, ancora a letto. Valori bassi indicano stress o recupero incompleto. Usa sempre lo stesso dispositivo per coerenza.'
  },
  { 
    id: '3', 
    title: 'Valutazione rigidità muscolare', 
    completed: false,
    description: 'Scala 1-10: valuta collo, spalle, schiena, anche, gambe. Rigidità >6 richiede foam rolling extra e possibile riduzione intensità allenamento.'
  },
  { 
    id: '4', 
    title: 'Idratazione (500ml acqua + elettroliti)', 
    completed: false,
    description: 'Bevi 500ml di acqua con un pizzico di sale o elettroliti. Il corpo perde 300-500ml di liquidi durante la notte. Urina chiara = buona idratazione.'
  },
  { 
    id: '5', 
    title: 'Colazione bilanciata ad alto valore proteico', 
    completed: false,
    description: 'Carboidrati complessi (avena, pane integrale) + proteine (uova, yogurt greco) + grassi sani (noci, avocado). Mangia entro 30 min dal risveglio per attivare il metabolismo.'
  },
  { 
    id: '6', 
    title: 'Mobilità articolare mattutina', 
    completed: false, 
    time: 600,
    description: '10 minuti di movimenti controllati per risvegliare il sistema nervoso e preparare le articolazioni. Focus su anche, spalle e colonna vertebrale.'
  },
];

export const warmupExercises: Exercise[] = [
  { 
    id: 'w1', 
    name: 'Attivazione cardiovascolare progressiva', 
    duration: 300, 
    notes: '5 minuti - Inizia con jogging leggero, aumenta gradualmente l\'intensità fino al 60-70% della FC max. Obiettivo: aumentare temperatura corporea di 1-2°C e attivare il sistema cardiovascolare.'
  },
  { 
    id: 'w2', 
    name: 'Mobilizzazione cervicale multi-direzionale', 
    sets: 2, 
    reps: 10,
    notes: 'Rotazioni lente e controllate: destra-sinistra, su-giù, inclinazioni laterali. Essenziale per piloti Moto3 per la resistenza al carico cervicale in curva. Mantieni spalle rilassate.'
  },
  { 
    id: 'w3', 
    name: 'Circonduzione spalle e attivazione cuffia rotatori', 
    sets: 2, 
    reps: 15,
    notes: 'Cerchi ampi avanti e indietro. Poi rotazioni interne/esterne con gomiti a 90°. Previene infortuni alla spalla durante le cadute e migliora il controllo del manubrio.'
  },
  { 
    id: 'w4', 
    name: 'Mobilità bacino e attivazione core', 
    sets: 2, 
    reps: 10,
    notes: 'Rotazioni del bacino in piedi, poi cat-cow a terra. Fondamentale per il trasferimento di peso in moto e la stabilità in sella. Mantieni addominali attivi.'
  },
  { 
    id: 'w5', 
    name: 'Affondi dinamici con rotazione del busto', 
    sets: 2, 
    reps: 10,
    notes: '10 per lato. Affondo in avanti + rotazione del busto verso la gamba avanzata. Attiva catena cinetica completa, simula il movimento di entrata in curva. Mantieni ginocchio allineato.'
  },
  { 
    id: 'w6', 
    name: 'Squat a corpo libero con enfasi eccentrica', 
    sets: 2, 
    reps: 15,
    notes: 'Scendi in 3 secondi, sali in 1 secondo. Attiva quadricipiti, glutei e core. Simula la posizione di guida e prepara le gambe alle sollecitazioni in frenata.'
  },
  { 
    id: 'w7', 
    name: 'Plank dinamico con alternanza braccia', 
    duration: 60, 
    notes: '2 serie da 30 secondi. Alterna sollevamento braccia mantenendo bacino stabile. Attiva core profondo, essenziale per stabilità in sella e resistenza alla fatica.'
  },
  { 
    id: 'w8', 
    name: 'Jumping jacks e skip sul posto', 
    duration: 60, 
    notes: '30 sec jumping jacks + 30 sec skip alto. Attivazione neuromuscolare finale, prepara il sistema nervoso a movimenti esplosivi. Aumenta frequenza cardiaca al 75-80% FC max.'
  },
];

export const cooldownExercises: Exercise[] = [
  { 
    id: 'c1', 
    name: 'Decelerazione cardiovascolare progressiva', 
    duration: 300, 
    notes: '5 minuti - Camminata o pedalata leggera. Riduci gradualmente l\'intensità dal 60% al 40% FC max. Favorisce rimozione lattato e metaboliti, previene accumulo di sangue negli arti inferiori.'
  },
  { 
    id: 'c2', 
    name: 'Respirazione diaframmatica e reset parasimpatico', 
    duration: 180, 
    notes: '3 minuti - Respiri profondi 4-7-8 (inspira 4 sec, trattieni 7 sec, espira 8 sec). Attiva sistema nervoso parasimpatico, riduce cortisolo, accelera recupero. Esegui seduto o sdraiato.'
  },
  { 
    id: 'c3', 
    name: 'Stretching statico catena posteriore gambe', 
    duration: 120,
    notes: '2 minuti - Quadricipiti, ischiocrurali, polpacci. Mantieni ogni posizione 30-40 sec senza rimbalzi. Riduce tensione muscolare post-allenamento, migliora flessibilità. Intensità 5-6/10.'
  },
  { 
    id: 'c4', 
    name: 'Decompressione colonna e stretching dorsali', 
    duration: 120,
    notes: '2 minuti - Child pose, cat-cow lento, torsioni spinali supine. Allevia compressione vertebrale da posizione di guida. Respira profondamente in ogni posizione.'
  },
  { 
    id: 'c5', 
    name: 'Release tensione cervicale e spalle', 
    duration: 120,
    notes: '2 minuti - Stretching trapezi, scaleni, pettorali. Contrasta le tensioni da posizione di guida. Usa mano opposta per aumentare delicatamente lo stretch. No dolore, solo tensione piacevole.'
  },
  { 
    id: 'c6', 
    name: 'Elevazione gambe e drenaggio linfatico', 
    duration: 180,
    notes: '3 minuti - Sdraiato con gambe al muro a 90°. Favorisce ritorno venoso, riduce gonfiore, accelera recupero. Respira lentamente e rilassa completamente i muscoli.'
  },
];

export const stretchingExercises: Exercise[] = [
  { 
    id: 's1', 
    name: 'Stretching quadricipiti in piedi', 
    duration: 60, 
    notes: '30 sec per lato - In piedi, porta tallone al gluteo. Mantieni ginocchia unite e bacino neutro. Senti lo stretch nella parte anteriore della coscia. Essenziale per piloti: previene rigidità da posizione di guida.'
  },
  { 
    id: 's2', 
    name: 'Stretching ischiocrurali (hamstring) seduto', 
    duration: 60, 
    notes: '30 sec per lato - Seduto, gamba tesa, piega in avanti dal bacino. Mantieni schiena dritta. Migliora flessibilità posteriore coscia, riduce rischio stiramenti, migliora posizione in sella.'
  },
  { 
    id: 's3', 
    name: 'Stretching adduttori (farfalla e spaccata laterale)', 
    duration: 60, 
    notes: '30 sec per posizione - Farfalla seduto + affondo laterale. Fondamentale per mobilità anche e grip con le gambe. Migliora stabilità laterale in moto.'
  },
  { 
    id: 's4', 
    name: 'Stretching glutei (figura 4 supina)', 
    duration: 60, 
    notes: '30 sec per lato - Sdraiato, caviglia su ginocchio opposto, tira coscia verso petto. Allevia tensione da posizione seduta prolungata. Previene dolore lombare.'
  },
  { 
    id: 's5', 
    name: 'Stretching flessori anca (affondo basso)', 
    duration: 60, 
    notes: '30 sec per lato - Affondo con ginocchio posteriore a terra, spingi bacino avanti. Contrasta accorciamento da posizione di guida. Migliora estensione anca e potenza in accelerazione.'
  },
  { 
    id: 's6', 
    name: 'Stretching dorsali e gran dorsale', 
    duration: 60, 
    notes: '30 sec per lato - Braccia tese sopra la testa, inclinazione laterale. Poi child pose esteso. Decomprime colonna, migliora respirazione, riduce tensione da posizione piegata.'
  },
  { 
    id: 's7', 
    name: 'Stretching pettorali (angolo muro)', 
    duration: 60, 
    notes: '30 sec per lato - Braccio al muro a 90°, ruota corpo opposto. Contrasta chiusura spalle da guida. Migliora postura e capacità respiratoria.'
  },
  { 
    id: 's8', 
    name: 'Stretching trapezi e elevatori scapola', 
    duration: 60, 
    notes: '30 sec per lato - Inclina testa lateralmente, mano opposta tira delicatamente. Allevia tensione cervicale da casco e forze G. Essenziale per piloti.'
  },
  { 
    id: 's9', 
    name: 'Stretching cervicale multi-direzionale', 
    duration: 60, 
    notes: '15 sec per direzione - Flessione, estensione, rotazioni, inclinazioni. Movimenti lenti e controllati. Mantiene mobilità cervicale cruciale per visibilità in pista.'
  },
  { 
    id: 's10', 
    name: 'Stretching polsi, avambracci e mani', 
    duration: 60, 
    notes: '30 sec per lato - Estensione e flessione polso, rotazioni. Previene tendiniti da grip manubrio. Migliora sensibilità e controllo comandi.'
  },
  { 
    id: 's11', 
    name: 'Stretching catena laterale (banana stretch)', 
    duration: 60, 
    notes: '30 sec per lato - Sdraiato, allunga braccio e gamba stesso lato. Migliora flessibilità laterale, importante per inclinazione in curva.'
  },
  { 
    id: 's12', 
    name: 'Torsioni spinali supine (spinal twist)', 
    duration: 60, 
    notes: '30 sec per lato - Sdraiato, ginocchia piegate, ruota bacino lateralmente. Mobilizza colonna vertebrale, allevia tensioni da torsioni ripetute in pista.'
  },
];

export const foamRollingExercises: Exercise[] = [
  { 
    id: 'f1', 
    name: 'Foam rolling quadricipiti (rilascio miofasciale anteriore coscia)', 
    duration: 90, 
    notes: '45 sec per lato - Prono, roller sotto coscia. Rotola lentamente da anca a ginocchio. Fermati sui trigger points 20-30 sec. Intensità 6-7/10. Riduce rigidità da posizione di guida, migliora flessibilità.'
  },
  { 
    id: 'f2', 
    name: 'Foam rolling ischiocrurali (hamstring release)', 
    duration: 90, 
    notes: '45 sec per lato - Seduto, roller sotto coscia posteriore. Solleva bacino e rotola. Previene stiramenti, migliora flessibilità. Fondamentale per piloti con posizione aggressiva.'
  },
  { 
    id: 'f3', 
    name: 'Foam rolling IT band (banda ileotibiale)', 
    duration: 90, 
    notes: '45 sec per lato - Laterale, roller sotto coscia esterna. Può essere intenso: respira profondamente. Previene sindrome IT band e dolore ginocchio. Essenziale per piloti.'
  },
  { 
    id: 'f4', 
    name: 'Foam rolling glutei e piriforme', 
    duration: 90, 
    notes: '45 sec per lato - Seduto su roller, inclinato 45°. Rotola lentamente. Allevia tensione da posizione seduta, previene sciatica. Migliora mobilità anca.'
  },
  { 
    id: 'f5', 
    name: 'Foam rolling dorsali e gran dorsale', 
    duration: 90, 
    notes: '45 sec per lato - Supino, roller sotto schiena media-alta. Braccia incrociate o sopra testa. Decomprime colonna, migliora postura. Allevia tensione da posizione piegata.'
  },
  { 
    id: 'f6', 
    name: 'Foam rolling polpacci (gastrocnemio e soleo)', 
    duration: 90, 
    notes: '45 sec per lato - Seduto, roller sotto polpaccio. Solleva bacino e rotola. Previene crampi, migliora circolazione. Importante per controllo pedane.'
  },
  { 
    id: 'f7', 
    name: 'Foam rolling adduttori (interno coscia)', 
    duration: 90, 
    notes: '45 sec per lato - Prono, gamba laterale, roller sotto interno coscia. Movimenti lenti. Migliora grip con gambe, previene stiramenti adduttori.'
  },
  { 
    id: 'f8', 
    name: 'Foam rolling toracica (upper back)', 
    duration: 90, 
    notes: '90 sec - Supino, roller sotto scapole. Braccia incrociate, solleva bacino. Rotola su/giù. Migliora mobilità toracica, essenziale per respirazione e postura.'
  },
];

export const mobilityExercises: Exercise[] = [
  { 
    id: 'm1', 
    name: 'Mobilità anche - 90/90 Hip Stretch', 
    duration: 120, 
    notes: '60 sec per lato - Seduto, gamba anteriore e posteriore a 90°. Ruota bacino avanti/indietro. Migliora rotazione interna/esterna anca. Fondamentale per cambio direzione rapido in moto.'
  },
  { 
    id: 'm2', 
    name: 'Mobilità toracica - Thread the Needle', 
    duration: 90, 
    notes: '45 sec per lato - A quattro zampe, passa braccio sotto il corpo ruotando. Migliora rotazione toracica, essenziale per guardare in curva e check spalle.'
  },
  { 
    id: 'm3', 
    name: 'Mobilità caviglia - Ankle Rocks', 
    duration: 90, 
    notes: '45 sec per lato - Affondo, ginocchio oltre punta piede. Oscillazioni avanti/indietro. Migliora dorsiflessione caviglia, importante per controllo pedane e stabilità.'
  },
  { 
    id: 'm4', 
    name: 'Mobilità spalla - Wall Slides', 
    duration: 90, 
    notes: '90 sec - Schiena al muro, braccia a W, scorri verso l\'alto. Mantieni contatto muro. Migliora mobilità scapolare e overhead, previene impingement spalla.'
  },
  { 
    id: 'm5', 
    name: 'Mobilità colonna - Cat-Cow Flow', 
    duration: 120, 
    notes: '2 minuti - A quattro zampe, alterna flessione/estensione colonna. Sincronizza con respiro. Mobilizza tutte le vertebre, allevia rigidità da posizione di guida.'
  },
  { 
    id: 'm6', 
    name: 'Mobilità anche - Cossack Squat', 
    duration: 90, 
    notes: '45 sec per lato - Squat laterale profondo, gamba opposta tesa. Migliora mobilità anche multi-direzionale. Simula movimenti di trasferimento peso in moto.'
  },
  { 
    id: 'm7', 
    name: 'Mobilità polso - Wrist Circles & Flexion', 
    duration: 60, 
    notes: '60 sec totali - Rotazioni, flessioni, estensioni. Mani in preghiera e reverse. Previene tunnel carpale, migliora grip e sensibilità manubrio.'
  },
  { 
    id: 'm8', 
    name: 'Mobilità cervicale - Controlled Articular Rotations (CARs)', 
    duration: 90, 
    notes: '90 sec - Rotazioni lente e controllate esplorando tutto il range di movimento. Migliora propriocezione cervicale, essenziale per piloti con carichi elevati sul collo.'
  },
  { 
    id: 'm9', 
    name: 'Mobilità anche - Hip Airplanes', 
    duration: 90, 
    notes: '45 sec per lato - In piedi su una gamba, ruota anca sollevata interno/esterno. Migliora controllo rotazionale anca, stabilità e equilibrio.'
  },
  { 
    id: 'm10', 
    name: 'Mobilità globale - World\'s Greatest Stretch', 
    duration: 120, 
    notes: '60 sec per lato - Affondo + rotazione + reach. Combina mobilità anche, toracica e spalle. Stretch completo per piloti, attiva catena cinetica completa.'
  },
];

export const quickReference = {
  hydration: 'Bere almeno 3L di acqua al giorno. Aumentare durante allenamenti intensi.',
  nutrition: 'Carboidrati: 6-8g/kg, Proteine: 1.6-2g/kg, Grassi: 1g/kg',
  sleep: 'Minimo 8 ore per notte. Mantenere orari regolari.',
  recovery: 'Almeno 1 giorno di riposo completo a settimana.',
  redFlags: 'Dolore persistente, affaticamento estremo, calo prestazioni, disturbi del sonno.',
};
