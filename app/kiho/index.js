import angular from 'angular';

let kihoModule = angular.module('pi.kiho', []);

import KihoComponent from './kiho.component';
import KihoService from './kiho.service';
kihoModule.component('piKiho', KihoComponent);
kihoModule.service('kihoService', KihoService);
