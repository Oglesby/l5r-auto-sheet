import angular from 'angular';

let entryViewsModule = angular.module('pi.entryviews', []);

import AddEditCharacterDetailsComponent from './addEditCharacterDetails.component';
import AddEditCreationComponent from './addEditCreation.component';
import AddEditLogModuleComponent from './addEditLogModule.component';
import AddEditXpExpenditureComponent from './addEditXpExpenditure.component';
import ViewCharacterDetailsComponent from './viewCharacterDetails.component';
import ViewCreationComponent from './viewCreation.component';
entryViewsModule.component('piAddEditCharacterDetails', AddEditCharacterDetailsComponent);
entryViewsModule.component('piAddEditCreation', AddEditCreationComponent);
entryViewsModule.component('piAddEditLogModule', AddEditLogModuleComponent);
entryViewsModule.component('piAddEditXpExpenditure', AddEditXpExpenditureComponent);
entryViewsModule.component('piViewCharacterDetails', ViewCharacterDetailsComponent);
entryViewsModule.component('piViewCreation', ViewCreationComponent);
