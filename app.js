require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { messageDbOk, messageErrServer, messageWorkingServer } = require('./utils/responses');
const { limiter } = require('./utils/rateLimit');
const centralError = require('./middlewares/centralError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/routers');

const { PORT = 3000, URL_DB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.disable('x-powered-by');
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(centralError);

async function startApp() {
  try {
    mongoose.connect(URL_DB);
    console.log(messageDbOk);
    app.listen(PORT, () => {
      console.log(`${messageWorkingServer} на ${PORT} порту`);
    });
  } catch (error) {
    console.log(messageErrServer);
    process.exit(1);
  }
}

startApp();
