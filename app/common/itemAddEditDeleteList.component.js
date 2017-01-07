'use strict';

import $ from 'jquery';
import _ from 'lodash';

class ItemAddEditDeleteListComponentController {
    constructor($timeout) {
        this.$timeout = $timeout;
        this.changingItem = null;
        this.itemBeingEdited = {
            index: -1,
            oldItem: null,
            newItem: null
        };
    }

    $onInit() {
        this.modelAccessors = {};
        this.itemParams.forEach((itemParam) => {
            this.modelAccessors[itemParam.name] = (newValue) => {
                let item = this.itemBeingEdited.newItem;

                const totalHops = itemParam.modelPath.length - 1;
                let hop = 0;
                while (hop < totalHops) {
                    item = item[itemParam.modelPath[hop++]];
                }

                if (newValue) {
                    item[itemParam.modelPath[totalHops]] = newValue;
                } else {
                    return item[itemParam.modelPath[totalHops]];
                }
            };
        });
    }

    addingItem() {
        return this.changingItem === 'adding';
    };

    editingItem() {
        return this.changingItem === 'editing';
    };

    editingThisItem(item) {
        return this.editingItem() && this.itemBeingEdited.oldItem === item;
    };

    deletingItem() {
        return this.changingItem === 'deleting';
    };

    deletingThisItem(item) {
        return this.changingItem === 'deleting' && this.itemBeingEdited.oldItem === item;
    };

    changingAnyItem() {
        return !!this.changingItem;
    };

    startAddItem() {
        this.itemBeingEdited.newItem = _.cloneDeep(this.newItemPrototype);
        this.changingItem = 'adding';

        // TODO: Move into link function.
        this.$timeout(() => {
            const formElement = $('.ui.list-item.add.form.' + this.itemClass);
            formElement.form(this.formValidation);
        });
    };

    startEditItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.itemBeingEdited.index = index;
            this.itemBeingEdited.oldItem = this.items[this.itemBeingEdited.index];
            this.itemBeingEdited.newItem = _.cloneDeep(this.itemBeingEdited.oldItem);
            this.changingItem = 'editing';
        }

        // TODO: Move into link function.
        this.$timeout(() => {
            const formElement = $('.ui.list-item.edit.form.' + this.itemClass);
            formElement.form(this.formValidation);
        });
    };

    startDeleteItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.itemBeingEdited.index = index;
            this.itemBeingEdited.oldItem = this.items[this.itemBeingEdited.index];
            this.changingItem = 'deleting';
        }
    };

    resetChangingItem() {
        this.changingItem = '';
        this.itemBeingEdited.newItem = null;
        if (this.itemBeingEdited.index > -1) {
            this.items[this.itemBeingEdited.index] = this.itemBeingEdited.oldItem;
            this.itemBeingEdited.index = -1;
        }
        this.itemBeingEdited.oldItem = null;

    }

    finishChangingItem() {
        // TODO: Move into link function.
        const formElement = $('.ui.list-item.form.' + this.itemClass);
        if (formElement.length > 0 && !formElement.form('is valid')) {
            return;
        }

        if (this.changingItem === 'adding') {
            this.items.push(this.itemBeingEdited.newItem);
        } else if (this.changingItem === 'editing') {
            this.items[this.itemBeingEdited.index] = this.itemBeingEdited.newItem;
            this.itemBeingEdited.index = -1;
        } else if (this.changingItem === 'deleting') {
            this.items.splice(this.itemBeingEdited.index, 1);
            this.itemBeingEdited.index = -1;
        }

        this.resetChangingItem();
    };

    cancelChangingItem() {
        this.resetChangingItem();
    };

    getModelPath(item) {
        return 'itemBeingEdited.newItem.' + item.modelPath;
    };
}

let ItemAddEditDeleteListComponent = {
    bindings: {
        items: '=',
        itemName: '@',
        itemTitle: '@',
        itemClass: '@',
        newItemPrototype: '=',
        itemParams: '=',
        getDisplayText: '=',
        formValidation: '='
    },
    controller: ItemAddEditDeleteListComponentController,
    templateUrl: 'common/itemAddEditDeleteList.html'
};

export default ItemAddEditDeleteListComponent;
