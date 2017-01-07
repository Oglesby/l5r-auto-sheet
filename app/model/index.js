import angular from 'angular';

let modelModule = angular.module('pi.model', []);

import ModelService from './model.service';
modelModule.service('modelService', ModelService);
