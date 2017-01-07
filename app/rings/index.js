import angular from 'angular';

let formatViewsModule = angular.module('pi.rings', []);

import {RingBlockComponent, RingLineComponent} from './ring.components';
import RingService from './ring.service';

formatViewsModule.component('piRingBlock', RingBlockComponent);
formatViewsModule.component('piRingLine', RingLineComponent);
formatViewsModule.service('ringService', RingService);
