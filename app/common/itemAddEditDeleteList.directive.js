'use strict';
var $ = window.$;

function itemAddEditDeleteListController($scope, $timeout, _) {
    $scope.changingItem = null;
    $scope.itemBeingEdited = {
        index: -1,
        oldItem: null,
        newItem: null
    };

    $scope.addingItem = function () {
        return $scope.changingItem === 'adding';
    };

    $scope.editingItem = function () {
        return $scope.changingItem === 'editing';
    };

    $scope.editingThisItem = function (item) {
        return $scope.editingItem() && $scope.itemBeingEdited.oldItem === item;
    };

    $scope.deletingItem = function () {
        return $scope.changingItem === 'deleting';
    };

    $scope.deletingThisItem = function (item) {
        return $scope.changingItem === 'deleting' && $scope.itemBeingEdited.oldItem === item;
    };

    $scope.changingAnyItem = function () {
        return !!$scope.changingItem;
    };

    $scope.startAddItem = function () {
        $scope.itemBeingEdited.newItem = _.cloneDeep($scope.newItemPrototype);
        $scope.changingItem = 'adding';

        // TODO: Move into link function.
        $timeout(function() {
            var formElement = $('.ui.list-item.add.form.' + $scope.itemClass);
            formElement.form($scope.formValidation);
        });
    };

    $scope.startEditItem = function (item) {
        var index = $scope.items.indexOf(item);
        if (index > -1) {
            $scope.itemBeingEdited.index = index;
            $scope.itemBeingEdited.oldItem = $scope.items[$scope.itemBeingEdited.index];
            $scope.itemBeingEdited.newItem = _.cloneDeep($scope.itemBeingEdited.oldItem);
            $scope.changingItem = 'editing';
        }

        // TODO: Move into link function.
        $timeout(function() {
            var formElement = $('.ui.list-item.edit.form.' + $scope.itemClass);
            formElement.form($scope.formValidation);
        });
    };

    $scope.startDeleteItem = function (item) {
        var index = $scope.items.indexOf(item);
        if (index > -1) {
            $scope.itemBeingEdited.index = index;
            $scope.itemBeingEdited.oldItem = $scope.items[$scope.itemBeingEdited.index];
            $scope.changingItem = 'deleting';
        }
    };

    function resetChangingItem() {
        $scope.changingItem = '';
        $scope.itemBeingEdited.newItem = null;
        if ($scope.itemBeingEdited.index > -1) {
            $scope.items[$scope.itemBeingEdited.index] = $scope.itemBeingEdited.oldItem;
            $scope.itemBeingEdited.index = -1;
        }
        $scope.itemBeingEdited.oldItem = null;

    }

    $scope.finishChangingItem = function () {
        // TODO: Move into link function.
        var formElement = $('.ui.list-item.form.' + $scope.itemClass);
        if (formElement.length > 0 && !formElement.form('is valid')) {
            return;
        }

        if ($scope.changingItem === 'adding') {
            $scope.items.push($scope.itemBeingEdited.newItem);
        } else if ($scope.changingItem === 'editing') {
            $scope.items[$scope.itemBeingEdited.index] = $scope.itemBeingEdited.newItem;
            $scope.itemBeingEdited.index = -1;
        } else if ($scope.changingItem === 'deleting') {
            $scope.items.splice($scope.itemBeingEdited.index, 1);
            $scope.itemBeingEdited.index = -1;
        }

        resetChangingItem();
    };

    $scope.cancelChangingItem = function () {
        resetChangingItem();
    };

    $scope.getModelPath = function(item) {
        return 'itemBeingEdited.newItem.' + item.modelPath;
    };

    $scope.modelAccessors = {};
    $scope.itemParams.forEach(function(itemParam) {
        $scope.modelAccessors[itemParam.name] = function(newValue) {
            var item = $scope.itemBeingEdited.newItem;

            var totalHops = itemParam.modelPath.length - 1;
            var hop = 0;
            while (hop < totalHops) {
                item = item[itemParam.modelPath[hop++]];
            }

            if (arguments.length) {
                item[itemParam.modelPath[totalHops]] = newValue;
            } else {
                return item[itemParam.modelPath[totalHops]];
            }
        };
    });
}

angular.module('pocketIkoma').directive('piItemList', function () {
    return {
        restrict: 'E',
        scope: {
            items: '=',
            itemName: '@',
            itemTitle: '@',
            itemClass: '@',
            newItemPrototype: '=',
            itemParams: '=',
            getDisplayText: '=',
            formValidation: '='
        },
        templateUrl: 'common/itemAddEditDeleteList.html',
        controller: itemAddEditDeleteListController
    };
});
