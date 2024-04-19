const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-long')(mongoose);
const Long = mongoose.Schema.Types.Long;
// Create Schema
const WithdrawlSchema = new Schema({  
  user:{
    type: mongoose.ObjectId,
    required:true,
    index:true
  },
  amount:{
    type:Long,
    index:true
  },
  address:{
    type:String
  },
  txid:{
    type:String,
    index:true
  },
  confirmations:{
    type:Number,
    default:0,
    index:true
  }, 
  createdAt: {
    type: Date,
    default: Date.now
  },
  status:{
    type:Number,
    default:0,
    index:true
  },
  ip: { 
    type: String
  }
});

module.exports = Withdrawl = mongoose.model("withdrawl", WithdrawlSchema);
