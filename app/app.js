'use strict';

var pocketIkomaModule = angular.module('pocketIkoma', ['ui.router']);
pocketIkomaModule.constant('_', window._);
pocketIkomaModule.constant('$', window.$);

require('./formatViews/bootstrap');
require('./basicInfo/bootstrap');
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
require('./nav/bootstrap');
require('./common/bootstrap');

pocketIkomaModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/default');

    $stateProvider.state('default', {
        url: '/default',
        templateUrl: 'formatViews/default.html',
        controller: 'DefaultController',
        controllerAs: 'defaultController',
        params: {
            characterId: null
        }
    }).state('default.logModule', {
        url: '/log',
        template: '<pi-edit-log-module log="log" model="model"></pi-edit-log-module>'
    }).state('new', {
        url: '/new',
        templateUrl: 'formatViews/new.html',
        controller: 'NewController'
    });
});


