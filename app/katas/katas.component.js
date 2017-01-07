'use strict';

let KataComponent = {
    bindings: {
        model: '='
    },
    templateUrl: 'katas/katas.html',
    link: (scope, element) => {
        scope.$watch('model', (newValue) => {
            if (newValue && newValue.katas && newValue.katas.length > 0) {
                element.addClass('sixteen wide column');
            } else {
                element.removeClass('sixteen wide column');
            }
        });
    }
};

export default KataComponent;
