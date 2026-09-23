export default async () => {
  const token = process.env['GITHUB_TOKEN'];

  if (!token) {
    return new Response(
      JSON.stringify({
        error: 'GITHUB_TOKEN is not configured',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      GITHUB_TOKEN: token,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};