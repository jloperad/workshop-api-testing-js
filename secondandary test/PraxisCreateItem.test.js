const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const jsonSchema = require('chai-json-schema');
const { itemSchema } = require('./schema/PraxisItemSchema.schema');

const { expect } = chai;
chai.use(jsonSchema);

const PraxisURL = 'http://localhost:8080/api';

describe('Test Create Item Endpoint', () => {
  before(async () => {
    const items = await agent.get(`${PraxisURL}/items`);
    if (items.body.length > 0) {
      items.body.forEach(async (item) => { await agent.delete(`${PraxisURL}/items/${item.id}`); });
    }
  });
  it('Successful Creation', async () => {
    const item = {
      name: 'Sugar',
      sellIn: 20,
      quality: 35,
      type: 'NORMAL'
    };

    const response = await agent.post(`${PraxisURL}/items`).send(item);

    expect(response.status).to.equal(statusCode.CREATED);
    expect(response.body.name).to.be.equal(item.name);
    expect(response.body.sellIn).to.be.equal(item.sellIn);
    expect(response.body.quality).to.be.equal(item.quality);
    expect(response.body.type).to.be.equal(item.type);
    expect(response.body).to.be.jsonSchema(itemSchema);
  });
  it('Unsuccessful Creation', async () => {
    const wrongItem = {
      name: 'Rice',
      sellIn: 36,
      quality: -15,
      type: 'NORMAL'
    };

    const response = await agent.post(`${PraxisURL}/items`).send(wrongItem).ok(() => true);

    expect(response.status).to.equal(statusCode.BAD_REQUEST);
  });
});
