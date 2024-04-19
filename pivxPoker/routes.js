const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('./models/user');
const config = require('./config');
const requireAuth = require('./middlewares/requireAuth');
const requireAdmin = require('./middlewares/requireAdmin');
const {
  signup,
  authenticate,
  profile,
  validateUser,
  changePassword,
  getBonus
} = require('./controllers/restController');
const {
  postFeedback,
  getTicket,
  patchTicket, validateFeedback
} = require('./controllers/feedbackController');
const adminController = require('./controllers/adminController.js');
const walletController = require('./controllers/walletController.js');
const pivxHandler=require('./controllers/pivxHandler');

const chatHandlers = require('./controllers/chatHandler');
const sitGameHandlers = require('./controllers/sitGameHandler');
const tournamentGameHandlers = require('./controllers/tournamentGameHandler.js');
const cashGameHandlers = require('./controllers/cashGameHandler');
const mainHandlers = require('./controllers/mainHandler');

const upload = multer();
const router = require('express').Router();
const path = require('path');

//table data
router.get('/getTableData/:category/:id', adminController.getTableData);
router.get('/getTableData1/:category?', adminController.test);

//admin controller
router.get('/admin/total', requireAuth, requireAdmin, adminController.getTotal);
router.get('/admin/visits/:from/:to', requireAuth, requireAdmin, adminController.getVisit);
router.get('/admin/recharges/:from/:to', requireAuth, requireAdmin, adminController.getWallet);

//User Admin
router.get("/users/:page?/:search?", requireAuth, requireAdmin, adminController.getUsers);
router.get("/user/:id", requireAuth, requireAdmin, adminController.getUser);
router.put("/pointUp/:id", requireAuth, requireAdmin, adminController.putPointUp);
router.put("/pointDown/:id", requireAuth, requireAdmin, adminController.putPointDown);
router.delete("/remove-user/:id", requireAuth, requireAdmin, adminController.removeUser);
router.get("/total-profit", requireAuth, requireAdmin, adminController.getTotalProfit);
router.post("/profit-withdraw", requireAuth, requireAdmin, adminController.postProfitWithdraw);
router.post('/upload-rakes', requireAuth, requireAdmin, adminController.postRakes);

//ticket and feedback
router.post('/feedback', requireAuth, validateFeedback, postFeedback);
router.get('/ticket/:status/:page', requireAuth, requireAdmin, adminController.getTicket);
router.patch('/ticket/:id', requireAuth, requireAdmin, adminController.patchTicket);
//Authentication
router.post('/signup', validateUser, signup);
router.post('/authenticate', validateUser, authenticate);
router.post('/profile', requireAuth, upload.none(), profile);
router.post('/change-password', requireAuth, changePassword);
router.get('/bonus', requireAuth, getBonus);
//payment
router.get('/wallet', requireAuth, walletController.getWallet);
router.get('/walletShield', requireAuth, walletController.getShieldWallet);
router.get("/newAddress", requireAuth, walletController.getNewAddress);
router.get("/newShieldAddress", requireAuth, walletController.getNewShieldAddress);
router.post('/withdrawal', requireAuth, walletController.postWithdrawal);
router.get('/withdrawal', requireAuth, walletController.getWithdrawalList);
router.get(
  '/withdrawal-admin/:page',
  requireAuth,
  requireAdmin,
  walletController.getAdminWithdrawal
);
router.delete('/withdrawal-admin/:id', requireAuth, requireAdmin, walletController.deleteAdminWithdrawal);
router.delete('/recharge-admin/:id', requireAuth, requireAdmin, walletController.deleteAdminRecharge);
router.get('/recharge-admin/:page', requireAuth, requireAdmin, walletController.getAdminRecharge);
router.get('/recharge', requireAuth, walletController.getRechargeList);
router.get('/balance', requireAuth, walletController.getBalance);
router.put('/balance/:user', requireAuth, requireAdmin, walletController.putBalance);
let tournaments = [],
  cashGames = [],
  sitGames = [];
const users = [];
module.exports = (app, io) => {
  app.use('/api', router);
  app.get('*', function (req, res) {
    // console.log(req);
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      message: error.message
    });
  });

  const onConnection = (socket) => {
    chatHandlers(io, socket);
    sitGameHandlers(io, socket, sitGames);
    tournamentGameHandlers(io, socket, tournaments);
    cashGameHandlers(io, socket, cashGames);
    mainHandlers(io, socket, tournaments, cashGames, sitGames, users);
    pivxHandler(io, socket, users);
  };

  //socket middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      if (!socket.user) {
        const decodedToken = jwt.verify(token, config.jwt.secret, {
          algorithm: 'HS256',
          expiresIn: config.jwt.expiry
        });
        const user = await User.findById(decodedToken.id);

        socket.user = user.toJSON();
        if (!users.find((ele) => ele.userId == user.id)) {
          users.push({
            userId: user.id,
            socketId: socket.id
          });
        }
        cosnoel.log(users);
      }
    } catch (error) {
      socket.emit('error');
    }
    next();
  });
  io.on('connection', onConnection);
};
