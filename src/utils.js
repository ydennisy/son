function generateAdRequest(publisherUrl) {
  const msg = {
    type: 'response',
    ad_id: Math.floor((Math.random() * 100000) + 1),
    req_ts: Date.now(),
    publisherUrl: publisherUrl,
    data: {}
  };
  return JSON.stringify(msg);
};


export {
  generateAdRequest,
}