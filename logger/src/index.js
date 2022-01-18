import winston from "winston";

export function createLogger(serviceName) {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
      service: serviceName
    },
    transports: [
      new winston.transports.File({
        dirname: '../../logs/',
        filename: `${serviceName}-log.txt`,
      })
    ]
  });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  
  return logger;
}
