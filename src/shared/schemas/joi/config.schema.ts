import Joi from 'joi';
import { Environment } from 'src/shared/utils';

export const configSchema = () => {
  return Joi.object({
    NODE_ENV: Joi.string()
      .valid(...Object.values(Environment))
      .default(Environment.DEVELOPMENT),
    APP_PORT: Joi.number().default(3000),
    MONGODB_IN_MEMORY_PORT: Joi.number().when('NODE_ENV', {
      is: Joi.string().valid(Environment.DEVELOPMENT, Environment.TEST),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    MONGODB_HOST: Joi.string().when('NODE_ENV', {
      is: Joi.string().valid(Environment.STAGING, Environment.PRODUCTION),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    JWT_SECRET_KEY: Joi.string().required(),
  });
};
