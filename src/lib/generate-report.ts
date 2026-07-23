type Condition = {
  name: string;
  cause: string;
  urgency: string;
  nextSteps: string;
};

type ReportData = {
  userName: string;
  userEmail: string;
  gender: string;
  age: number;
  symptoms: string;
  conditions: Condition[];
  timestamp: Date;
  healthScore?: number;
};

function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case "critical": return "#dc2626";
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#16a34a";
    default: return "#6b7280";
  }
}

export function generateHealthReport(data: ReportData): void {
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>LaVida Health Report - ${data.userName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #1A7F0A; }
        .logo { font-size: 32px; font-weight: bold; color: #1A7F0A; }
        .subtitle { color: #6b7280; margin-top: 8px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1A7F0A; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
        .info-item { padding: 12px; background: #f9fafb; border-radius: 8px; }
        .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { font-size: 16px; font-weight: 600; margin-top: 4px; }
        .condition-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 15px; page-break-inside: avoid; }
        .condition-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .condition-name { font-size: 16px; font-weight: bold; }
        .urgency-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; color: white; text-transform: uppercase; }
        .condition-detail { margin-bottom: 10px; }
        .detail-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .detail-value { font-size: 14px; }
        .score-circle { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 32px; font-weight: bold; }
        .disclaimer { margin-top: 40px; padding: 20px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; font-size: 12px; color: #92400e; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
        @media print { body { padding: 20px; } .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">LaVida Health Report</div>
        <div class="subtitle">AI-Powered Health Analysis</div>
        <div class="subtitle" style="margin-top: 5px;">Generated on ${data.timestamp.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>

      <div class="section">
        <div class="section-title">Patient Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${data.userName || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${data.userEmail || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Gender</div>
            <div class="info-value">${data.gender}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Age</div>
            <div class="info-value">${data.age} years</div>
          </div>
        </div>
      </div>

      ${data.healthScore !== undefined ? `
      <div class="section">
        <div class="section-title">Health Score</div>
        <div class="score-circle" style="background: ${data.healthScore >= 70 ? "#dcfce7" : data.healthScore >= 40 ? "#fef3c7" : "#fee2e2"}; color: ${data.healthScore >= 70 ? "#16a34a" : data.healthScore >= 40 ? "#d97706" : "#dc2626"};">
          ${data.healthScore}
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          ${data.healthScore >= 70 ? "Good Health Status" : data.healthScore >= 40 ? "Fair - Consider Follow-up" : "Needs Attention"}
        </p>
      </div>
      ` : ""}

      <div class="section">
        <div class="section-title">Reported Symptoms</div>
        <p style="padding: 15px; background: #f9fafb; border-radius: 8px; font-size: 14px;">${data.symptoms}</p>
      </div>

      <div class="section">
        <div class="section-title">AI Analysis - ${data.conditions.length} Conditions Identified</div>
        ${data.conditions.map((condition, index) => `
          <div class="condition-card">
            <div class="condition-header">
              <span class="condition-name">${index + 1}. ${condition.name}</span>
              <span class="urgency-badge" style="background-color: ${getUrgencyColor(condition.urgency)};">${condition.urgency}</span>
            </div>
            <div class="condition-detail">
              <div class="detail-label">Potential Cause</div>
              <div class="detail-value">${condition.cause}</div>
            </div>
            <div class="condition-detail">
              <div class="detail-label">Recommended Next Steps</div>
              <div class="detail-value">${condition.nextSteps}</div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="disclaimer">
        <strong>Medical Disclaimer:</strong> This report is generated by an AI system and is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, call your doctor or emergency services immediately.
      </div>

      <div class="footer">
        <p>Generated by LaVida Health Buddy | ${new Date().getFullYear()}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
