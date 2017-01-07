'use strict';

let KihoComponent = {
    bindings: {
        model: '='
    },
    templateUrl: 'kiho/kiho.html',
    link: (scope, element) => {
        scope.$watch('model', (newValue) => {
            if (newValue && newValue.kiho && newValue.kiho.length > 0) {
                element.addClass('sixteen wide column');
            } else {
                element.removeClass('sixteen wide column');
            }
        });
    }
};

export default KihoComponent;
