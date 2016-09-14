'use strict';

angular.module('pocketIkoma').directive('piNav', function () {
    function NavController($scope, characterService) {
        $scope.getCurrentCharacterId = characterService.getCurrentCharacterId;
    }

    return {
        restrict: 'E',
        templateUrl: 'nav/nav.html',
        controller: NavController
    };
});
