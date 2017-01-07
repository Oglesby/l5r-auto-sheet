import angular from 'angular';

let formatViewsModule = angular.module('pi.formatViews', ['ui.router']);

import NewComponent from './new.component';
import DefaultComponent from './default.component';
formatViewsModule.component('piNewView', NewComponent);
formatViewsModule.component('piDefaultView', DefaultComponent);


formatViewsModule.config(($stateProvider) => {
    "use strict";

    $stateProvider.state({
        name: 'default',
        url: '/default',
        parent: 'app',
        component: 'piDefaultView',
        params: {
            characterId: null
        }
    }).state({
        name: 'logModule',
        parent: 'default',
        url: '/log',
        template: '<pi-add-edit-log-module></pi-add-edit-log-module>'
    }).state({
        name: 'spendXp',
        parent: 'default',
        url: '/spend',
        template: '<pi-add-edit-xp-expenditure></pi-add-edit-xp-expenditure>',
        controller: ($scope, modelService) => {
            modelService.startSpendingMode();
        }
    }).state({
        name: 'new',
        url: '/new',
        parent: 'app',
        component: 'piNewView'
    });
});