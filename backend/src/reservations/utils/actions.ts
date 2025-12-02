export async function sendContactMessage(input: {
  message: string;
  subject?: string;
  fromEmail?: string;
}): Promise<{ ok: true }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mail/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // cookie httpOnly si l’utilisateur est connecté
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error('CONTACT_SEND_FAILED');
  }
  return (await res.json()) as { ok: true };
}
