const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('Get Item Test', () => {
  it('Get Item Created', async () => {
    const body = {
      name: 'Sugar',
      sellIn: 20,
      quality: 35,
      type: 'NORMAL'
    };

    await agent.post('http://localhost:8080/api/items').send(body);

    const response = await agent.get('http://localhost:8080/api/items/');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body[0]).to.have.property('name').to.be.equal('Sugar');
  });
  // it('Get Item Not Created', async () => {
  //   const response = await agent.get('http://localhost:8080/api/items/100');

  //   expect(response.status).to.equal(statusCode.NOT_FOUND);
  // });
});
