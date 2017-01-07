import angular from 'angular';

let advantageModule = angular.module('pi.advantages', []);

import AdvantageComponent from './advantages.component';
import AdvantageService from './advantages.service';
advantageModule.component('piAdvantages', AdvantageComponent);
advantageModule.service('advantageService', AdvantageService);
