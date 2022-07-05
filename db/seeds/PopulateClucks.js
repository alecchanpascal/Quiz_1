const faker = require('faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex('clucks').del()
  .then(() => {
    const clucks = [];
    for (let i = 0; i < 100; i++) {
      clucks.push({
        username: faker.name.firstName() + ' ' + faker.name.lastName(),
        content: faker.lorem.paragraph(),
        imageUrl: faker.image.imageUrl()
      });
    }
    return knex('clucks').insert(clucks);
  });
};
