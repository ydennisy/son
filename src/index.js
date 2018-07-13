const IPFS = require('ipfs');

const node = new IPFS({ 
  repo: 'ipfs-' + Math.random(),
  EXPERIMENTAL: {
    pubsub: true,
  }
});

node.on('error', err => console.error(err));

/* node.on('ready', () => {
  console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
  node.pubsub.ls((err, topics) => {
    if (err) {
      return console.error('failed to get list of subscription topics', err)
    }
    console.log(topics)
  })
}); */

node.once('ready', () => node.id((err, info) => {
  if (err) { throw err };
  console.log('Online status: ', node.isOnline() ? 'online' : 'offline');
  console.log('IPFS node ready with id: ' + info.id);
  
  const topic = 'publisher:ads:auto.com';
  const msg = Buffer.from('hello from ipfs!');
  const receiveMsg = (msg) => console.log(msg.data.toString())


  node.pubsub.subscribe(topic, receiveMsg, (err) => {
    if (err) { throw err };
    console.log(`subscribed to ${topic}`)
  });

  node.pubsub.publish(topic, msg, (err) => {
    if (err) { throw err };
    console.log(`message sent to ${topic}`);
  });


}));




// here we begin sending events

// const topic = 'publisher:ads:auto.com';

/* function logNodeInfo() {
  return new P
} */