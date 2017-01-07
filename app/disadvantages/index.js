import angular from 'angular';

let disadvantageModule = angular.module('pi.disadvantages', []);

import DisadvantageComponent from './disadvantages.component';
import DisdvantageService from './disadvantages.service';
disadvantageModule.component('piDisadvantages', DisadvantageComponent);
disadvantageModule.service('disadvantageService', DisdvantageService);
