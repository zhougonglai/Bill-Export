import fetch from '@vercel/fetch';

export default async (rq, res) => {
  // const { data } = await fetch()
  res.json({
    body: {
      a: 'asasb'
    }
  });
};
