'use strict';

import $ from 'jquery';

class DropdownDirective {
    constructor($timeout) {
        this.$timeout = $timeout;
        this.link = this.dropdownLinkFunction;
        this.restrict = 'A';
    }

    dropdownLinkFunction(scope, element, attrs) {
        this.$timeout(function () {
            $(element).dropdown({
                forceSelection: false
            });

            let modelName;
            let changeName;
            const parts = attrs.ngModel.split('.');
            const controllerName = parts[0];

            modelName = attrs.ngModel.substring(controllerName.length + 1);
            changeName = attrs.ngChange.substring(controllerName.length + 1);

            const controller = scope[controllerName];
            $(element).dropdown('set selected', controller[modelName]);

            $(element).dropdown('setting', {
                onChange: function (value) {
                    controller[modelName] = value;
                    controller[changeName](controller[modelName]);
                    scope.$apply();
                }
            });
        }, 0);
    }
}

export default ($timeout) => { return new DropdownDirective($timeout)};
