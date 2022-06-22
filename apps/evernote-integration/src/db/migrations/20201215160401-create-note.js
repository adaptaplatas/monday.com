'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NOTE', {
      itemId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: "this is the item id"
      },
      guid: {
        type: Sequelize.STRING
      },
      userTokenId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NOTE');
  },
};
