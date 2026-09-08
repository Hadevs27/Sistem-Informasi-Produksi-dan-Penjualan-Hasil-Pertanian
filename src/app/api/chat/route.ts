import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getOverallMetrics } from "@/lib/analytics";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  
  // Grounding the AI with real application data
  const metrics = await getOverallMetrics();

  const systemPrompt = `
You are a Business Intelligence AI Assistant for PT MACROPRIMA PANGAN UTAMA (an agricultural production company).
Your role is to help managers and executives understand their business performance.

Answer concisely, professionally, and directly using the following GROUND TRUTH DATA:
- Total Revenue: Rp ${metrics.revenue.toLocaleString("id-ID")}
- Total Cost (COGS): Rp ${metrics.totalCost.toLocaleString("id-ID")}
- Total Gross Profit: Rp ${metrics.profit.toLocaleString("id-ID")}
- Average Margin: ${metrics.margin.toFixed(2)}%
- Total Production Volume: ${metrics.productionVolume} units
- Total Sales Volume: ${metrics.salesVolume} units
- Active Products: ${metrics.products}

CRITICAL RULES:
1. DO NOT hallucinate database facts. Only use the provided GROUND TRUTH DATA.
2. If a user asks a specific question about data not provided above (e.g. "what is the specific yield of product X?"), say clearly that you don't have access to that specific data right now, but you can answer overall business performance.
3. Be professional and concise. Do not use overly enthusiastic language like "Sure! 😊".
4. Recommend actions based on the data if appropriate (e.g., "Margin is below 20%, consider reviewing production costs").
5. The user is logged in as: ${session.user.name} (Role: ${session.user.role}).

Please answer the user's latest query considering the context above.
  `;

  const result = streamText({
    model: google("gemini-2.5-pro"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
