// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const axios = require('axios');

const cookie =
    'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5WmpkaVpERmtaRGt3Wm1JM1pqWTRNMk16WmpsaU5DSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCbmJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5qQTBNRGN3TmpWOS5NM2E2M1AzajVva0RQRXlnMnNqRnJSNFMxbVdCb2owUFZDbjQwY1pLOWxBIn0=';

const doRequest = async () => {
  const { data } = await axios.post(
      `http://ticketing.dev/api/tickets`,
      { title: 'ticket', price: 5 },
      {
        headers: { cookie },
      }
  );

  await axios.put(
      `http://ticketing.dev/api/tickets/${data.id}`,
      { title: 'ticket', price: 10 },
      {
        headers: { cookie },
      }
  );

  axios.put(
      `http://ticketing.dev/api/tickets/${data.id}`,
      { title: 'ticket', price: 15 },
      {
        headers: { cookie },
      }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 50000; i++) {
    await doRequest();
  }
})();