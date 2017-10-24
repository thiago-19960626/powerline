/**
 * @providesModule PLActions
 * @flow
 */

'use strict';

const navigationActions = require('./navigation');
const loginActions = require('./login');
const groupActions = require('./groups');
const bookmarkActions = require('./bookmarks');
const activityActions = require('./activities');
const postActions = require('./posts');
const userActions = require('./users');
const registerActions = require('./register');
const followingActions = require('./following');
const notificationActions = require('./notification');
const representativesActions = require('./representatives');
const drawerActions = require('./drawer');
const commentActions = require('./comments');

module.exports = {
  ...loginActions,
  ...navigationActions,
  ...groupActions,
  ...bookmarkActions,
  ...activityActions,
  ...postActions,
  ...userActions,
  ...registerActions,
  ...followingActions,
  ...notificationActions,
  ...representativesActions,
  ...drawerActions,
  ...commentActions
};
