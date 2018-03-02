const { assert } = require('chai');
const request = require('supertest');
const { jsdom } = require('jsdom');

const app = require('../../app');
const {
  connectDatabase,
  disconnectDatabase
} = require('../database-utilities');
const Video = require('../../models/video');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(
      `No element with selector ${selector} found in HTML string.`
    );
  }
};

describe('Server path: `/`', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  const testVideoToCreate = {
    title: 'Magnetic Sound Effects',
    description: 'Collection of interesting magnetic sounds'
  };

  describe('GET', () => {
    it('includes the values for a newly created video', async () => {
      const video = await Video.create(testVideoToCreate);
      const response = await request(app).get('/');

      assert.include(
        parseTextFromHTML(response.text, '#videos-container'),
        video.title
      );
    });
  });
});