'use strict';

let DescriptionComponent = {
    bindings: {
        model: '='
    },
    templateUrl: 'basicInfo/description.html',
    link: (scope, element) => {
        scope.$watch('model', (newValue) => {
            if (newValue && newValue.characterInfo.description) {
                element.addClass('sixteen wide column');
            } else {
                element.removeClass('sixteen wide column');
            }
        });
    }
};

export default DescriptionComponent;

