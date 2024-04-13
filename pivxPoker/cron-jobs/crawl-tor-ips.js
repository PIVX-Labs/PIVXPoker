const cron = require('node-cron');
const TorIp = require('../models/torIp');

const isValidIP = (ip) => {
  // Regular expression for IPv4 address
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // Regular expression for IPv6 address
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

const insertTorIp = async (ip) => {
  try {
    if (!isValidIP(ip)) return;

    const torIp = new TorIp({
      ip
    });
    await torIp.save();
  } catch (error) {}
};

const task = async () => {
  const res = await fetch('https://www.dan.me.uk/torlist/?full');
  const data = await res.text();
  const ips = data.split('\n');
  ips.forEach((ip) => {
    insertTorIp(ip);
  });
};

cron.schedule('0 0 * * *', async function () {
  task();
});
