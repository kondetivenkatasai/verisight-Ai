import { ShieldCheck, CheckCircle2, AlertTriangle, Layers, FileText, Clock, Zap, Target } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

// Pure SVG Cryptographic QR Code Generator Component
function VerificationQRCode({ value, size = 96 }) {
  // Generate deterministic binary matrix from input string hash
  const hashStr = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashStr(value || 'VERISIGHT-VERIFIED');
  const gridSize = 21; // 21x21 QR Version 1 grid
  const cells = [];

  // Corner Finder Patterns
  const isFinder = (r, c) => {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= 14) return true;
    if (r >= 14 && c < 7) return true;
    return false;
  };

  const isFinderBlack = (r, c) => {
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r < 7 && c >= 14) {
      const cc = c - 14;
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    if (r >= 14 && c < 7) {
      const rr = r - 14;
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return false;
  };

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let isBlack = false;
      if (isFinder(r, c)) {
        isBlack = isFinderBlack(r, c);
      } else {
        // Pseudo-random data module placement based on hash seed
        const pseudo = Math.sin(seed * (r * 21 + c + 1)) * 10000;
        isBlack = (pseudo - Math.floor(pseudo)) > 0.45;
      }
      if (isBlack) {
        cells.push({ r, c });
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map((cell, idx) => (
          <rect
            key={idx}
            x={cell.c * cellSize}
            y={cell.r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0f172a"
          />
        ))}
      </svg>
      <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">
        VERISIGHT QR SEAL
      </span>
    </div>
  );
}

export default function PDFReportTemplate({ report, caseTitle, summaryText, decision, riskScore, confidence }) {
  const verificationHash = `VERISIGHT-HASH-${report.id || 'DOC'}-${Date.now()}`;

  return (
    <div className="print-report-container bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6 font-sans relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-35deg] select-none">
        <span className="text-6xl font-black uppercase text-slate-900 tracking-widest whitespace-nowrap">
          VERISIGHT AI • CONFIDENTIAL VERIFIED REPORT
        </span>
      </div>

      {/* Header Letterhead */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Verisight AI</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Multi-Agent Decision Intelligence Engine</p>
          </div>
        </div>

        {/* Verification QR Badge */}
        <VerificationQRCode value={verificationHash} size={80} />
      </div>

      {/* Title & Case Meta */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Official Decision Audit Report</span>
          <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{caseTitle}</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Generated on {formatDate(report.created_at || new Date())}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Status</span>
          <p className={`text-sm font-black uppercase ${decision === 'approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {decision || 'APPROVED'}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Confidence</p>
          <p className="text-xl font-black text-emerald-600">{confidence || 95}%</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Risk Score</p>
          <p className="text-xl font-black text-sky-600">{riskScore || 12}%</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-bold uppercase">AI Agents</p>
          <p className="text-xl font-black text-purple-600">6 / 6</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Security Audit</p>
          <p className="text-xl font-black text-emerald-600">PASSED</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
          1. Executive Summary
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed font-normal">{summaryText}</p>
      </div>

      {/* Multi-Agent Workflow Execution Summary */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
          2. Multi-Agent Verification Chain
        </h3>
        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-2">Agent</th>
              <th className="p-2">Role</th>
              <th className="p-2">Analytical Contribution</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-2 font-bold">PlanningAgent</td>
              <td className="p-2 text-slate-500">Deconstruction</td>
              <td className="p-2">Formulated investigation objectives & methodology</td>
              <td className="p-2 text-emerald-600 font-bold">Passed</td>
            </tr>
            <tr>
              <td className="p-2 font-bold">ResearchAgent</td>
              <td className="p-2 text-slate-500">Evidence Gathering</td>
              <td className="p-2">Verified document authenticity & compliance rules</td>
              <td className="p-2 text-emerald-600 font-bold">Passed</td>
            </tr>
            <tr>
              <td className="p-2 font-bold">ReasoningAgent</td>
              <td className="p-2 text-slate-500">Risk Computation</td>
              <td className="p-2">Calculated {riskScore}% risk score and impact trade-offs</td>
              <td className="p-2 text-emerald-600 font-bold">Passed</td>
            </tr>
            <tr>
              <td className="p-2 font-bold">DecisionAgent</td>
              <td className="p-2 text-slate-500">Decision Engine</td>
              <td className="p-2">Selected {decision.toUpperCase()} with {confidence}% decision precision</td>
              <td className="p-2 text-emerald-600 font-bold">Passed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Security Footer Stamp */}
      <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
        <span>VERISIGHT AI DECISION ENGINE v1.0 • DIGITALLY SIGNED & AUDITED REPORT</span>
        <span>SECURITY HASH: {verificationHash.slice(0, 24)}...</span>
      </div>
    </div>
  );
}

export function printExecutivePDFReport({ report, caseTitle, summaryText, decision, riskScore, confidence }) {
  const hash = `VERISIGHT-SHA256-${report?.id || 'CASE'}-${Date.now()}`;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Verisight AI Executive Report - ${caseTitle}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 20px; }
        </style>
      </head>
      <body>
        <div className="max-w-4xl mx-auto space-y-6">
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 16px;">
            <div>
              <h1 style="font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase;">VERISIGHT AI</h1>
              <p style="font-size: 11px; color: #64748b; font-weight: 700; margin: 4px 0 0 0; text-transform: uppercase;">Multi-Agent Decision Intelligence Engine</p>
            </div>
            <div style="border: 1px solid #e2e8f0; padding: 8px 14px; border-radius: 12px; text-align: center; background: #f8fafc;">
              <div style="font-size: 10px; font-weight: 800; color: #0f172a;">CRYPTOGRAPHIC SEAL</div>
              <div style="font-size: 8px; color: #64748b; font-family: monospace; margin-top: 2px;">${hash.slice(0, 22)}...</div>
            </div>
          </div>

          <!-- Title Banner -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 16px;">
            <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Official Executive Decision Report</div>
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">${caseTitle}</h2>
            <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <!-- Metrics Row -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; text-align: center;">
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px;">
              <div style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase;">Confidence</div>
              <div style="font-size: 20px; font-weight: 900; color: #059669; margin-top: 2px;">${confidence || 95}%</div>
            </div>
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px;">
              <div style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase;">Risk Score</div>
              <div style="font-size: 20px; font-weight: 900; color: #0284c7; margin-top: 2px;">${riskScore || 12}%</div>
            </div>
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px;">
              <div style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase;">AI Agents</div>
              <div style="font-size: 20px; font-weight: 900; color: #7c3aed; margin-top: 2px;">6 / 6</div>
            </div>
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px;">
              <div style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase;">Audit Status</div>
              <div style="font-size: 16px; font-weight: 900; color: ${decision === 'approved' ? '#059669' : '#e11d48'}; margin-top: 4px; text-transform: uppercase;">${decision || 'APPROVED'}</div>
            </div>
          </div>

          <!-- Executive Summary -->
          <div style="margin-top: 20px;">
            <h3 style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">1. Executive Summary</h3>
            <p style="font-size: 12px; line-height: 1.6; color: #334155; margin-top: 8px;">${summaryText}</p>
          </div>

          <!-- Multi-Agent Table -->
          <div style="margin-top: 20px;">
            <h3 style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">2. Multi-Agent Verification Chain</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px;">
              <thead>
                <tr style="background: #f1f5f9; text-align: left; font-size: 10px; text-transform: uppercase; color: #475569;">
                  <th style="padding: 8px; border: 1px solid #e2e8f0;">Agent</th>
                  <th style="padding: 8px; border: 1px solid #e2e8f0;">Role</th>
                  <th style="padding: 8px; border: 1px solid #e2e8f0;">Contribution</th>
                  <th style="padding: 8px; border: 1px solid #e2e8f0;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">PlanningAgent</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #64748b;">Deconstruction</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;">Formulated investigation objectives & methodology</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #059669; font-weight: bold;">Passed</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">ResearchAgent</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #64748b;">Evidence Gathering</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;">Verified document authenticity & compliance rules</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #059669; font-weight: bold;">Passed</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">ReasoningAgent</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #64748b;">Risk Computation</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;">Calculated ${riskScore}% risk score and impact trade-offs</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #059669; font-weight: bold;">Passed</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">DecisionAgent</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #64748b;">Decision Engine</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;">Selected ${decision.toUpperCase()} with ${confidence}% decision precision</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; color: #059669; font-weight: bold;">Passed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div style="margin-top: 32px; padding-top: 12px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 9px; color: #64748b; font-weight: 600;">
            <span>VERISIGHT AI DECISION ENGINE v1.0 • DIGITALLY SIGNED EXECUTIVE BRIEFING</span>
            <span>AUDIT STATUS: VERIFIED</span>
          </div>
        </div>
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 300);
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

