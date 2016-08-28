'use strict';

var pocketIkomaModule = angular.module('pocketIkoma', ['ui.router']);
pocketIkomaModule.constant('_', window._);

require('./formatViews/default');
require('./advantages/bootstrap');
require('./disadvantages/bootstrap');
require('./data/bootstrap');
require('./katas/bootstrap');
require('./skills/bootstrap');
require('./rings/bootstrap');
require('./log/bootstrap');
require('./secondaryStats/bootstrap');
require('./characters/bootstrap');
require('./kiho/bootstrap');
require('./spells/bootstrap');

pocketIkomaModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/default');

    $stateProvider
        .state('default', {
            url: '/{characterId}/default',
            templateUrl: 'formatViews/default.html',
            controller: 'DefaultController'
        });
});


