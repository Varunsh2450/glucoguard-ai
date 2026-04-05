import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';

// Initialize Anthropic conditionally
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Gmail SMTP transporter
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') // strip spaces from app password
    }
  });
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      patientName,
      glucoseLevel,
      lastMealTime,
      insulinTaken,
      activityLevel,
      isAlone,
      caregiverEmail
    } = data;

    let riskLevel = 'medium';
    let happening = '';
    let caregiverAction = '';
    let context = '';
    let detailedPatientSummary = '';

    // Mock response if no Anthropic API key
    if (!anthropic) {
      const glucose = parseFloat(glucoseLevel);
      if (glucose < 55) {
        riskLevel = 'high';
        happening = `${patientName} is experiencing severe hypoglycemia.`;
        caregiverAction = 'Call emergency services immediately. Ensure the patient is conscious and administer glucose gel or glucagon if prescribed.';
      } else if (glucose < 70) {
        riskLevel = 'medium';
        happening = `${patientName} has low blood sugar and is at risk of further drop.`;
        caregiverAction = 'Contact the patient immediately. Ensure they consume 15g of fast-acting carbs (e.g., juice) and retest in 15 minutes.';
      } else {
        riskLevel = 'low';
        happening = `${patientName}'s blood sugar is within a safe range.`;
        caregiverAction = 'No immediate action required, but continue normal monitoring.';
      }
      context = `Activity level: ${activityLevel}, Insulin taken: ${insulinTaken}, Alone: ${isAlone}.`;
      detailedPatientSummary = `Patient ${patientName} is currently presenting with a blood glucose level of ${glucoseLevel} mg/dL. The patient's last meal was reported as '${lastMealTime}'. Factors affecting current risk include their reported activity level (${activityLevel}) and recent insulin administration status (${insulinTaken}). Social context indicates the patient is ${isAlone === 'yes' ? 'currently alone without immediate physical support' : 'currently accompanied'}. The aggregate clinical trajectory points towards a ${riskLevel} risk of severe hypoglycemic deterioration, necessitating ${riskLevel === 'low' ? 'standard observation procedures' : 'immediate caregiver or medical intervention'}.`;
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      const prompt = `
        You are a medical risk analysis AI for a hypoglycemia caregiver alert system called GlucoGuard.
        Analyze the following real-time patient data and output a JSON object containing the risk assessment.
        
        Patient Name: ${patientName}
        Glucose Level: ${glucoseLevel} mg/dL
        Last Meal Time: ${lastMealTime}
        Insulin Taken Recently: ${insulinTaken}
        Activity Level: ${activityLevel}
        Is Patient Alone: ${isAlone}

        Classify risk level as exactly 'low', 'medium', or 'high'.
        Provide:
        1. "riskLevel": 'low' | 'medium' | 'high'
        2. "happening": A clear 1-2 sentence description of what is happening medically.
        3. "caregiverAction": What the caregiver should do RIGHT NOW.
        4. "context": The pattern context leading to this based on the inputs.
        5. "detailedPatientSummary": A comprehensive, formal medical description of the patient's current state (3-4 sentences) suitable for a doctor's report.
        
        Output valid JSON only: 
        { "riskLevel": "...", "happening": "...", "caregiverAction": "...", "context": "...", "detailedPatientSummary": "..." }
      `;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 400,
        temperature: 0.1,
        system: 'You are a precise medical assistant returning only valid JSON.',
        messages: [{ role: 'user', content: prompt }]
      });

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
      const parsed = JSON.parse(responseText);

      riskLevel = parsed.riskLevel;
      happening = parsed.happening;
      caregiverAction = parsed.caregiverAction;
      context = parsed.context;
      detailedPatientSummary = parsed.detailedPatientSummary;
    }

    // ── Send Gmail SMTP alert ──────────────────────────────────────────
    let emailSent = false;
    let emailError = null;

    const transporter = createTransporter();

    if (transporter && caregiverEmail && (riskLevel === 'high' || riskLevel === 'medium')) {
      const riskColor   = riskLevel === 'high' ? '#ef4444' : '#f97316';
      const riskEmoji   = riskLevel === 'high' ? '🚨' : '⚠️';
      const riskBg      = riskLevel === 'high' ? '#450a0a' : '#431407';

      try {
        await transporter.sendMail({
          from: `"GlucoGuard Alert System" <${process.env.GMAIL_USER}>`,
          to: caregiverEmail,
          subject: `${riskEmoji} URGENT: GlucoGuard ${riskLevel.toUpperCase()} RISK Alert — ${patientName}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f8fafc;border-radius:16px;overflow:hidden;border:1px solid ${riskColor}40;">

              <!-- HEADER -->
              <div style="background:linear-gradient(135deg,${riskBg},#0f172a);border-bottom:2px solid ${riskColor};padding:32px 40px;">
                <p style="margin:0 0 8px;font-size:11px;color:${riskColor};font-weight:700;text-transform:uppercase;letter-spacing:3px;">⚡ GlucoGuard AI Alert System</p>
                <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;">${riskEmoji} ${riskLevel.toUpperCase()} RISK DETECTED</h1>
                <p style="margin:8px 0 0;font-size:14px;color:#94a3b8;">Immediate attention may be required for <strong style="color:#fff;">${patientName}</strong></p>
              </div>

              <!-- GLUCOSE READING -->
              <div style="padding:28px 40px 0;">
                <div style="background:${riskColor}15;border:1px solid ${riskColor}40;border-radius:12px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                  <div>
                    <p style="margin:0 0 4px;font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Current Glucose Reading</p>
                    <p style="margin:0;font-size:42px;font-weight:900;color:${riskColor};font-family:monospace;letter-spacing:-2px;">${glucoseLevel} <span style="font-size:18px;color:#94a3b8;font-weight:400;">mg/dL</span></p>
                  </div>
                  <div style="background:${riskColor};border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:28px;">${riskEmoji}</div>
                </div>

                <!-- CURRENT CONDITION -->
                <div style="margin-bottom:20px;">
                  <p style="margin:0 0 8px;font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Current Condition</p>
                  <p style="margin:0;font-size:15px;color:#e2e8f0;line-height:1.6;background:rgba(255,255,255,0.04);padding:16px;border-radius:10px;border-left:3px solid #475569;">${happening}</p>
                </div>

                <!-- ACTION -->
                <div style="background:${riskColor}20;border:1px solid ${riskColor}50;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
                  <p style="margin:0 0 8px;font-size:11px;color:${riskColor};font-weight:700;text-transform:uppercase;letter-spacing:2px;">🏃 ACTION REQUIRED NOW</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#fff;line-height:1.5;">${caregiverAction}</p>
                </div>

                <!-- CLINICAL SUMMARY -->
                <div style="margin-bottom:20px;">
                  <p style="margin:0 0 8px;font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:2px;">📋 Clinical Assessment</p>
                  <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;background:rgba(255,255,255,0.03);padding:16px;border-radius:10px;">${detailedPatientSummary}</p>
                </div>

                <!-- PARAMETERS -->
                <div style="border-top:1px solid rgba(255,255,255,0.08);padding:20px 0;">
                  <p style="margin:0 0 6px;font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Vitals Parameters</p>
                  <p style="margin:0;font-size:13px;color:#64748b;font-family:monospace;">${context}</p>
                  <p style="margin:8px 0 0;font-size:12px;color:#475569;">Last meal: ${lastMealTime} &nbsp;·&nbsp; Patient alone: ${isAlone}</p>
                </div>
              </div>

              <!-- FOOTER -->
              <div style="background:rgba(0,0,0,0.4);padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0;font-size:12px;color:#475569;">Sent by <strong style="color:#2dd4bf;">GlucoGuard</strong> · AI-Powered Hypoglycemia Alert System · Do not reply to this email</p>
              </div>
            </div>
          `
        });
        emailSent = true;
      } catch (err: any) {
        console.error('Gmail SMTP Error:', err.message);
        emailError = err.message;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        riskLevel,
        happening,
        caregiverAction,
        context,
        detailedPatientSummary,
        emailSent,
        emailError
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process risk analysis' },
      { status: 500 }
    );
  }
}
