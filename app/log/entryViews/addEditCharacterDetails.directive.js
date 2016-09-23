'use strict';

angular.module('pocketIkoma').directive('piAddEditCharacterDetails', function () {

    var AddEditCharacterDetailsController = function (_, $, $scope, $timeout, logService, modelService) {

        if (!$scope.logModel) {
            $scope.name = null;
            $scope.description = null;
        } else {
            $scope.name = $scope.logModel.name;
            $scope.description = $scope.logModel.description;
        }

        $timeout(function() {
            // TODO: move into link function.
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

        $scope.save = function() {
            // TODO: Move into link function.
            var form = $('.ui.details.form');
            form.form('validate form');

            if (!form.form('is valid')) {
                return;
            }

            $scope.characterDetailsLogModel = logService.makeCharacterDetailsLogModel($scope.name, $scope.description);
            if ($scope.logModel) {
                $scope.characterDetailsLogModel.creationTimestamp = $scope.logModel.creationTimestamp;
                $scope.characterDetailsLogModel.id = $scope.logModel.id;
            } else {
                $scope.characterDetailsLogModel.creationTimestamp = new Date().toISOString();
            }

            modelService.addOrUpdateLogInModel($scope.characterDetailsLogModel);
            $scope.onSave($scope.characterDetailsLogModel);
        };

        $scope.cancel = function() {
            $scope.onCancel();
        };
    };

    return {
        restrict: 'E',
        templateUrl: 'log/entryViews/addEditCharacterDetails.html',
        scope: {
            logModel: '=',
            onSave: '=',
            onCancel: '='
        },
        controller: AddEditCharacterDetailsController
    };
});