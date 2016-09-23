'use strict';

angular.module('pocketIkoma').directive('piAddEditCreation', function () {

    var AddEditCreationController = function (_, $, $scope, $timeout, clanService, familyService, schoolService, logService, modelService) {

        $scope.clans = clanService;
        $scope.families = familyService;
        $scope.schools = schoolService;
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
        }

        $timeout(function() {
            // TODO: move into link function.
            $('.ui.initial.form').form({
                fields: {
                    clan: {
                        identifier: 'clan',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a clan.'
                        }]
                    },
                    school: {
                        identifier: 'school',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a school.'
                        }]
                    },
                    family: {
                        identifier: 'family',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a family.'
                        }]
                    },
                    initialXp: {
                        identifier: 'initialXp',
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

        $scope.setClan = function(clan) {
            $scope.selectedFamilyId = null;
            $scope.selectedSchoolId = null;
            // TODO: Move into link function.
            $('.clan.dropdown').removeClass('error');
            $('.family.dropdown').dropdown('clear');
            $('.school.dropdown').dropdown('clear');
        };

        $scope.setFamily = function(family) {
            // TODO: Move into link function.
            $('.family.dropdown').removeClass('error');

            $scope.refreshLog();
        };

        $scope.setSchool = function(school) {
            // TODO: Move into link function.
            $('.school.dropdown').removeClass('error');
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

            $scope.creationLogModel = logService.makeCreationLogModel($scope.initialXp,
                $scope.selectedClanId, $scope.selectedFamilyId, $scope.selectedSchoolId, $scope.differentSchool);
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