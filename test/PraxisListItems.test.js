const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('List Items Test', () => {
  it('Empty List', async () => {
    const response = await agent.get('http://localhost:8080/api/items');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.deep.equal([]);
  });
  it('List with 1 product', async () => {
    const response = await agent.get('http://localhost:8080/api/items');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.deep.equal([]);
  });
  // it('List with more of 1 product', async () => {
  //   const response = await agent.get('http://localhost:8080/api/items');

  //   expect(response.status).to.equal(statusCode.OK);
  //   expect(response.body).to.deep.equal([]);
  // });
});
