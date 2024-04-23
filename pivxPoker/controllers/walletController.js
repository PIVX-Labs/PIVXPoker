const User = require('../models/user');
const Withdrawal = require('../models/withdrawal');
const bcrypt = require('bcryptjs');
const Recharge = require('../models/recharge');
const { getNewAddress, getNewShieldAddress, sendToAddress, getTransaction } = require('../utils/pivx');
const { verifyPassword } = require('../utils/authentication');

/**
 * get wallet address
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getWallet = async (req, res, next) => {
  // console.log(req.user);
  const user = await User.findById(req.user.id);
  try {
    if (!user.address) {
      const respond = await getNewAddress();
      if (respond && respond.error == null) {
        // console.log(respond.result);
        user.address = respond.result;
      }
    }
  } catch (err) {
    console.log(err);
  }

  await user.save();
  res.status(200).json({ wallet: user.address });
};

/**
 * generate the btc new address
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getNewAddress = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  try {
    const now = new Date().getTime();
    if (now - user.updatedAt > 300000) {
      const respond = await getNewAddress();
      if (respond.error == null) {
        user.address = respond.result;
        user.updatedAt = new Date().getTime();
        await user.save();
        res.status(200).json({ wallet: user.address });
      } else {
        res.status(400).json({ error: 'Try again 5 minutes later' });
      }
    } else {
      res.status(400).json({ error: 'Try again 5 minutes later' });
    }
  } catch (err) {
    // console.log(err);
    res.status(400).json({ error: 'Try again 5 minutes later' });
  }
};

/**
 * get Shielded Address wallet address
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getShieldWallet = async (req, res, next) => {
  // console.log(req.user);
  const user = await User.findById(req.user.id);
  try {
    if (!user.shieldaddress) {
      const respond = await getNewShieldAddress();
      if (respond && respond.error == null) {
        // console.log(respond.body.result);
        user.shieldaddress = respond.result;
      }
    }
  } catch (err) {
    console.log(err);
  }

  await user.save();
  res.status(200).json({ wallet: user.shieldaddress });
};


/**
 * generate the btc Shielded Address new address
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getNewShieldAddress = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  try {
    const now = new Date().getTime();
    if (now - user.updatedAt > 300000) {
      const respond = await getNewShieldAddress();
      if (respond.error == null) {
        user.shieldaddress = respond.result;
        user.updatedAt = new Date().getTime();
        await user.save();
        res.status(200).json({ wallet: user.shieldaddress });
      } else {
        res.status(400).json({ error: 'Try again 5 minutes later' });
      }
    } else {
      res.status(400).json({ error: 'Try again 5 minutes later' });
    }
  } catch (err) {
    // console.log(err);
    res.status(400).json({ error: 'Try again 5 minutes later' });
  }
};

/**
 * Occures when someone submits a withdrawl request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.postWithdrawal = async (req, res, next) => {
  const amount = req.body.pivx;
  const address = req.body.wallet;
  let user = await User.findById(req.user.id);
  if (amount < 100000000)
    return res.status(400).json({ error: `Only more than 100,000,000 pivx allowed to withdraw` });
  else if (user.pivx < amount) {
    return res.status(403).json({ error: `Not enough balance` });
  }

  const passwordValid = await verifyPassword(req.body.password, user.password);

  if (passwordValid) {
    const recharges = await Recharge.find({ user: user.id });
    for (let i = 0; i < recharges.length; i++) {
      //console.log(recharges[i].txid);
      const respond = await getTransaction(recharges[i].txid);
      //console.log(respond);
      if (respond.error != null || respond.result.confirmations < 6) {
        return res.status(401).json({
          error:
            'In order to withdraw, all of the transactions must have more than 6 confirmations!'
        });
      }
    }
    user.my_address = address;
    await user.save();

    if (amount > 0) {
      const respond = await sendToAddress(address, amount);
      //console.log(respond.error)
      if (respond && respond.error == null) {
        const comp = {};
        comp.user = user.id;
        comp.address = address;
        comp.amount = amount;
        comp.txid = respond.result;
        user = await User.findByIdAndUpdate(
          req.user.id,
          {
            $inc: {
              pivx: -Number(amount)
            }
          },
          { new: true }
        );
        await new Withdrawal(comp).save();
        return res
          .status(200)
          .json({ message: 'Withdraw successfully! txid=' + comp.txid, pivx: user.pivx });
      }
    }
    return res.status(400).json({
      error: 'Withdrawal failed!'
    });
  } else return res.status(401).json({ error: 'Password incorrect!' });
};

/**
 * When a admin widthraw request is submitted
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getAdminWithdrawal = async (req, res, next) => {
  const page = req.params.page;
  let withdrawals, total;
  //all
  withdrawals = await Withdrawal.find({})
    .sort('-createdAt')
    .skip((page - 1) * 20)
    .limit(20);
  total = await Withdrawal.countDocuments({});

  const res_data = [];
  for (var i = 0; i < withdrawals.length; i++) {
    try {
      const respond = await getTransaction(withdrawals[i].txid);
      withdrawals[i].confirmations=respond.result.confirmations;
      await withdrawals[i].save();
      const aa = await User.findById(withdrawals[i].user);
      res_data[i] = {};
      res_data[i].id = withdrawals[i].id;
      res_data[i].createdAt = withdrawals[i].createdAt;
      res_data[i].username = aa.username;
      res_data[i].amount = withdrawals[i].amount;
      res_data[i].address = withdrawals[i].address;
      res_data[i].txid = withdrawals[i].txid;
      res_data[i].confirmations = withdrawals[i].confirmations;
    } catch (ex) {
      continue;
    }
  }
  return res.status(200).json({ data: res_data, page, last_page: Math.ceil(total / 20) });
};

/**
 * removes the adminwithdrawl
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.deleteAdminWithdrawal = async (req, res, next) => {
  const withdrawal=await Withdrawal.findById(req.params.id);
  await User.findByIdAndUpdate(
    withdrawal.user,
    {
      $inc: {
        pivx: Number(withdrawal.amount)
      }
    },
    { new: true }
  );
  await withdrawal.remove();
  return res.status(200).json({ message:"Successfully removed!" });

};

/**
 * removes admin recharge
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.deleteAdminRecharge = async (req, res, next) => {
  const recharge=await Recharge.findById(req.params.id);
  await User.findByIdAndUpdate(
    recharge.user,
    {
      $inc: {
        pivx: -Number(recharge.amount)
      }
    },
    { new: true }
  );
  await recharge.remove();
  return res.status(200).json({ message:"Successfully removed!" });

};

/**
 * Shows admin recharges
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getAdminRecharge = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status ? req.params.status : 2;
  let recharges;
  // if (status == 2 ) {
  recharges = await Recharge.find({})
    .sort('-createdAt')
    .skip((page - 1) * 20)
    .limit(20);
  // } else {
  //     recharges = await Recharge.find({ status: status }).sort("-createdAt").skip((page - 1) * 20).limit(20);
  // }
  const total = await Recharge.countDocuments({});
  const res_data = [];
  for (var i = 0; i < recharges.length; i++) {
    try {
      const respond = await getTransaction(recharges[i].txid);
      recharges[i].confirmations=respond.result.confirmations;
      await recharges[i].save();
      const aa = await User.findById(recharges[i].user);
      res_data[i] = {};
      res_data[i].id = recharges[i].id;
      res_data[i].txid = recharges[i].txid;
      res_data[i].createdAt = recharges[i].createdAt;
      res_data[i].userId = aa.id;
      res_data[i].username = aa.username;
      res_data[i].amount = recharges[i].amount;
      res_data[i].confirmations = recharges[i].confirmations;
    } catch (ex) {
      continue;
    }
  }
  return res.status(200).json({
    data: res_data,
    page: page,
    last_page: Math.ceil(total / 20)
  });
};

/**
 * Shows the withdrawl list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getWithdrawalList = async (req, res, next) => {
  const page = req.params.page;
  const withdrawals = await Withdrawal.find({ user: req.user.id });
  const data=[];
  for(let i=0;i<withdrawals.length;i++){
    const respond = await getTransaction(withdrawals[i].txid);
    withdrawals[i].confirmations=respond.result.confirmations;
    await withdrawals[i].save();
    const item=[];
    item.push(withdrawals[i].txid);
    item.push(withdrawals[i].amount);
    item.push(withdrawals[i].address);
    item.push(withdrawals[i].confirmations);
    item.push(withdrawals[i].createdAt);
    data.push(item);
  }
  return res.status(200).json(data);
};

/**
 * Get the recharge list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getRechargeList = async (req, res, next) => {
  const page = req.params.page;
  const data=[];
  const recharges = await Recharge.find({ user: req.user.id});
  for (recharge of recharges) {
    const respond = await getTransaction(recharge.txid);
    recharge.confirmations = respond.result.confirmations;
    await recharge.save();
    const item=[];
    item.push(recharge.txid);
    item.push(recharge.amount);
    item.push(recharge.confirmations);
    item.push(recharge.createdAt);
    data.push(item);
  }
  return res.status(200).json(data);
};

/**
 * Get the balance for the user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getBalance = async (req, res, next) => {
  var user = await User.findById(req.user.id);

  return res.status(200).json({ balance: user ? user.pivx : 0 });
};

/**
 * change the balance of a user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.putBalance = async (req, res, next) => {
  var user = await User.findById(req.params.user);
  user.pivx=req.body.pivx;
  await user.save();
  return res.status(200).json({ balance: user ? user.pivx : 0 });
};

