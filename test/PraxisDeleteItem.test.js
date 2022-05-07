const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

const PraxisURL = 'http://localhost:8080/api';
let firstItemId;

describe('Test Praxis API with DeleteItem endpoint', () => {
  before(async () => {
    const firstItem = {
      name: 'Chocolate Milk',
      sellIn: 15,
      quality: 25,
      type: 'NORMAL'
    };

    const items = await agent.get(`${PraxisURL}/items`);
    if (items.body.length > 0) {
      items.body.forEach(async (item) => { await agent.delete(`${PraxisURL}/items/${item.id}`); });
    }

    const response = await agent.post(`${PraxisURL}/items`).send(firstItem);
    firstItemId = response.body.id;
  });

  it('Consume DELETE service with delete item endpoint without an existing id', async () => {
    const response = await agent.delete(`${PraxisURL}/items/999999`).ok(() => true);

    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });

  it('Consume DELETE service with delete item endpoint', async () => {
    const validation = await agent.get(`${PraxisURL}/items`);
    const response = await agent.delete(`${PraxisURL}/items/${firstItemId}`);
    const validationResponse = await agent.get(`${PraxisURL}/items`);

    expect(response.status).to.equal(statusCode.OK);
    expect(validationResponse.body.length).to.equal(validation.body.length - 1);
  });

  it('Consume DELETE service with delete item endpoint with a string by id', async () => {
    const response = await agent.delete(`${PraxisURL}/items/jajaja`).ok(() => true);
    expect(response.status).to.equal(statusCode.BAD_REQUEST);
  });
});
