'use strict';

import $ from 'jquery';
import _ from 'lodash';
import angular from 'angular';
import 'angular-ui-router';
import 'angular-animate';
import 'semantic-ui/dist/semantic.min';
import 'semantic-ui/dist/semantic.min.css';

import './common';
import './data';
import './log';
import './model';
import './rings';
import './advantages';
import './disadvantages';
import './skills';
import './spells';
import './katas';
import './kiho';
import './basicInfo';
import './secondaryStats';
import './formatViews';
import './characters';
import './nav';

import './main.less'

const requires = ['ui.router', 'pi.common', 'pi.log', 'pi.model', 'pi.rings', 'pi.data',  'pi.advantages',
    'pi.disadvantages', 'pi.skills', 'pi.spells', 'pi.kata', 'pi.kiho', 'pi.basicInfo', 'pi.secondaryStats',
    'pi.formatViews', 'pi.characters', 'pi.nav'];

let pocketIkoma = angular.module('pocketIkoma', requires);
// TODO: get rid of these
pocketIkoma.constant('_', _);
pocketIkoma.constant('$', $);

pocketIkoma.run(function($trace) {
    $trace.enable(1);
});

pocketIkoma.config(($stateProvider, $urlRouterProvider) => {
    /* @ngInject */

    $stateProvider.state('app', {
        abstract: true,
        template: '<pi-nav></pi-nav><ui-view class="ui main container"></ui-view>'
    });
    $urlRouterProvider.otherwise('/default');
});


