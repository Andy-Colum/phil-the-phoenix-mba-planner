
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { message } = await request.json();

  try {
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer app-BMVzb50wyz8hw04pC90s3Rig`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: "blocking",
        conversation_id: "",
        user: "booth-mba-user",
      })
    });

    if (!response.ok) {
      throw new Error(`Dify API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      answer: data.answer
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process chat message'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
