import angular from 'angular';

import './entryViews';

let logModule = angular.module('pi.log', ['pi.entryviews']);

import LogComponent from './log.component';
import LogService from './log.service';
logModule.component('piLog', LogComponent);
logModule.service('logService', LogService);
