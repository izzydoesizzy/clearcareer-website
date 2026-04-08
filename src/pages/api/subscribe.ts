import type { APIRoute } from 'astro';

export const prerender = false;

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;

const LIST_IDS: Record<string, number> = {
  'make-it-count': 3,
  'achievement-worksheet': 4,
  'newsletter': 5,
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const listId = LIST_IDS[source] || LIST_IDS['newsletter'];

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add contact to Brevo
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true, // If contact exists, add them to the new list
        attributes: {
          SOURCE: source || 'website',
        },
      }),
    });

    if (brevoRes.ok || brevoRes.status === 204) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Brevo returns 400 if contact already exists but updateEnabled should handle that
    const brevoBody = await brevoRes.text();
    console.error('Brevo error:', brevoRes.status, brevoBody);

    // Still return success if it's a duplicate contact error
    if (brevoRes.status === 400 && brevoBody.includes('already exist')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Subscription failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
