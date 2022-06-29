'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
    */
    await queryInterface.bulkInsert('photos', [{
      uuid: "e2488d6e-c1c5-4dd1-8499-cd82048af409",
      name: 'Silly Llama',
      url: "https://www.rd.com/wp-content/uploads/2018/02/25_Hilarious-Photos-that-Will-Get-You-Through-the-Week_280228817_Doty911.jpg?fit=640,800",
      createdAt: "2022-03-13T20:54:10.809Z",
      updatedAt: "2022-03-13T20:54:10.809Z"
    },
    {
      uuid: "d2488d6e-c1c5-4dd1-4444-cd82048af409",
      name: 'Lobster Dog',
      url: "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?resize=768,549",
      createdAt: "2022-03-20T20:54:10.809Z",
      updatedAt: "2022-03-20T20:54:10.809Z"
    },
    {
      uuid: "e2445a6e-c1c5-4dd1-8499-cd82048af409",
      name: 'Baby in the Toilet',
      url: "https://bestlifeonline.com/wp-content/uploads/sites/3/2018/04/Trapped-in-Toilet.jpg?quality=82&strip=all",
      createdAt: "2022-03-13T20:54:10.809Z",
      updatedAt: "2022-03-13T20:54:10.809Z"
    },
    {
      uuid: "b3775a6e-c1c5-4dd1-8499-cd82048af409",
      name: "Birds and Seal<br>Quartet",
      url: "https://allthatsinteresting.com/wordpress/wp-content/uploads/2018/12/seal-penguins.jpg",
      createdAt: "2022-03-20T12:54:10.809Z",
      updatedAt: "2022-03-20T12:54:10.809Z"
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('photos', null, {});
  }
};
