import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json();

    if (!genAI) {
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    // Format previous messages for Gemini
    const historyLines = messages.map((m: any) => 
      `${m.role === 'user' ? 'Caregiver' : 'You'}: ${m.content}`
    );
    const finalPrompt = `Here is the conversation history:\n${historyLines.join('\n')}\n\nPlease respond to the latest Caregiver message.`;

    const response = await model.generateContent(finalPrompt);
    const reply = response.response.text();

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
