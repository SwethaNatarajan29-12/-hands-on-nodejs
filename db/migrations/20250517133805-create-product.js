'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      isFeatured: {
        type: Sequelize.BOOLEAN
      },
      productImage: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      shortDescription: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      productUrl: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};