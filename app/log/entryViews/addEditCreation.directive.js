'use strict';

angular.module('pocketIkoma').directive('piAddEditCreation', function () {

    var AddEditCreationController = function (_, $, $scope, $timeout, clanService, familyService, schoolService, skillService, logService, modelService) {

        function updateSchoolChoices(selectedSchoolId, scope) {
            var selectedSchool = _.find(scope.schools, {id: selectedSchoolId});
            var choices = [];
            if (selectedSchool && selectedSchool.choices) {
                selectedSchool.choices.forEach(function (choice) {
                    choices.push({
                        choice: choice,
                        decision: {}
                    });
                });
            }

            scope.schoolChoices.length = 0;
            Array.prototype.push.apply(scope.schoolChoices, choices);
        }

        $scope.clans = clanService;
        $scope.families = familyService;
        $scope.schools = schoolService;
        $scope.schoolChoices = [];
        if (!$scope.logModel) {
            $scope.selectedClanId = null;
            $scope.selectedFamilyId = null;
            $scope.selectedSchoolId = null;
            $scope.differentSchool = false;
            $scope.initialXp = 40;
        } else {
            $scope.selectedClanId = $scope.logModel.clan;
            $scope.selectedFamilyId = $scope.logModel.family;
            $scope.selectedSchoolId = $scope.logModel.school.id;
            $scope.initialXp = $scope.logModel.initialXp;

            // TODO: Fix the direct ID reference?
            var differentSchoolExpenditure = _.find($scope.logModel.mandatoryExpenditures, {id: 'differentSchool'});
            $scope.differentSchool = !!differentSchoolExpenditure;

            if ($scope.logModel.school.options) {
                updateSchoolChoices($scope.selectedSchoolId, $scope);

                var index = 0;
                $scope.logModel.school.options.chosenSkills.forEach(function(chosenSkill) {
                    $scope.schoolChoices[index++].decision.skill = chosenSkill;
                });
            }
        }

        $scope.$watch('schoolChoices', function() {
            $scope.refreshLog();
        }, true);

        $timeout(function() {
            // TODO: move into link function.
            $('.ui.initial.form').form({
                fields: {
                    clan: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a clan.'
                        }]
                    },
                    school: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a school.'
                        }]
                    },
                    family: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a family.'
                        }]
                    },
                    initialXp: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter an initial XP.'
                        }]
                    }
                }
            });
        });

        $scope.canChooseFamily = function(familyId) {
            if (!$scope.selectedClanId) {
                return false;
            }

            var family = _.find($scope.families, {id: familyId});
            var selectedClan = _.find($scope.clans, {id: $scope.selectedClanId});

            return familyId === 'none' || (selectedClan.families.indexOf(family.id) > -1);
        };

        $scope.canChooseSchool = function(schoolId) {
            if (!$scope.selectedClanId) {
                return false;
            }

            var school = _.find($scope.schools, {id: schoolId});
            var selectedClan = _.find($scope.clans, {id: $scope.selectedClanId});

            return $scope.differentSchool || schoolId === 'none' || (selectedClan.schools.indexOf(school.id) > -1);
        };

        $scope.hasSchoolChoices = function() {
            return $scope.schoolChoices.length > 0;
        };

        $scope.getSchoolChoices = function() {
            return $scope.schoolChoices;
        };

        $scope.setClan = function() {
            $scope.selectedFamilyId = null;
            $scope.selectedSchoolId = null;
            // TODO: Move into link function.
            $('.clan.dropdown').removeClass('error');
            $('.family.dropdown').dropdown('clear');
            $('.school.dropdown').dropdown('clear');
        };

        $scope.setFamily = function() {
            // TODO: Move into link function.
            $('.family.dropdown').removeClass('error');

            $scope.refreshLog();
        };

        $scope.setSchool = function() {
            // TODO: Move into link function.
            $('.school.dropdown').removeClass('error');
            updateSchoolChoices($scope.selectedSchoolId, $scope);

            $scope.refreshLog();
        };

        $scope.onDifferentSchoolChange = function() {
            if (!$scope.differentSchool && !$scope.canChooseSchool($scope.selectedSchoolId)) {
                $scope.selectedSchoolId = null;
                // TODO: Move into link function.
                $('.school.dropdown').dropdown('clear');
            }
        };

        $scope.refreshLog = function() {
            var logId = $scope.logModel ? $scope.logModel.id : $scope.creationLogModel ? $scope.creationLogModel.id : undefined;

            var school = {
                id: $scope.selectedSchoolId ? $scope.selectedSchoolId : 'none',
                    options: {
                        chosenSkills: _($scope.schoolChoices).filter(function(choice) {
                            return !!choice.decision.skill;
                        }).map(function(choice) {
                            return choice.decision.skill;
                        }).value()
                    }
            };

            $scope.creationLogModel = logService.makeCreationLogModel($scope.initialXp,
                $scope.selectedClanId, $scope.selectedFamilyId, school, $scope.differentSchool);
            $scope.creationLogModel.id = logId;

            if (!$scope.logModel) {
                modelService.addOrUpdateLogInModel($scope.creationLogModel);
            }
        };

        $scope.save = function() {
            // TODO: Move into link function.
            var form = $('.ui.initial.form');
            form.form('validate form');
            if (!form.form('is valid')) {
                return;
            }

            var choiceFields = {
                fields: {}
            };
            _.forEach($scope.schoolChoices, function(schoolChoice) {
                _.merge(choiceFields.fields, schoolChoice.decision.formValidation);
            });
            form.form(choiceFields);
            form.form('validate form');
            if (!form.form('is valid')) {
                return;
            }

            if ($scope.logModel) {
                $scope.creationLogModel.creationTimestamp = $scope.logModel.creationTimestamp;
                $scope.creationLogModel.id = $scope.logModel.id;
            } else {
                $scope.creationLogModel.creationTimestamp = new Date().toISOString();
            }

            modelService.addOrUpdateLogInModel($scope.creationLogModel);
            $scope.onSave($scope.creationLogModel);
        };

        $scope.cancel = function() {
            $scope.onCancel();
        };
    };

    return {
        restrict: 'E',
        templateUrl: 'log/entryViews/addEditCreation.html',
        scope: {
            logModel: '=',
            onSave: '=',
            onCancel: '='
        },
        controller: AddEditCreationController
    };
});