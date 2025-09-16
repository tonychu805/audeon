export default async (): Promise<Response> => {
  return new Response('Edge Function is working!', {
    headers: { 'Content-Type': 'text/plain' },
  });
};
