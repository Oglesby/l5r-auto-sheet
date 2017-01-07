import angular from 'angular';

let navModule = angular.module('pi.nav', []);

import NavComponent from './nav.component';
navModule.component('piNav', NavComponent);
