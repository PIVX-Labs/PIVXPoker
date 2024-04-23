const crypto = require('crypto');
const User = require('../models/user');
const RpcClient = require('bitcoind-rpc');
const zmq = require('zeromq');

const { decodeRawTransactiontest, getTransaction } = require('../utils/pivx');

const sock = zmq.socket('sub');
const addr = 'tcp://127.0.0.1:28332';
const config = {
  protocol: 'http',
  user: process.env.WALLET_USER,
  pass: process.env.WALLET_PASSWORD,
  host: process.env.WALLET_URL,
  port: process.env.WALLET_PORT
};
const rpc = new RpcClient(config);
sock.connect(addr);
sock.subscribe('rawtx');
let txid="";
/**
 * This is the main socket that handles the pivx daemon
 * @param {*} io 
 * @param {*} socket 
 * @param {array} users 
 */
module.exports = (io, socket, users) => {
  //read transaction and deposit
  sock.on('message', function (topic, message) {
    if (topic.toString() === 'rawtx') {
      rpc.decodeRawTransaction(message.toString('hex'), async function (err, resp) {

        if (resp && resp.error == null && txid!=resp.result.txid) {
          txid=resp.result.txid;

          for (const receiver of resp.result.vout) {
            if (receiver.scriptPubKey.addresses) {
              for (const address of receiver.scriptPubKey.addresses) {
                try {
                  let user = await User.findOne({ address });
                  if (user) {
                    const recharged=await Recharge.countDocuments({txid:resp.result.txid, user:user.id});
                    if(recharged>0){
                      continue;
                    }
                    const tmp_recharge = {};
                    tmp_recharge.user = user.id;
                    tmp_recharge.txid = resp.result.txid;
                    tmp_recharge.amount = (Number(receiver.value) * 100000000) / receiver.scriptPubKey.addresses.length;
                    await new Recharge(tmp_recharge).save();
                    user=await User.findByIdAndUpdate(user.id, {
                      $inc: {
                        pivx: Number(tmp_recharge.amount)
                      }
                    }, { new: true });
                    const no=users.findIndex(ele=>ele.userId==user.id);
                    if(no>-1){
                      io.to(users[no].socketId).emit("message", {
                        message:tmp_recharge.amount+" chips are recharged successfuly!", 
                        pivx:user.pivx});
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
                
              }
              
            }
          }
          //Shielded Try
            if (resp.result.shielded_addresses) {
              for (const shieldaddress of resp.result.shielded_addresses) {
                try {
                  let user = await User.findOne({ shieldaddress });
                  if (user) {
                    const recharged=await Recharge.countDocuments({txid:resp.result.txid, user:user.id});
                    if(recharged>0){
                      continue;
                    }
                    const tmp_recharge = {};
                    tmp_recharge.user = user.id;
                    tmp_recharge.txid = resp.result.txid;

                    let individualTransactionInfo = await getTransaction(resp.result.txid)
                    tmp_recharge.amount = Math.abs(individualTransactionInfo.result.amount)* 100000000 //Multiply to get it to satoshi
                      
                    await new Recharge(tmp_recharge).save();
                    user=await User.findByIdAndUpdate(user.id, {
                      $inc: {
                        pivx: Number(tmp_recharge.amount)
                      }
                    }, { new: true });
                    const no=users.findIndex(ele=>ele.userId==user.id);
                    if(no>-1){
                      io.to(users[no].socketId).emit("message", {
                        message:tmp_recharge.amount+" chips are recharged successfuly!", 
                        pivx:user.pivx});
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
                
              }
            }
        }
      });
    }
  });
};
