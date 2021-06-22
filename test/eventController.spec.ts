import { expect } from 'chai';
import { Chance } from 'chance';
import { Response, Request } from 'express';
import * as httpMocks from 'node-mocks-http';
import { describe, beforeEach, it } from 'mocha';
import { event } from '../model/eventModel';
import loki from 'lokijs';
import proxyquire from 'proxyquire';
import moment from 'moment';

const chance: Chance.Chance = new Chance();
const lokiDBMock = new loki(chance.string());
const eventsMock = lokiDBMock.addCollection<event>('events', {
  autoupdate: true,
});

const responseMock = httpMocks.createResponse();
const requestMock = httpMocks.createRequest();

const testController = proxyquire('../controller/eventController', {
  '../util/database': {
    event_table: eventsMock,
  },
});

describe('Controller', () => {
  let addEvent: (req: Request, res: Response) => Promise<Response>;
  let eventsResponse: event & LokiObj;
  let eventsRequest: event;

  beforeEach(() => {
    addEvent = testController.addEvent;
    requestMock.body = {};
    requestMock.query = {};
    requestMock.params = {};
    eventsRequest = {
      title: chance.string(),
      description: chance.string(),
      start_date: chance.date(),
      end_date: chance.date(),
    } as unknown as event;
    eventsResponse = {
      ...eventsRequest,
      $loki: chance.integer(),
      meta: {
        created: chance.integer(),
        revision: chance.integer(),
        updated: chance.integer(),
        version: chance.integer(),
      },
    } as event & LokiObj;
  });
  it('should return HTTP 200 OK', async () => {
    eventsMock.insertOne = (): event & LokiObj => {
      return eventsResponse;
    };
    requestMock.body = { timestamp: moment().add(5, 'days').format() };
    await addEvent(requestMock, responseMock);
    expect(responseMock.statusCode).to.equal(200);
  });
  it('Should return internal server error', async () => {
    eventsMock.insertOne = (): event & LokiObj => {
      throw new Error();
    };

    requestMock.body = { timestamp: moment().add(5, 'days').format() };
    await addEvent(requestMock, responseMock);
    expect(responseMock.statusCode).to.equal(500);
  });
  it('should return HTTP 401 error', async () => {
    eventsMock.insertOne = (): event & LokiObj => {
      return eventsResponse;
    };
    requestMock.body = { timestamp: 1 };
    await addEvent(requestMock, responseMock);
    expect(responseMock.statusCode).to.equal(401);
  });
});
