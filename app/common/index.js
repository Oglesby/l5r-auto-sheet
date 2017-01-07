'use strict';

import angular from 'angular';
import ItemAddEditDeleteListComponent from './itemAddEditDeleteList.component'
import DropdownDirective from './dropdown.directive'
import SchoolChoiceComponent from './schoolChoice.component'

let commonModule = angular.module('pi.common', []);
commonModule.component('piItemList', ItemAddEditDeleteListComponent);
commonModule.directive('piDropdown', DropdownDirective);
commonModule.component('piSkillChoice', SchoolChoiceComponent);
