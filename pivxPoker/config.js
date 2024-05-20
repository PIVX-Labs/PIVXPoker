module.exports = {
  port: process.env.PORT || 7777,
  db: {
    prod: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/pivx_poker',
    test: 'mongodb://127.0.0.1:27017/pivx_poker',
  },
  jwt: {
    //for players credential
    secret: process.env.JWT_SECRET || 'development_secret',
    expiry: '1d'
  },
  credentials: {
    //for provider credential
    expiry: 10
  }
};
