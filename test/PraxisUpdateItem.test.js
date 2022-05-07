const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const jsonSchema = require('chai-json-schema');
const { itemSchema } = require('./schema/PraxisItemSchema.schema');

const { expect } = chai;
chai.use(jsonSchema);

const PraxisURL = 'http://localhost:8080/api';
let firstItemId;

describe('Test Praxis API with UpdateItem endpoint', () => {
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

    const response = await agent.put(`${PraxisURL}/items/999999`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });

  it('Consume PUT service with update item with negative quality', async () => {
    const item = {
      name: 'milk',
      sellIn: 45,
      quality: -4,
      type: 'NORMAL'
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.INTERNAL_SERVER_ERROR);
  });

  it('Consume PUT service with update item with quality value greater than 80', async () => {
    const item = {
      name: 'milk',
      sellIn: 45,
      quality: 81,
      type: 'NORMAL'
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.INTERNAL_SERVER_ERROR);
  });

  it('Consume PUT service with update item with only name value', async () => {
    const item = {
      name: 'milk'
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.INTERNAL_SERVER_ERROR);
  });

  it('Consume PUT service with update item with only name and sellIn value', async () => {
    const item = {
      name: 'milk',
      sellIn: 45
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.INTERNAL_SERVER_ERROR);
  });

  it('Consume PUT service with update item with only name and quality value', async () => {
    const item = {
      name: 'milk',
      quality: 20
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.INTERNAL_SERVER_ERROR);
  });

  it('Consume PUT service with update item without type value', async () => {
    const item = {
      name: 'milk',
      sellIn: 45,
      quality: 20
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.be.equal(item.name);
    expect(response.body.sellIn).to.be.equal(item.sellIn);
    expect(response.body.quality).to.be.equal(item.quality);
    expect(response.body.type).to.be.equal(null);
  });

  it('Consume PUT service with update item with negative sellIn value', async () => {
    const item = {
      name: 'milk',
      sellIn: -45,
      quality: 20,
      type: 'NORMAL'
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.be.equal(item.name);
    expect(response.body.sellIn).to.be.equal(item.sellIn);
    expect(response.body.quality).to.be.equal(item.quality);
    expect(response.body.type).to.be.equal(item.type);
    expect(response.body).to.be.jsonSchema(itemSchema);
  });

  it('Consume PUT service with update item with a string number by sellIn value', async () => {
    const item = {
      name: 'milk',
      sellIn: '45',
      quality: 20,
      type: 'NORMAL'
    };

    const sellInNumber = parseInt(item.sellIn, 10);
    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.be.equal(item.name);
    expect(response.body.sellIn).to.be.equal(sellInNumber);
    expect(response.body.quality).to.be.equal(item.quality);
    expect(response.body.type).to.be.equal(item.type);
    expect(response.body).to.be.jsonSchema(itemSchema);
  });

  it('Consume PUT service with update item with a string TEXT by sellIn value', async () => {
    const item = {
      name: 'milk',
      sellIn: 'text',
      quality: 20,
      type: 'NORMAL'
    };

    const response = await agent.put(`${PraxisURL}/items/${firstItemId}`).send(item).ok(() => true);

    expect(response.status).to.equal(statusCode.BAD_REQUEST);
  });
});
