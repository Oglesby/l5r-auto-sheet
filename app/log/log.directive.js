'use strict';

angular.module('pocketIkoma').directive('piLog', function (_) {
    return {
        restrict: 'E',
        templateUrl: 'log/log.html',
        controller: function($scope, modelService) {

            function resetChanges() {
                $scope.deletingLogView = null;
                $scope.editingLogView = null;
            }
            resetChanges();

            $scope.startEditLog = function(logView) {
                $scope.editingLogView = logView;
            };

            $scope.finishEditingLog = function() {
                resetChanges();
            };

            $scope.startDeleteLog = function(logView) {
                $scope.deletingLogView = logView;
            };

            $scope.finishDeletingLog = function() {
                modelService.removeLogFromModel($scope.deletingLogView.logModel.id);
                resetChanges();
            };

            $scope.cancelChangingLog = function() {
                resetChanges();
            };

            $scope.markHouseruled = function(logView) {
                logView.invalidReasons = [];
                logView.isHouseruled = true;
            };

            $scope.logViewIsInvalid = function(logView) {
                return logView.invalidReasons && logView.invalidReasons.length > 0;
            };

            $scope.isMandatoryEntry = modelService.isMandatoryLogModel;
        }
    };
});
