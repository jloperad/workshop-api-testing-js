const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const jsonSchema = require('chai-json-schema');
const { itemSchema } = require('./schema/PraxisItemSchema.schema');

const { expect } = chai;
chai.use(jsonSchema);

const PraxisURL = 'http://localhost:8080/api';

let newItem;
let newItemId;
describe('Test Get Item Endpoint', () => {
  before(async () => {
    newItem = {
      name: 'Chocolate Milk',
      sellIn: 15,
      quality: 25,
      type: 'NORMAL'
    };

    const response = await agent.post(`${PraxisURL}/items`).send(newItem);
    newItemId = response.body.id;
  });
  it('Get Item created last', async () => {
    const response = await agent.get(`${PraxisURL}/items`);

    expect(response.status).to.equal(statusCode.OK);
    const { length } = response.body;
    const lastItem = response.body[length - 1];
    expect(lastItem.id).to.be.equal(newItemId);
    expect(lastItem.name).to.be.equal(newItem.name);
    expect(lastItem.sellIn).to.be.equal(newItem.sellIn);
    expect(lastItem.quality).to.be.equal(newItem.quality);
    expect(lastItem.type).to.be.equal(newItem.type);
    expect(lastItem).to.be.jsonSchema(itemSchema);
  });
  it('Get Item with valid id but not created yet', async () => {
    const notCreatedId = 150231563;
    const response = await agent.get(`${PraxisURL}/items/${notCreatedId}`).ok(() => true);

    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });
  it('Get Item with invalid id', async () => {
    const invalidId = 'pepito';
    const response = await agent.get(`${PraxisURL}/items/${invalidId}`).ok(() => true);

    expect(response.body).to.deep.equal({});
  });
});
