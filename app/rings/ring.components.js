'use strict';

import '../../assets/images/air_ring_by_exahyl-d3is15c.png'
import '../../assets/images/earth_by_exahyl-d3is114.png'
import '../../assets/images/fire_ring_by_exahyl-d3is13z.png'
import '../../assets/images/water_ring_by_exahyl-d3is12g.png'
import '../../assets/images/void_by_exahyl-d3is16h.png'

class RingController {
    constructor(modelService, ringService) {
        this.modelService = modelService;
        this.ringService = ringService;
        this.isInSpendingMode = modelService.isInSpendingMode;
    }

    purchaseTrait(traitId) {
        let model = this.modelService.getCurrentModel();
        let result = this.ringService.findRingForTrait(traitId, model).purchase(model, traitId);

        this.modelService.addSpendingResult(result);
    };
}

export let RingBlockComponent = {
    bindings: {
        ring: '='
    },
    templateUrl: 'rings/ring.block.html',
    controller: RingController
};

export let RingLineComponent = {
    bindings: {
        ring: '='
    },
    templateUrl: 'rings/ring.line.html',
    controller: RingController
};
