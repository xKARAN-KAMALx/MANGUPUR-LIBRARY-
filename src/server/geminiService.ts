import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface GroundingSource {
  title: string;
  url: string;
}

export async function getTransitAndLocationGuide(origin: string, userLat?: number, userLng?: number) {
  if (!ai) {
    return {
      text: "Mangupur Library is conveniently located in Mangupur, Bharthana, Etawah, Uttar Pradesh (Pin 206242), approximately 4-5 km from Bharthana Railway Station. Frequent autos, e-rickshaws, and private bikes connect Bharthana main market, Usrahar road, and Etawah city directly to Mangupur village.",
      sources: [
        {
          title: "Mangupur Library on Google Maps",
          url: "https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
        }
      ]
    };
  }

  try {
    const prompt = `You are the local travel and directions guide for MANGUPUR LIBRARY, located in Mangupur, Bharthana, Etawah, Uttar Pradesh, India (Google Maps: https://maps.app.goo.gl/CSsLMCseLBrxoKgL9).
The user is asking for travel directions / route information from: "${origin || 'Bharthana Railway Station / Etawah'}".
Provide concise, clear, and practical road travel guidance (distance, landmarks, local conveyance like auto/bus/bike, landmark near Bharthana / Mangupur, road conditions).
Keep it helpful for rural students traveling to the library for study.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (userLat && userLng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLat,
            longitude: userLng,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    const sources: GroundingSource[] = [
      {
        title: "Mangupur Library Google Maps Pin",
        url: "https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
      }
    ];

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.maps?.uri) {
          sources.push({
            title: chunk.maps.title || 'Google Maps Location',
            url: chunk.maps.uri,
          });
        }
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Search Reference',
            url: chunk.web.uri,
          });
        }
      }
    }

    return {
      text: response.text || "Directions available via Google Maps link.",
      sources,
    };
  } catch (error) {
    console.error("Gemini Maps Grounding Error:", error);
    return {
      text: `From ${origin || 'Bharthana'}, take the road heading towards Mangupur village. It is easily reachable within 15 minutes by auto-rickshaw or two-wheeler from Bharthana Railway Station / Bus Stand. Contact Incharge Karan Kamal at 9870931288 if you need route assistance.`,
      sources: [
        {
          title: "Mangupur Library on Google Maps",
          url: "https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
        }
      ]
    };
  }
}

export async function getExamAlertsAndStudyUpdates(examQuery: string) {
  if (!ai) {
    return {
      text: "Recent competitive exam announcements for UP candidates include UP Police Constable re-exam updates, UPSSSC PET, SSC CGL/GD notifications, and Railway RRB announcements. Check official recruitment portals (uppbpb.gov.in, upsssc.gov.in, ssc.gov.in).",
      sources: [
        {
          title: "UP Police Recruitment Board (Official)",
          url: "https://uppbpb.gov.in"
        },
        {
          title: "Staff Selection Commission (Official)",
          url: "https://ssc.gov.in"
        }
      ]
    };
  }

  try {
    const prompt = `You are an academic counsellor for self-study students at Mangupur Library in Bharthana, Etawah, UP.
Provide the latest real-time verified exam updates, exam dates, syllabus updates, or notification alerts for Indian competitive exams focusing on: "${examQuery || 'UP Police Constable, UPSSSC, SSC CGL, Railway RRB'}".
Keep it crisp, actionable, bulleted, and encourage students to stay focused during their library self-study hours.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Official Exam Information',
            url: chunk.web.uri,
          });
        }
      }
    }

    return {
      text: response.text || "Visit official portals for detailed exam notifications.",
      sources,
    };
  } catch (error) {
    console.error("Gemini Search Grounding Error:", error);
    return {
      text: "Regular preparation continues at Mangupur Library for UP Police, SSC, Teaching, and Railway examinations. Speak to library incharge Karan Kamal or fellow aspirants for combined study resources.",
      sources: []
    };
  }
}
