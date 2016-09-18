'use strict';

angular.module('pocketIkoma').directive('piLog', function (_) {
    return {
        restrict: 'E',
        templateUrl: 'log/log.html',
        controller: function($scope, modelService) {

            function resetChanges() {
                $scope.deletingLogView = null;
                $scope.editingLogView = null;
                $scope.newEditingLogModel = null;
            }
            resetChanges();

            $scope.startEditLog = function(logView) {
                $scope.editingLogView = logView;
                $scope.newEditingLogModel = _.cloneDeep(logView.logModel);
            };

            $scope.finishEditingLog = function() {
                modelService.updateLogInModel($scope.newEditingLogModel);
                resetChanges();
            };

            $scope.startDeleteLog = function(logItem) {
                $scope.deletingLogView = logItem;
            };

            $scope.finishDeletingLog = function() {
                modelService.removeLogFromModel($scope.deletingLogView.logModel.id);
                resetChanges();
            };

            $scope.cancelChangingLog = function() {
                resetChanges();
            };

            $scope.isMandatoryEntry = modelService.isMandatoryLogModel;
        }
    };
});
