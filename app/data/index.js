import angular from 'angular';

let dataModule = angular.module('pi.data', []);

import ClansService from './clans.service';
import FamiliesService from './families.service';
import InsightService from './insight.service';
import SchoolsService from './schools.service';
import CharactersService from './characters.service';
dataModule.service('clanService', ClansService);
dataModule.service('familyService', FamiliesService);
dataModule.service('insightService', InsightService);
dataModule.service('schoolService', SchoolsService);
dataModule.service('characterService', CharactersService);

