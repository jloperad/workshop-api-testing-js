const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const jsonSchema = require('chai-json-schema');
const { itemSchema } = require('./schema/PraxisItemSchema.schema');

const { expect } = chai;
chai.use(jsonSchema);

const PraxisURL = 'http://localhost:8080/api';
let firstItemId;

describe('Test Gildedrose API endpoints', () => {
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

  it('Consume POST service with update quality endpoint', async () => {
    const response = await agent.get(`${PraxisURL}/items`);
    const itemQuality = response.body[0].quality;

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(itemQuality - res.body[0].quality).to.equal(1);
  });

  it('Consume PUT service with update item endpoint', async () => {
    const item = {
      name: 'Milk',
      sellIn: 45,
      quality: 20,
      type: 'NORMAL'
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.be.equal(item.name);
    expect(response.body.sellIn).to.be.equal(item.sellIn);
    expect(response.body.quality).to.be.equal(item.quality);
    expect(response.body.type).to.be.equal(item.type);
    expect(response.body).to.be.jsonSchema(itemSchema);
  });

  it('Consume PUT service with update item should throw a Not Found error', async () => {
    const item = {
      name: 'milk',
      sellIn: 45,
      quality: 20,
      type: 'NORMAL'
    };

    const response = await agent.put(`${PraxisURL}/items/9999`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });

  it('Consume DELETE service with delete item endpoint', async () => {
    const validation = await agent.get(`${PraxisURL}/items`);
    const response = await agent.delete(`${PraxisURL}/items/${firstItemId}`);
    const validationResponse = await agent.get(`${PraxisURL}/items`);

    expect(response.status).to.equal(statusCode.OK);
    expect(validationResponse.body.length).to.equal(validation.body.length - 1);
  });
});
