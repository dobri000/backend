'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('comments', 'Comments_ibfk_2');

    await queryInterface.addConstraint('comments', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'Comments_ibfk_2',
      references: { 
        table: 'posts', 
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('comments', 'Comments_ibfk_2');
    await queryInterface.addConstraint('comments', {
      fields: ['postId'],
      type: 'foreign key',
      name: 'Comments_ibfk_2',
      references: { 
        table: 'posts', 
        field: 'id'
      }
    });
  }
};
