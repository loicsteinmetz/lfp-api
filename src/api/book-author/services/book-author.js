'use strict';

/**
 * book-author service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::book-author.book-author');
