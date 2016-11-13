'use strict';

angular.module('pocketIkoma').directive('piRingBlock', function () {
    return {
        restrict: 'E',
        scope: {
            ring: '='
        },
        templateUrl: 'rings/ring.block.html',
        controller: function($scope, modelService, ringService) {
            $scope.isInSpendingMode = modelService.isInSpendingMode;

            $scope.purchaseTrait = function(traitId) {
                var model = modelService.getCurrentModel();
                var result = ringService.findRingForTrait(traitId, model).purchase(model, traitId);

                modelService.addSpendingResult(result);
            };
        }
    };
});


angular.module('pocketIkoma').directive('piRingLine', function () {
    return {
        restrict: 'E',
        scope: {
            ring: '='
        },
        templateUrl: 'rings/ring.line.html'
    };
});