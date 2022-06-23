'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
    */
    await queryInterface.bulkInsert('users', [{
      name: 'John Doe',
      email: "false2asshole.com",
      password: 'whatever',
      uuid: "e2488d6e-c1c5-4dd1-8499-cd82048af409",
      createdAt: "2022-03-13T20:54:10.809Z",
      updatedAt: "2022-03-13T20:54:10.809Z"
    },
    {
      name: 'Bart Doe',
      email: "crack2asshole.com",
      password: "kittys",
      uuid: "e2400a6e-c1c5-4dd1-8499-cd82048af409",
      createdAt: "2022-03-13T20:54:10.809Z",
      updatedAt: "2022-03-13T20:54:10.809Z"
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
//https://www.youtube.com/watch?v=3qlnR9hK-lQ
