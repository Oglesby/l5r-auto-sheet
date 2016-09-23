'use strict';
var $ = window.$;

angular.module('pocketIkoma').controller('NewController', function ($scope, $timeout, $state, modelService, characterService) {
    $scope.model = modelService.resetCurrentModel();
    $scope.step = 'creation';

    $scope.inCreation = function() {
        return $scope.step === 'creation';
    };

    $scope.inDetails = function() {
        return $scope.step === 'details';
    };

    $scope.inConfirm = function() {
        return $scope.step === 'confirm';
    };

    $scope.onCancel = function() {
        $state.go('default');
    };

    $scope.onSaveCreation = function() {
        $scope.step = 'details';
    };

    $scope.onSaveDetails = function() {
        $scope.step = 'confirm';
    };

    $scope.onFinish = function() {
        // TODO: Persist to server
        var id = characterService.addCharacter($scope.model);
        $state.go('default', {characterId: id});
    };
});
