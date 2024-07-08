const apiConfig = {
  currentEnv: 'dev',
  prod: 'http://127.0.0.1:7777/api',
  staging: '',
  dev: 'http://127.0.0.1:7777/api',
  // endPoint: 'ws://mainnet.pivx.poker',
  endPoint: 'http://127.0.0.1:7777',
  api: 'http://127.0.0.1:7777',
  app: 'http://127.0.0.1:7777',
  captcha: 'captcha.computingcache.com',

  signUp: { url: '/signup', method: 'post' },
  authenticate: { url: '/authenticate', method: 'post' },
  withdrawal : {url: '/withdrawal', method: 'post' },
  wallet: {url: '/wallet', method: 'get' },
  walletShield: {url: '/walletShield', method: 'get' },
  profile:{url: '/profile', method: 'post' },
  changePassword:{url: '/change-password', method: 'post' },
  getBonus:{url: '/bonus', method: 'get' },
  postFeedback:{url: '/feedback', method: 'post' }
  

};

export default apiConfig;
