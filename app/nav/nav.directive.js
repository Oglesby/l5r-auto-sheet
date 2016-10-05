'use strict';

angular.module('pocketIkoma').directive('piNav', function ($) {
    function NavController($scope, $state, characterService) {
        $scope.getCurrentCharacterId = characterService.getCurrentCharacterId;

        $scope.onApprove = function() {
            characterService.deleteCharacter($scope.getCurrentCharacterId());
            // TODO: navigate somewhere here.
        };
    }

    return {
        restrict: 'E',
        templateUrl: 'nav/nav.html',
        controller: NavController,
        link: function(scope, element) {
            var modal = $(element).find('.ui.modal');
            modal.modal({
                onApprove: scope.onApprove
            });

            scope.onDelete = function() {
                modal.modal('show');
            };
        }
    };
});
