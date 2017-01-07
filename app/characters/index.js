import angular from 'angular';

let charactersModule = angular.module('pi.characters', []);

import CharactersComponent from './characters.component';
charactersModule.component('piCharacters', CharactersComponent);
