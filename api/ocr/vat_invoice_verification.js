import fetch from '@vercel/fetch';

export default async (req, res) => {
  const { access_token } = req.query;
  const body = JSON.parse(req.body);
  const { data } = await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice_verification?${new URLSearchParams(
      { access_token }
    )}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    }
  );

  res.json({ body: data });
};
