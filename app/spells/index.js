import angular from 'angular';

let spellsModule = angular.module('pi.spells', []);

import SpellsComponent from './spells.directive';
import SpellsService from './spells.service';
spellsModule.component('piSpells', SpellsComponent);
spellsModule.service('spellService', SpellsService);
