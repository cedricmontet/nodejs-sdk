const arrayMerge = require('locutus/php/array/array_merge');
const arrayMap = require('locutus/php/array/array_map');
const httpBuildQuery = require('locutus/php/url/http_build_query');
const AnalyticVideo = require('../Model/Analytic/analyticVideo');
const AnalyticData = require('../Model/Analytic/analyticData');
const AnalyticEvent = require('../Model/Analytic/analyticEvent');

const AnalyticsVideo = function AnalyticsVideo(browser) {
  this.browser = browser;

  this.get = async function get(videoId, period = null) {
    const that = this;
    const parameters = {};
    if (period) {
      parameters.period = period;
    }
    const response = await this.browser.get(
      `/analytics/videos/${videoId}?${httpBuildQuery(parameters)}`,
    );

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        const analyticVideo = that.cast(response.body);
        resolve(analyticVideo);
      }
    }));
  };

  this.search = async function search(parameters = {}) {
    const that = this;
    const params = parameters;
    const currentPage = (typeof parameters.currentPage !== 'undefined')
      ? parameters.currentPage
      : 1;
    params.pageSize = (typeof parameters.pageSize !== 'undefined')
      ? parameters.pageSize
      : 100;

    params.currentPage = currentPage;

    const allAnalytics = [];
    let pagination = {};

    /* eslint-disable no-await-in-loop */
    do {
      const response = await this.browser.get(
        `/analytics/videos?${httpBuildQuery(params)}`,
      );

      if (that.browser.isSuccessfull(response)) {
        const results = response.body;
        const analytics = results.data;
        allAnalytics.push(that.castAll(analytics));

        if (typeof parameters.currentPage !== 'undefined') {
          break;
        }

        ({ pagination } = results);
        pagination.currentPage += 1;
        params.currentPage = pagination.currentPage;
      }
    } while (pagination.pagesTotal > pagination.currentPage);

    return new Promise((async (resolve, reject) => {
      try {
        let analytics = [];
        if (Object.prototype.hasOwnProperty.call(allAnalytics, 0)) {
          [analytics] = allAnalytics;
        }
        for (let x = 1; x < allAnalytics.length; x += 1) {
          if (Object.prototype.hasOwnProperty.call(allAnalytics, x)) {
            arrayMerge(analytics, allAnalytics[x]);
          }
        }
        resolve(analytics);
      } catch (e) {
        reject(e);
      }
    }));
  };
};

AnalyticsVideo.prototype.castAll = function castAll(collection) {
  const that = this;
  return arrayMap((data) => {
    const analyticVideo = new AnalyticVideo();
    analyticVideo.videoId = data.video.video_id;
    analyticVideo.videoTitle = data.video.title;
    analyticVideo.period = data.period;
    // Build Analytic Data
    Object.keys(data.data).forEach((key) => {
      const playerSession = data.data[key];
      const analyticData = new AnalyticData();

      // Build Analytic Session
      analyticData.session.sessionId = playerSession.session.sessionId;
      analyticData.session.loadedAt = new Date(
        playerSession.session.loadedAt,
      );
      analyticData.session.endedAt = new Date(playerSession.session.endedAt);

      // Build Analytic Location
      analyticData.location.country = playerSession.location.country;
      analyticData.location.city = playerSession.location.city;

      // Build Analytic Referer
      analyticData.referer.url = playerSession.referrer.url;
      analyticData.referer.medium = playerSession.referrer.medium;
      analyticData.referer.source = playerSession.referrer.source;
      analyticData.referer.search_term = playerSession.referrer.search_term;

      // Build Analytic Device
      analyticData.device.type = playerSession.device.type;
      analyticData.device.vendor = playerSession.device.vendor;
      analyticData.device.model = playerSession.device.model;

      // Build Analytic Os
      analyticData.os.name = playerSession.os.name;
      analyticData.os.shortname = playerSession.os.shortname;
      analyticData.os.version = playerSession.os.version;

      // Build Analytic Client
      analyticData.client.type = playerSession.client.type;
      analyticData.client.name = playerSession.client.name;
      analyticData.client.version = playerSession.client.version;

      // Build Analytic Events
      analyticData.events = that.buildAnalyticEventsData(
        playerSession.events,
      );

      analyticVideo.data.push(analyticData);
    });
    return analyticVideo;
  }, collection);
};

AnalyticsVideo.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }
  const analyticVideo = new AnalyticVideo();
  analyticVideo.videoId = data.video.video_id;
  analyticVideo.videoTitle = data.video.title;
  analyticVideo.period = data.period;
  // Build Analytic Data
  Object.keys(data.data).forEach((key) => {
    const playerSession = data.data[key];
    const analyticData = new AnalyticData();

    // Build Analytic Session
    analyticData.session.sessionId = playerSession.session.sessionId;
    analyticData.session.loadedAt = new Date(playerSession.session.loadedAt);
    analyticData.session.endedAt = new Date(playerSession.session.endedAt);

    // Build Analytic Location
    analyticData.location.country = playerSession.location.country;
    analyticData.location.city = playerSession.location.city;

    // Build Analytic Referer
    analyticData.referer.url = playerSession.referrer.url;
    analyticData.referer.medium = playerSession.referrer.medium;
    analyticData.referer.source = playerSession.referrer.source;
    analyticData.referer.search_term = playerSession.referrer.search_term;

    // Build Analytic Device
    analyticData.device.type = playerSession.device.type;
    analyticData.device.vendor = playerSession.device.vendor;
    analyticData.device.model = playerSession.device.model;

    // Build Analytic Os
    analyticData.os.name = playerSession.os.name;
    analyticData.os.shortname = playerSession.os.shortname;
    analyticData.os.version = playerSession.os.version;

    // Build Analytic Client
    analyticData.client.type = playerSession.client.type;
    analyticData.client.name = playerSession.client.name;
    analyticData.client.version = playerSession.client.version;

    // Build Analytic Events
    analyticData.events = this.buildAnalyticEventsData(playerSession.events);

    analyticVideo.data.push(analyticData);
  });

  return analyticVideo;
};

AnalyticsVideo.prototype.buildAnalyticEventsData = function buildAnalyticEventsData(events) {
  const eventsBuilded = [];

  Object.keys(events).forEach((key) => {
    const event = events[key];
    const analyticEvent = new AnalyticEvent();

    analyticEvent.type = event.type;
    analyticEvent.emittedAt = new Date(event.emitted_at);
    analyticEvent.at = (typeof event.at !== 'undefined') ? event.at : null;
    analyticEvent.from = (typeof event.from !== 'undefined')
      ? event.from
      : null;
    analyticEvent.to = (typeof event.to !== 'undefined') ? event.to : null;

    eventsBuilded.push(analyticEvent);
  });

  return eventsBuilded;
};

module.exports = AnalyticsVideo;
