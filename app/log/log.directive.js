'use strict';

angular.module('pocketIkoma').directive('piLog', function (_, logService) {
    return {
        restrict: 'E',
        templateUrl: 'log/log.html',
        controller: function($scope) {

            $scope.deletingLog = null;
            $scope.editingLog = null;
            $scope.newEditingLog = null;

            $scope.startEditLog = function(logItem) {
                $scope.editingLog = logItem;
                $scope.newEditingLog = _.cloneDeep(logItem);
            };

            $scope.finishEditingLog = function() {
                //var result = logService.deleteLogEntry($scope.deletingLog.logEntry);
                //
                //$scope.model = result.model;
                //$scope.log = result.log;
                // TODO: actually edit log.
            };

            $scope.startDeleteLog = function(logItem) {
                $scope.deletingLog = logItem;
            };

            $scope.finishDeletingLog = function() {
                var result = logService.deleteLogEntry($scope.deletingLog.logEntry);

                $scope.model = result.model;
                $scope.log = result.log;
                // TODO: actually delete log.
            };

            $scope.cancelChangingLog = function() {
                $scope.deletingLog = null;
                $scope.editingLog = null;
                $scope.newEditingLog = null;
            };

            $scope.isMandatoryEntry = function(logEntry) {
                return logEntry.type === 'CREATION' || logEntry.type === 'CHARACTER_INFO' ;
            };
        }
    };
});
