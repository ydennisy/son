import IPFS from 'ipfs';
import * as utils from './utils';

const node = new IPFS({ 
  repo: 'ipfs-' + Math.random(),
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ],
      API: '/ip4/127.0.0.1/tcp/5001',
      Gateway: '/ip4/127.0.0.1/tcp/8080'
    },
    Discovery: {
      MDNS: {
        Enabled: true,
        Interval: 10
      },
      webRTCStar: {
        Enabled: true
      }
    },
  }
});

console.log(node)

const publisherUrl = window.location.hostname;
const topic = 'publisher:ads:' + publisherUrl;
const adResponseQueue = [];

node.on('error', err => console.error(err));

node.on('ready', () => node.id((err, info) => {
  if (err) { throw err };
  console.log('[INFO] IPFS node status: ', node.isOnline() ? 'online' : 'offline');
  console.log('[INFO] IPFS node id: ' + info.id);
  setInterval(() => checkPeers(node, topic), 3000);

  
/*   node.pubsub.subscribe(topic, receiveMsg, (err) => {
    if (err) { throw err };
    console.log(`[INFO] Subscribed to topic: ${topic}`);
  }); */
  subscribe(topic, receiveMsg)
    .then(topic => publishAdRequest(topic))
    .then(adRequest => listen(adRequest))
    .then(auctionArray => console.log(auctionArray))
    // .then(bidsReceived => auction(bidsReceived))

}));

node.on('start', () => console.log(node.swarm.peers()))


function publishAdRequest(topic) {
  const adRequest = utils.generateAdRequest(publisherUrl);
  const adRequestBuffer = Buffer.from(adRequest);
  node.pubsub.publish(topic, adRequestBuffer, (err) => {
    if (err) { throw err };
    console.log(`[INFO] Ad Request sent to: ${topic} & ${adRequest}`);
    Promise.resolve(adRequest.ad_id);
  });
}

function listen(adRequestId) {
  const adId = adRequestId;
  const auctionArray = adResponseQueue.filter(response => response.ad_id == adId && response.type == 'response');
  Promise.resolve(auctionArray);
};

function receiveMsg(msg) {
  const adResponse = JSON.parse(msg.data.toString());
  //if()
  console.log('[INFO] Response Received: ', adResponse);
  adResponseQueue.push(adResponse);
  console.log('[INFO] Response Queue: ', adResponseQueue);
}

function subscribe(topic, receiveMsg) {
  return new Promise((resolve, reject) => {
    
    node.pubsub.subscribe(topic, receiveMsg, (err) => {
      if (err) { throw err };
      console.log(`[INFO] Subscribed to topic: ${topic}`);
    });

    resolve(topic)
  });
}


function checkPeers(node, topic) {
  node.pubsub.peers(topic, (err, peerIds) => {
    if (err) { throw err };
    console.log('[INFO] Looking for peers (topic): ', peerIds)
  });
  node.swarm.peers({}, function(err, peers) {
    if (err) { throw err }; 
    console.log('[INFO] Looking for peers: ', peers)
  });
}