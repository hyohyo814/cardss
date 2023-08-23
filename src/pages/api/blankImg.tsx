import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Image Missing
      </div>
    ),
    {
      width: 262,
      height: 365,
    },
  );
}
