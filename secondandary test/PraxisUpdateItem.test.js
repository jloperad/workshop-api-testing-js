const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;
const apiURL = 'http://localhost:8080/api';

describe('Test Gildedrose API endpoints', () => {
  let itemId;
  before(async () => {
    const query = {
      name: 'Miel mostaza',
      sellIn: 15,
      quality: 20,
      type: 'AGED'
    };
    const res = await agent.get(`${apiURL}/items`);
    if (res.body.length > 0) {
      res.body.forEach(async (item) => { await agent.delete(`${apiURL}/items/${item.id}`); });
    }
    const response = await agent.post(`${apiURL}/items`).send(query);
    itemId = response.body.id;
  });

  it('Consume POST service with update quality endpoint', async () => {
    const response = await agent.get(`${apiURL}/items`);
    const itemQuality = response.body[0].quality;

    const res = await agent.post(`${apiURL}/items/quality`);

    expect(res.status).to.equal(statusCode.OK);
    expect(res.body[itemId - 1].quality - itemQuality).to.equal(1);
  });
});
