const winston = require("winston");
require("winston-tcp-graylog");
require('dotenv').config()

/**
 * logs detail to graylog server
 * @param {Object} requestOrigin should contain origin url
 * @param {String} messageKey
 * @param {String} message
 * @param {String} type
 */
exports.log = async function (
  requestOrigin,
  messageKey,
  message,
  type = "info"
) {
  const ADAPTER_OPTIONS = {
    host: process.env.HOST,
    port: process.env.PORT,
  };

  const options = {
    gelfPro: {
      adapterName: "tcp",
      adapterOptions: ADAPTER_OPTIONS,
    },
  };

  const wGraylog = new winston.transports.TcpGraylog(options);
  const wConsole = new winston.transports.Console();

  const logger = new winston.Logger({
    transports: [wGraylog, wConsole],
  });

  logger
    .on("error", (err) => {
      // internal winston problems
      console.error(" !error: ", err);
    })
    .on("logging", (transport, level, msg, meta) => {
      // each winston transports
      console.info(" !logging: ", transport.name, level, msg, meta);
    });

  wGraylog
    .on("error", (err) => {
      // internal WinstonTcpGraylog problems
      console.error(" !wtg:error: ", err);
    })
    .on("send", (msg, res) => {
      // only WinstonTcpGraylog "logging"
      console.info(" !wtg:send: ", msg, res);
    })
    .on("skip", (warn) => {
      // only WinstonTcpGraylog "skiping"
      console.warn(" !wtg:skip: ", warn);
    });

  try {
    logger[type](messageKey, message);
  } catch (error) {
    console.log(error);
  }
};
