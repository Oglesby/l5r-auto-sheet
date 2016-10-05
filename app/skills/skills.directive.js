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
        templateUrl: 'skills/skillsTable.html',
        controller: function(_, $scope, ringService) {

            $scope.getTraitForSkill = function(skill) {
                var traitId;
                if (skill.type.traitId) {
                    traitId = skill.type.traitId;
                } else if (skill.type.subSkills) {
                    var subSkill = _.find(skill.type.subSkills, {name: skill.choosing});

                    if (!subSkill) {
                        // TODO: This is the case where it's custom. What do we do here?
                        traitId = '*';
                    } else {
                        traitId = subSkill.traitId;
                    }
                }

                if (traitId === '*') {
                    return 'Various';
                }

                return ringService.findTraitById(traitId, $scope.model).name;
            };
        }
    };
});