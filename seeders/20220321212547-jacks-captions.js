'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:*/
      await queryInterface.bulkInsert('captions', [{
        //id: 1,
        uuid: "88888d6e-c1c5-4dd1-8459-cd82048af409",
        body: "How's my hair?",
        userId: 3,
        photoId: 1,
        createdAt: "2022-03-13T20:54:10.809Z",
        updatedAt: "2022-03-13T20:54:10.809Z"
      },
      {
        //id: 2,
        uuid: "55555d6e-c1c5-4dd1-8479-cd82048af409",
        body: "Who's got the melted butter?",
        userId: 3,
        photoId: 2,
        createdAt: "2022-03-13T20:54:10.809Z",
        updatedAt: "2022-03-13T20:54:10.809Z"
      },
      {
        //id: 3,
        uuid: "99999d6e-c1c5-4dd1-8409-cd82048af409",
        body: "There's pee in here!",
        userId: 3,
        photoId: 3,
        createdAt: "2022-03-13T20:54:10.809Z",
        updatedAt: "2022-03-13T20:54:10.809Z"
      },
      {
        //id: 4,
        uuid: "00000d6e-c1c5-4dd1-8489-cd82048af409",
        body: "'Brandy! You're a fine girl..'",
        userId: 3,
        photoId: 4,
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
    await queryInterface.bulkDelete('captions', null, {});
  }
};
