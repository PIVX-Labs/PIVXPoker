const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { NumberLong, PreLong } = require('mongoose-long-integer');
NumberLong(mongoose);
const Schema = mongoose.Schema;
const FinancialSchema = require('./Financial');
const BonusSchema = require('./Bonus');
const Long = mongoose.Schema.Types.Long;
const userModel = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  ip: { type: String },
  password: { type: String, required: true },
  referrer: {
    type: String
  },
  downlines: {
    type: [{ type: String }]
  },
  bonus: {
    type: [BonusSchema]
  },
  role: { type: String, required: true, default: 'user' },
  level: { type: Number, default: 1 },
  pivx: {
    type: Long,
    default: 1000,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    alias: 'i'
  },
  bet_amount: { type: Long, default: 0 },
  deposit_amount: {
    type: Long,
    default: 1000,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    alias: 'i'
  },
  address: { type: String },
  my_address: { type: String },
  shieldaddress: { type: String },
  myshieldaddress: { type: String },
  recharged: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    default: 1
  },
  profilePhoto: { type: String },
  financials: [FinancialSchema],
  admin: {
    type: Boolean,
    default: false
  },
  created: { type: Date, default: Date.now },
  updatedAt: {
    type: Number
  },
  flagged: {
    type: Number,
    default: 0
  }
});

userModel.set('toJSON', { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj.__v;
  delete obj.password;
  delete obj.financials;
  delete obj.bonus;
  delete obj.downlines;
  return obj;
};
userModel.post('save', PreLong);

module.exports = mongoose.model('user', userModel);
