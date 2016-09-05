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

    $timeout(function() {
        $('.ui.dropdown').dropdown();
    });

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
        $scope.refreshLog();
    };

    $scope.setSchool = function(school) {
        $scope.selectedSchool = school;
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

    $scope.finish = function() {
        // TODO: Form validation
        var date = new Date();
        $scope.creationEntry.creationTimestamp = date.toISOString();

        if ($scope.differentSchool) {
            $scope.differentSchoolEntry = logService.makeDifferentSchoolEntry();
            $scope.differentSchoolEntry = date.toISOString();
        }

        // TODO: Persist the entries somewheres

        $state.go('default');
    };
});
