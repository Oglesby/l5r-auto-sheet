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
require('./model/model.service');

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
        template: '<pi-add-edit-log-module></pi-add-edit-log-module>'
    }).state('default.spendXp', {
        url: '/spend',
        template: '<pi-add-edit-xp-expenditure></pi-add-edit-xp-expenditure>',
        controller: function($scope, modelService) {
            modelService.startSpendingMode();
        }
    }).state('new', {
        url: '/new',
        templateUrl: 'formatViews/new.html',
        controller: 'NewController'
    });
});


