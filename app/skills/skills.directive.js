'use strict';

angular.module('pocketIkoma').directive('piSkills', function () {
    return {
        restrict: 'E',
        templateUrl: 'skills/skills.html'
    };
});

angular.module('pocketIkoma').directive('piSkillsTable', function () {
    return {
        restrict: 'E',
        templateUrl: 'skills/skillsTable.html'
    };
});