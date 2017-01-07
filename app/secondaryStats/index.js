import angular from 'angular';

let secondaryStatsModule = angular.module('pi.secondaryStats', []);

import SecondaryStatsComponent from './secondary.stats.component';
import SecondaryStatsService from './secondary.stats.service';
secondaryStatsModule.component('piSecondaryStats', SecondaryStatsComponent);
secondaryStatsModule.service('secondaryStatsService', SecondaryStatsService);
