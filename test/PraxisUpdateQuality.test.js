const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const { afterEach, beforeEach } = require('mocha');

const { expect } = chai;

const PraxisURL = 'http://localhost:8080/api';

describe('Test Praxis API with UpdateQuality endpoint', () => {
  beforeEach(async () => {
    const items = await agent.get(`${PraxisURL}/items`);
    if (items.body.length > 0) {
      items.body.forEach(async (item) => { await agent.delete(`${PraxisURL}/items/${item.id}`); });
    }
  });
  afterEach(async () => {
    const items = await agent.get(`${PraxisURL}/items`);
    if (items.body.length > 0) {
      items.body.forEach(async (item) => { await agent.delete(`${PraxisURL}/items/${item.id}`); });
    }
  });

  it('before all delete existing items', async () => {
    const items = await agent.get(`${PraxisURL}/items`);

    if (items.body.length > 0) {
      items.body.forEach(async (item) => {
        await agent.delete(`${PraxisURL}/items/${item.id}`);
      });
    }
  });

  it('Consume POST service with update quality endpoint in normal type item', async () => {
    const normalItem = {
      name: 'Chocolate Milk',
      sellIn: 34,
      quality: 15,
      type: 'NORMAL'
    };

    await agent.post(`${PraxisURL}/items`).send(normalItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(normalItem.name);
    expect(res.body[0].sellIn).to.eql(normalItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(normalItem.quality - 1);
    expect(res.body[0].type).to.eql(normalItem.type);
  });

  it('Consume POST service with update quality endpoint in normal type item with sellIn < 0', async () => {
    const normalItem = {
      name: 'Chocolate Milk',
      sellIn: -1,
      quality: 25,
      type: 'NORMAL'
    };

    await agent.post(`${PraxisURL}/items`).send(normalItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(normalItem.name);
    expect(res.body[0].sellIn).to.eql(normalItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(normalItem.quality - 2);
    expect(res.body[0].type).to.eql(normalItem.type);
  });

  it('Consume POST service with update quality endpoint in normal type item with quality = 0', async () => {
    const normalItem = {
      name: 'Chocolate Milk',
      sellIn: 34,
      quality: 0,
      type: 'NORMAL'
    };

    await agent.post(`${PraxisURL}/items`).send(normalItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(normalItem.name);
    expect(res.body[0].sellIn).to.eql(normalItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(normalItem.quality);
    expect(res.body[0].type).to.eql(normalItem.type);
  });

  it('Consume POST service with update quality endpoint in AGED type item', async () => {
    const agedItem = {
      name: 'Aged Brie',
      sellIn: 34,
      quality: 15,
      type: 'AGED'
    };

    await agent.post(`${PraxisURL}/items`).send(agedItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(agedItem.name);
    expect(res.body[0].sellIn).to.eql(agedItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(agedItem.quality + 1);
    expect(res.body[0].type).to.eql(agedItem.type);
  });

  it('Consume POST service with update quality endpoint in AGED type item with quality = 50', async () => {
    const agedItem = {
      name: 'Aged Brie',
      sellIn: 34,
      quality: 50,
      type: 'AGED'
    };

    await agent.post(`${PraxisURL}/items`).send(agedItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(agedItem.name);
    expect(res.body[0].sellIn).to.eql(agedItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(agedItem.quality);
    expect(res.body[0].type).to.eql(agedItem.type);
  });

  it('Consume POST service with update quality endpoint in LEGENDARY type item', async () => {
    const legendaryItem = {
      name: 'Sulfuras, Hand of Ragnaros',
      sellIn: 34,
      quality: 80,
      type: 'LEGENDARY'
    };

    await agent.post(`${PraxisURL}/items`).send(legendaryItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(legendaryItem.name);
    expect(res.body[0].sellIn).to.eql(legendaryItem.sellIn);
    expect(res.body[0].quality).to.eql(legendaryItem.quality);
    expect(res.body[0].type).to.eql(legendaryItem.type);
  });

  it('Consume POST service with update quality endpoint in TICKETS type item with sellIn > 10', async () => {
    const ticketsItem = {
      name: 'Backstage passes to a BADBUNNY concert',
      sellIn: 34,
      quality: 15,
      type: 'TICKETS'
    };

    await agent.post(`${PraxisURL}/items`).send(ticketsItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(ticketsItem.name);
    expect(res.body[0].sellIn).to.eql(ticketsItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(ticketsItem.quality + 1);
    expect(res.body[0].type).to.eql(ticketsItem.type);
  });

  it('Consume POST service with update quality endpoint in TICKETS type item with sellIn < 11', async () => {
    const ticketsItem = {
      name: 'Backstage passes to a BADBUNNY concert',
      sellIn: 10,
      quality: 15,
      type: 'TICKETS'
    };

    await agent.post(`${PraxisURL}/items`).send(ticketsItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(ticketsItem.name);
    expect(res.body[0].sellIn).to.eql(ticketsItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(ticketsItem.quality + 2);
    expect(res.body[0].type).to.eql(ticketsItem.type);
  });

  it('Consume POST service with update quality endpoint in TICKETS type item with sellIn < 6', async () => {
    const ticketsItem = {
      name: 'Backstage passes to a BADBUNNY concert',
      sellIn: 5,
      quality: 15,
      type: 'TICKETS'
    };

    await agent.post(`${PraxisURL}/items`).send(ticketsItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(ticketsItem.name);
    expect(res.body[0].sellIn).to.eql(ticketsItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(ticketsItem.quality + 3);
    expect(res.body[0].type).to.eql(ticketsItem.type);
  });

  it('Consume POST service with update quality endpoint in TICKETS type item with sellIn = 0', async () => {
    const ticketsItem = {
      name: 'Backstage passes to a BADBUNNY concert',
      sellIn: 0,
      quality: 15,
      type: 'TICKETS'
    };

    await agent.post(`${PraxisURL}/items`).send(ticketsItem);

    const res = await agent.post(`${PraxisURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[0].name).to.eql(ticketsItem.name);
    expect(res.body[0].sellIn).to.eql(ticketsItem.sellIn - 1);
    expect(res.body[0].quality).to.eql(0);
    expect(res.body[0].type).to.eql(ticketsItem.type);
  });
});
