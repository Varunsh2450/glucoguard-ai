import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json();

    if (!anthropic) {
      // Mock response for fallback
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ 
        reply: "I am currently in demo mode. Please administer glucose gel immediately and stay with the patient." 
      });
    }

    const { patientName, riskLevel, glucoseLevel, happening, caregiverAction } = contextData || {};

    const systemPrompt = `
      You are the GlucoGuard Emergency AI Assistant. 
      You are assisting a caregiver in real-time who is dealing with a patient experiencing a potentially dangerous glycemic event.
      
      CURRENT PATIENT CONTEXT:
      - Patient Name: ${patientName || 'Unknown'}
      - Computed Risk Level: ${riskLevel ? riskLevel.toUpperCase() : 'UNKNOWN'}
      - Glucose Level: ${glucoseLevel || 'Unknown'} mg/dL
      - Current Medial Status: ${happening || 'Unknown'}
      - Recommended Action: ${caregiverAction || 'Unknown'}

      INSTRUCTIONS:
      1. Give extremely concise, clear, and actionable medical first-aid advice for hypoglycemia.
      2. If the user asks what to do, prioritize steps like "administer 15g of fast-acting carbs", "use glucagon", or "call emergency services".
      3. Your tone must be calm, authoritative, and deeply empathetic but focused strictly on the medical emergency.
      4. Keep answers under 3 sentences for rapid reading during an emergency.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 250,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : 'No text response generated.';

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
