'use strict';

angular.module('pocketIkoma').directive('piSkillChoice', function (_, skillService, modelService) {

    var SkillChoiceController = function ($scope) {

        // TODO: This all becomes GROSSLY wrong when it's equipment or anything else. Fix that.

        if ($scope.decision.skill && $scope.decision.skill.id) {
            $scope.baseSkillId = $scope.decision.skill.id;
            $scope.baseSkill = skillService[$scope.baseSkillId];

            if ($scope.baseSkill.subSkills) {
                $scope.subSkillText = $scope.decision.skill.options.choosing;

                if ($scope.baseSkill.subSkills.indexOf($scope.subSkillText) === -1) {
                    $scope.choosingOther = true;
                    $scope.otherChoice = $scope.decision.skill.options.choosing;
                }
            }

        } else {
            $scope.baseSkillId = null;
            $scope.baseSkill = null;
            $scope.choosingOther = false;
            $scope.otherChoice = null;
        }

        $scope.decision.formValidation = {};
        $scope.decision.formValidation['choice' + $scope.index] = {
            rules: [{
                type: 'empty',
                prompt: 'Please choose a skill.'
            }]
        };

        $scope.onSkillChange = function() {
            $scope.baseSkill = skillService[$scope.baseSkillId];
            $scope.decision.skill = {
                id: $scope.baseSkillId
            };

            if ($scope.baseSkill.subSkills) {
                $scope.decision.formValidation['subChoice' + $scope.index] = {
                    rules: [{
                        type: 'empty',
                        prompt: 'Please choose a sub-skill.'
                    }]
                };
            }
        };

        $scope.onSubSkillChange = function(newSubSkillText) {
            if (newSubSkillText === 'other') {
                $scope.choosingOther = true;

                $scope.decision.formValidation['otherChoice' + $scope.index] = {
                    rules: [{
                        type: 'empty',
                        prompt: 'Please choose an "Other" option.'
                    }]
                };

            } else {
                $scope.decision.skill.options = {
                    choosing: newSubSkillText
                };
            }
        };

        $scope.onOtherTextChange = function(otherText) {
            $scope.decision.skill.options = {
                choosing: otherText
            };
        };

        if ($scope.choice.type === 'skill') {
            if ($scope.choice.id) {
                $scope.choiceOptions = [skillService[$scope.choice.id]];
                $scope.baseSkillId = $scope.choice.id;
                $scope.onSkillChange();
            } else if ($scope.choice.keywords) {
                $scope.choiceOptions = skillService.getSkillsWithKeyword($scope.choice.keywords);
            } else if ($scope.choice.restrictedKeywords) {
                $scope.choiceOptions = skillService.getSkillsWithoutKeyword($scope.choice.restrictedKeywords);
            }

            var modelSkills = _.map(modelService.getCurrentModel().skills, function(skill) { return skill.type; });
            $scope.choiceOptions = _.filter($scope.choiceOptions, function(skill) {
                return modelSkills.indexOf(skill) === -1 || ($scope.decision.skill && $scope.decision.skill.id === skill.id);
            });
        }
    };

    return {
        restrict: 'E',
        scope: {
            choice: '=schoolChoice',
            decision: '=schoolDecision',
            index: '='
        },
        templateUrl: 'common/schoolChoice.html',
        controller: SkillChoiceController
    };
});
