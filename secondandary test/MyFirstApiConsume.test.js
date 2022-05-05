const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get('https://httpbin.org/get').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume POST Service with query parameters', async () => {
    const body = {
      name: 'Tony',
      age: '61',
      city: 'Habana',
      job: 'Developer'
    };

    const response = await agent.post('https://httpbin.org/post').send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/get');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.header['Content-Type'], /json/);
  });

  it('Consume PATCH Service', async () => {
    const response = await agent.patch('https://httpbin.org/anything');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume PUT Service with query parameters', async () => {
    const body = {
      name: 'Steve',
      age: '120',
      city: 'New York',
      job: 'Soldier'
    };

    const response = await agent.put('https://httpbin.org/put').send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('Consume DELETE Service', async () => {
    const body = {
      name: 'Natasha',
      age: 38,
      city: 'Stalingrad'
    };

    const response = await agent
      .delete('https://httpbin.org/delete')
      .send(body);
    expect(response.status).to.equal(statusCode.OK);
  });
});
