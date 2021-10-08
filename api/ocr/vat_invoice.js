import fetch from 'node-fetch';

export default async (req, res) => {
  const { query, body } = req;

  const response = await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice?${new URLSearchParams(
      query
    )}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body)
    }
  ).then((res) => res.json());

  res.json(response);
};
