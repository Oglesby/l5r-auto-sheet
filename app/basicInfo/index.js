import angular from 'angular';

let basicInfoModule = angular.module('pi.basicInfo', []);

import BasicInfoComponent from './basicInfo.component';
import DescriptionComponent from './description.component';
basicInfoModule.component('piBasicInfo', BasicInfoComponent);
basicInfoModule.component('piDescription', DescriptionComponent);
