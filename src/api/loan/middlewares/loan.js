'use strict';

const axios = require('axios');
const {createTransport} = require("nodemailer");

/**
 * `actions` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.req.method === 'POST' && ctx.request.originalUrl === '/api/loans') {
      const recaptchaRequest = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: ctx.request.body.data.recaptcha,
        }});
      if (recaptchaRequest.data.success) {
        if (process.env.BOOKS_NOTIFICATIONS)
        try {
          const transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          });
          const mail = await transporter.sendMail({
            from: '"Les Livres de la Fabrique" <contact@fabrique-populaire.fr>',
            to: process.env.BOOKS_NOTIFICATIONS_MAILS,
            subject: "👉 Nouvelle demande",
            text: `Nouvelle demande de livre par ${ctx.request.body.data.contact_name}.`,
            html: `<p>Nouvelle demande de livre par <b>${ctx.request.body.data.contact_name}</b>.</p>`,
          });
          strapi.log.info(JSON.stringify(mail));
        } catch (e) {
          strapi.log.error(e);
        } finally {
          await next();
        }
      } else {
        return ctx.badRequest('RecaptchaError', { data: recaptchaRequest.data });
      }
    } else {
      await next();
    }
  };
};
