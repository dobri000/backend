'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Likes', 'createdAt');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Likes', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE
    });
  }
};
