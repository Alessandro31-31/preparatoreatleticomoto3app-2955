/**
 * Export PDF Utility
 *
 * Questa utility permette di esportare i dati di allenamento in formato PDF.
 *
 * Per implementare completamente:
 * 1. Installare: bun add jspdf jspdf-autotable
 * 2. Importare: import jsPDF from 'jspdf'
 * 3. Utilizzare le funzioni qui sotto
 */

interface ProgressData {
  biometrics?: any[];
  sessions?: any[];
  progressions?: any[];
  loads?: any[];
  routines?: any[];
  flags?: any[];
}

/**
 * Esporta report PDF completo con tutti i dati
 */
export async function exportProgressReport(data: ProgressData, userName: string = "Pilota") {
  // In una implementazione reale con jsPDF:

  /*
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('Moto3 Training Report', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Pilota: ${userName}`, 105, 25, { align: 'center' });
  doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 105, 32, { align: 'center' });

  let yPosition = 45;

  // Biometrics Section
  if (data.biometrics && data.biometrics.length > 0) {
    doc.setFontSize(16);
    doc.text('📊 Biometria', 20, yPosition);
    yPosition += 10;

    const weightData = data.biometrics.filter(b => b.weight);
    const hrvData = data.biometrics.filter(b => b.hrv);

    if (weightData.length > 0) {
      const latestWeight = weightData[0].weight;
      const avgWeight = weightData.reduce((sum, b) => sum + b.weight, 0) / weightData.length;

      doc.setFontSize(12);
      doc.text(`Peso attuale: ${latestWeight.toFixed(1)} kg`, 25, yPosition);
      yPosition += 7;
      doc.text(`Peso medio (30gg): ${avgWeight.toFixed(1)} kg`, 25, yPosition);
      yPosition += 10;
    }

    if (hrvData.length > 0) {
      const avgHRV = hrvData.reduce((sum, b) => sum + b.hrv, 0) / hrvData.length;
      doc.text(`HRV medio: ${avgHRV.toFixed(0)} ms`, 25, yPosition);
      yPosition += 10;
    }
  }

  // Sessions Section
  if (data.sessions && data.sessions.length > 0) {
    doc.setFontSize(16);
    doc.text('🏋️ Sessioni Allenamento', 20, yPosition);
    yPosition += 10;

    const completed = data.sessions.filter(s => s.completed).length;
    const total = data.sessions.length;
    const completionRate = (completed / total) * 100;

    doc.setFontSize(12);
    doc.text(`Sessioni completate: ${completed}/${total} (${completionRate.toFixed(0)}%)`, 25, yPosition);
    yPosition += 7;

    const avgLoad = data.sessions.reduce((sum, s) => sum + (s.load || 0), 0) / total;
    doc.text(`Carico medio: ${avgLoad.toFixed(0)}`, 25, yPosition);
    yPosition += 15;
  }

  // Progressions Section
  if (data.progressions && data.progressions.length > 0) {
    doc.setFontSize(16);
    doc.text('📈 Progressioni', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    data.progressions.slice(0, 10).forEach((prog) => {
      const percentage = prog.percentAchieved || 0;
      doc.text(
        `${prog.exerciseName}: ${percentage.toFixed(0)}% (${prog.actualWeight || prog.actualReps}/${prog.targetWeight || prog.targetReps})`,
        25,
        yPosition
      );
      yPosition += 6;
    });
  }

  // Save PDF
  doc.save(`moto3_training_report_${new Date().toISOString().split('T')[0]}.pdf`);
  */

  // Implementazione placeholder - crea un semplice alert
  const summary = generateTextSummary(data, userName);

  // Per ora mostra un alert con i dati
  alert(`📄 EXPORT PDF\n\n${summary}\n\nPer implementare il vero PDF:\n1. Installa jsPDF: bun add jspdf jspdf-autotable\n2. Decommentare il codice in src/lib/export-pdf.ts`);

  // Scarica come file di testo
  downloadTextFile(summary, `moto3_training_report_${new Date().toISOString().split('T')[0]}.txt`);
}

/**
 * Genera un riepilogo testuale dei dati
 */
function generateTextSummary(data: ProgressData, userName: string): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════');
  lines.push('  MOTO3 TRAINING REPORT');
  lines.push('═══════════════════════════════════════');
  lines.push(`Pilota: ${userName}`);
  lines.push(`Data: ${new Date().toLocaleDateString('it-IT')}`);
  lines.push('');

  // Biometrics
  if (data.biometrics && data.biometrics.length > 0) {
    lines.push('📊 BIOMETRIA');
    lines.push('───────────────────────────────────────');

    const weightData = data.biometrics.filter((b: any) => b.weight);
    if (weightData.length > 0) {
      const latest = weightData[0].weight;
      const avg = weightData.reduce((sum: number, b: any) => sum + b.weight, 0) / weightData.length;
      lines.push(`Peso attuale: ${latest.toFixed(1)} kg`);
      lines.push(`Peso medio (30gg): ${avg.toFixed(1)} kg`);
    }

    const hrvData = data.biometrics.filter((b: any) => b.hrv);
    if (hrvData.length > 0) {
      const avgHRV = hrvData.reduce((sum: number, b: any) => sum + b.hrv, 0) / hrvData.length;
      lines.push(`HRV medio: ${avgHRV.toFixed(0)} ms`);
    }
    lines.push('');
  }

  // Sessions
  if (data.sessions && data.sessions.length > 0) {
    lines.push('🏋️ SESSIONI ALLENAMENTO');
    lines.push('───────────────────────────────────────');
    const completed = data.sessions.filter((s: any) => s.completed).length;
    const total = data.sessions.length;
    lines.push(`Completate: ${completed}/${total} (${Math.round((completed/total)*100)}%)`);

    const avgLoad = data.sessions.reduce((sum: number, s: any) => sum + (s.load || 0), 0) / total;
    lines.push(`Carico medio: ${avgLoad.toFixed(0)}`);
    lines.push('');
  }

  // Progressions
  if (data.progressions && data.progressions.length > 0) {
    lines.push('📈 PROGRESSIONI');
    lines.push('───────────────────────────────────────');
    data.progressions.slice(0, 10).forEach((prog: any) => {
      const perc = prog.percentAchieved || 0;
      lines.push(`${prog.exerciseName}: ${perc.toFixed(0)}%`);
    });
    lines.push('');
  }

  // Red Flags
  if (data.flags && data.flags.length > 0) {
    const active = data.flags.filter((f: any) => !f.resolved);
    if (active.length > 0) {
      lines.push('🚩 BANDIERE ROSSE ATTIVE');
      lines.push('───────────────────────────────────────');
      active.slice(0, 5).forEach((flag: any) => {
        lines.push(`[${flag.severity.toUpperCase()}] ${flag.category}: ${flag.description}`);
      });
      lines.push('');
    }
  }

  lines.push('═══════════════════════════════════════');
  lines.push('Fine Report');

  return lines.join('\n');
}

/**
 * Scarica un file di testo
 */
function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Esporta dati in formato JSON
 */
export function exportDataJSON(data: any, filename: string = 'moto3_data') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
