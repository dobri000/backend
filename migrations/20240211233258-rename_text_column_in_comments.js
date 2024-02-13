'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Comments', 'text', 'content');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Comments', 'content', 'text');
  }
};
