const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const jsonSchema = require('chai-json-schema');
const { itemSchema } = require('./schema/PraxisItemSchema.schema');

const { expect } = chai;
chai.use(jsonSchema);

const PraxisURL = 'http://localhost:8080/api';

describe('Test List Items Endpoint', () => {
  before(async () => {
    const items = await agent.get(`${PraxisURL}/items`);
    if (items.body.length > 0) {
      items.body.forEach(async (item) => { await agent.delete(`${PraxisURL}/items/${item.id}`); });
    }
  });
  it('Empty List', async () => {
    const response = await agent.get(`${PraxisURL}/items`);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.lengthOf(0);
  });
  it('List with 1 product', async () => {
    const item = {
      name: 'Sugar',
      sellIn: 20,
      quality: 35,
      type: 'NORMAL'
    };

    const newItem = await agent.post(`${PraxisURL}/items`).send(item);
    const itemId = newItem.body.id;
    const response = await agent.get('http://localhost:8080/api/items');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.lengthOf(1);
    const lastItem = response.body[0];
    expect(lastItem.id).to.be.equal(itemId);
    expect(lastItem.name).to.be.equal(item.name);
    expect(lastItem.sellIn).to.be.equal(item.sellIn);
    expect(lastItem.quality).to.be.equal(item.quality);
    expect(lastItem.type).to.be.equal(item.type);
    expect(lastItem).to.be.jsonSchema(itemSchema);
  });
});
