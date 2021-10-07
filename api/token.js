import fetch from 'node-fetch';

export default async (req, res) => {
  const body = new URLSearchParams(JSON.parse(req.body));
  // const params = JSON.parse(req.body);
  // body.append('client_id', params.client_id);
  // body.append('client_secret', params.client_secret);
  // body.append('grant_type', params.grant_type);
  // console.log(body, params);
  const response = await fetch('https://aip.baidubce.com/oauth/2.0/token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  }).then((res) => res.json());

  res.send(response);
};
