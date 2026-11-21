/** /llu-calls.ics: all 6 Wednesday calls (holiday break Dec 23 and 30) as one recurring calendar event. Built with the site. */
import type { APIRoute } from 'astro';
import { callsIcs } from '../lib/onboarding.js';

export const GET: APIRoute = () => {
  // Until the call time is set, serve an empty (but valid) calendar.
  const ics = callsIcs() || 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ClearCareer//Land and Level Up//EN\r\nEND:VCALENDAR\r\n';
  return new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="land-and-level-up-wednesday-calls.ics"' } });
};
