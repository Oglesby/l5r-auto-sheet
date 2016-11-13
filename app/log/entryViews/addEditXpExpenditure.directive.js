'use strict';

angular.module('pocketIkoma').directive('piAddEditXpExpenditure', function () {

    var SpendXpModuleController = function (_, $, $scope, $timeout, $location, $anchorScroll, $state, logService, modelService) {


    };

    return {
        restrict: 'E',
        templateUrl: 'log/entryViews/addEditXpExpenditure.html',
        scope: {
            logModel: '=',
            onSave: '=',
            onCancel: '='
        },
        controller: SpendXpModuleController
    };
});