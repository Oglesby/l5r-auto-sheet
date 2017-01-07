'use strict';

let SpellsComponent = {
    bindings: {
        model: '='
    },
    templateUrl: 'spells/spells.html',
    link: (scope, element) => {
        scope.$watch('model', (newValue) => {
            if (newValue && newValue.spells && newValue.spells.length > 0) {
                element.addClass('sixteen wide column');
            } else {
                element.removeClass('sixteen wide column');
            }
        });
    }
};

export default SpellsComponent;