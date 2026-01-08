import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

import { identity, experience, projects } from "@/lib/data";

const SYSTEM_CONTEXT = `
You are an AI Assistant for ${identity.name}, a ${identity.title}.
Your goal is to help recruiters and visitors understand ${identity.name}'s skills, projects, and experience.

**${identity.name}'s Profile Context:**
- **Role**: ${identity.title}
- **Location**: ${identity.location}
- **Tagline**: "Bridging Intelligent Systems with Real-World Deployment."
- **Key Skills**: AI, Computer Vision, NLP, Generative AI, Python, TensorFlow, PyTorch.
- **Experience**:
${experience.map(e => `  - **${e.org}**: ${e.roles.map(r => `${r.title} (${r.time})`).join(", ")}`).join("\n")}
- **Projects**:
${projects.map(p => `  - **${p.title}**: ${p.desc} (Tech: ${p.tags.map(t => t.name).join(", ")})`).join("\n")}

**Guidelines:**
- Be professional, enthusiastic, and concise.
- Use emojis sparingly.
- If asked about contact info, provide: "You can email him at ${identity.emailStart}".
- If you don't know the answer, say "I'm not sure about that specific detail, but ${identity.name.split(' ')[0]} works fast—you should ask him directly!"
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const { text } = await generateText({
      model: google('gemini-flash-latest'),
      system: SYSTEM_CONTEXT,
      messages,
    });

    return Response.json({ role: 'assistant', content: text });
  } catch (error) {
    console.error("Chat API Error Detailed:", error);
    // @ts-ignore
    if (error.cause) console.error("Cause:", error.cause);
    // Check if key is loaded (don't log the full key for security, just length)
    console.log("API Key loaded:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Yes (Length: " + process.env.GOOGLE_GENERATIVE_AI_API_KEY.length + ")" : "NO");

    return new Response(JSON.stringify({ error: "Failed to process chat" }), { status: 500 });
  }
}
