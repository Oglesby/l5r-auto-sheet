'use strict';

class NavController {
    constructor($state, characterService) {
        this.getCurrentCharacterId = characterService.getCurrentCharacterId;

        this.onApprove = function () {
            characterService.deleteCharacter(this.getCurrentCharacterId());
            // TODO: navigate somewhere here.
        };
    }
}

let NavComponent = {
    templateUrl: 'nav/nav.html',
    controller: NavController,
    link: (scope, element) => {
        const modal = $(element).find('.ui.modal');
        modal.modal({
            onApprove: scope.onApprove
        });

        scope.onDelete = () => {
            modal.modal('show');
        };
    }
};

export default NavComponent;

