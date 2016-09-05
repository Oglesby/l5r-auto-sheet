'use strict';
var $ = window.$;

angular.module('pocketIkoma').controller('NewController', function ($scope, $timeout, $state, logService, familyService, schoolService) {
    $scope.model = logService.createBaseModel();
    $scope.creationEntry = logService.makeCreationEntry();
    $scope.families = familyService;
    $scope.schools = schoolService;
    $scope.selectedFamily = null;
    $scope.selectedSchool = null;
    $scope.differentSchool = false;
    $scope.initialXp = 40;
    $scope.step = 'creation';
    $scope.inError = false;
    $scope.name = '';

    $timeout(function() {
        $('.ui.dropdown').dropdown();

        $('.ui.initial.form').form({
            fields: {
                school: {
                    identifier: 'school',
                    rules: [{
                        type   : 'empty',
                        prompt : 'Please enter a school.'
                    }]
                },
                family: {
                    identifier: 'family',
                    rules: [{
                        type   : 'empty',
                        prompt : 'Please enter a family.'
                    }]
                },
                initialXp: {
                    identifier: 'initialXp',
                    rules: [{
                        type   : 'empty',
                        prompt : 'Please enter an initial XP.'
                    }]
                }
            }
        });

        $('.ui.details.form').form({
            fields: {
                school: {
                    identifier: 'name',
                    rules: [{
                        type   : 'empty',
                        prompt : 'Please enter a character name.'
                    }]
                }
            }
        });
    });

    $scope.inCreation = function() {
        return $scope.step === 'creation';
    };

    $scope.inDetails = function() {
        return $scope.step === 'details';
    };

    $scope.canChooseSchool = function(school) {
        if (!$scope.selectedFamily) {
            return true;
        }

        return $scope.differentSchool || ($scope.selectedFamily.clan === school.clan);
    };

    $scope.canChooseFamily = function(family) {
        if (!$scope.selectedSchool) {
            return true;
        }

        return $scope.differentSchool || ($scope.selectedSchool.clan === family.clan);
    };

    $scope.setFamily = function(family) {
        $scope.selectedFamily = family;
        $('.family.dropdown').removeClass('error');
        $scope.refreshLog();
    };

    $scope.setSchool = function(school) {
        $scope.selectedSchool = school;
        $('.school.dropdown').removeClass('error');
        $scope.refreshLog();
    };

    $scope.onDifferentSchoolChange = function() {
        if (!$scope.differentSchool && !$scope.canChooseSchool($scope.selectedSchool)) {
            $scope.selectedSchool = null;
            $('.school.dropdown').dropdown('clear');
        }
    };

    $scope.refreshLog = function() {
        $scope.model = logService.createBaseModel();
        var familyId = $scope.selectedFamily ? $scope.selectedFamily.id : null;
        var schoolId = $scope.selectedSchool ? $scope.selectedSchool.id: null;
        $scope.creationEntry = logService.makeCreationEntry($scope.initialXp, familyId, schoolId);
        logService.processLogsIntoModel($scope.model, [$scope.creationEntry]);
    };

    $scope.openDetailsPanel = function() {
        if (!$scope.selectedFamily || !$scope.selectedSchool) {
            $scope.inError = true;
            return;
        }

        $scope.inError = false;
        $scope.step = 'details';
    };


    $scope.finish = function() {
        if (!$scope.name) {
            $scope.inError = true;
            return;
        }

        $scope.inError = false;
        var logs = [];
        var date = new Date();
        $scope.creationEntry.creationTimestamp = date.toISOString();
        logs.push($scope.creationEntry);

        if ($scope.differentSchool) {
             var differentSchoolEntry = logService.makeDifferentSchoolEntry();
            differentSchoolEntry.creationTimestamp = date.toISOString();
            logs.push(differentSchoolEntry);
        }

        // TODO: Save the data somewheres


        $state.go('default');
    };
});
