export default async (request: Request, context: any) => {
  return new Response("Edge Function is working!", {
    headers: { 'Content-Type': 'text/plain' },
  });
};