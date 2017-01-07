import angular from 'angular';

let kataModule = angular.module('pi.kata', []);

import KataComponent from './katas.component';
import KataService from './katas.service';
kataModule.component('piKatas', KataComponent);
kataModule.service('kataService', KataService);
