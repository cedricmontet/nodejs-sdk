const apiVideo = require('../lib');
const expect = require('chai').expect;

describe('AnalyticsVideo ressource', () => {
  describe('get without period', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x');
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos/vix1x1x1x1x1x1x1x1x1x?',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });
  describe('get with period', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      client.analyticsVideo.get('vix1x1x1x1x1x1x1x1x1x', '2019-01');
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos/vix1x1x1x1x1x1x1x1x1x?period=2019-01',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Search with parameters without period', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let parameters = {
        currentPage : 1,
        pageSize: 25
      };
      client.analyticsVideo.search(parameters);
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?currentPage=1&pageSize=25',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Search with parameters with period', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let parameters = {
        currentPage : 1,
        pageSize: 25,
        period: '2019-01'
      };
      client.analyticsVideo.search(parameters);
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?currentPage=1&pageSize=25&period=2019-01',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Search without parameters without period', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let parameters = {};
      client.analyticsVideo.search(parameters);
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

  describe('Search without parameters with period', () => {
    it('Sends good request', () => {
      const client = new apiVideo.Client({username: 'test', apiKey: 'test'});
      let parameters = {
        period: '2019-01'
      };
      client.analyticsVideo.search(parameters);
      expect(client.analyticsVideo.browser.lastRequest).to.deep.equal({
        url: 'https://ws.api.video/analytics/videos?period=2019-01&pageSize=100&currentPage=1',
        method: 'GET',
        headers: {},
        json: true
      });
    });
  });

});
