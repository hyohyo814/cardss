import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  ) {
  const title = req.query?.title as string;
  const data = await fetch('../titles.ts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(data)

  return res.json({route: title})
}