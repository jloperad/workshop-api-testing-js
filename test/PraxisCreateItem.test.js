const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('Create Item Test', () => {
  it('Successful Creation', async () => {
    const body = {
      name: 'Sugar',
      sellIn: 20,
      quality: 35,
      type: 'NORMAL'
    };

    const response = await agent.post('http://localhost:8080/api/items').send(body);

    expect(response.status).to.equal(statusCode.CREATED);
    expect(response.body).to.have.property('name').to.be.equal('Sugar');
  });
  // it('Unsuccessful Creation', async () => {
  //   const body = {
  //     name: 'Sugar',
  //     sellIn: 20,
  //     quality: 35,
  //     type: 'NORMAL'
  //   };

  //   const response = await agent.post('http://localhost:8080/api/items').send(body);

  //   expect(response.status).to.equal(statusCode.CREATED);
  //   expect(response.body).to.have.property('name').to.be.equal('Sugar');
  // });
});
