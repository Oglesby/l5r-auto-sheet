import angular from 'angular';

let skillsModule = angular.module('pi.skills', []);

import {SkillsComponent, SkillsTableComponent} from './skills.components';
import SkillsService from './skills.service';
skillsModule.component('piSkills', SkillsComponent);
skillsModule.component('piSkillsTable', SkillsTableComponent);
skillsModule.service('skillService', SkillsService);
