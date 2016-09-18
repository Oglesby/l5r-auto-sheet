'use strict';

angular.module('pocketIkoma').directive('piSkills', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'skills/skills.html'
    };
});

angular.module('pocketIkoma').directive('piSkillsTable', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'skills/skillsTable.html'
    };
});