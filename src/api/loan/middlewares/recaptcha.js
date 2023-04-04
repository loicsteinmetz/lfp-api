'use strict';

const axios = require('axios');

/**
 * `recaptcha` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.req.method === 'POST' && ctx.request.originalUrl === '/loans') {
      const recaptchaRequest = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: ctx.request.body.data.recaptcha,
        }});
      if (recaptchaRequest.data.success) {
        next();
      } else {
        return ctx.badRequest('RecaptchaError', { data: recaptchaRequest.data });
      }
    } else {
      await next();
    }
  };
};
