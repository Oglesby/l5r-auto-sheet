'use strict';

angular.module('l5rAutoSheetApp')
    .controller('MainCtrl', function ($scope) {
        $scope.family = 'Hida';
        $scope.name = 'Juzo';
        $scope.clan = 'Crab';
        $scope.schools = [
            {
                name: 'Hida Bushi',
                rank: 3
            },
            {
                name: 'Defender of the Wall',
                rank: 1
            }
        ];
        $scope.rank = 4;
        $scope.xp = 15;
        $scope.insight = 202;
        $scope.rings = {
            earth: {
                icon: 'images/earth_by_exahyl-d3is114.png',
                ring: {
                    name: 'Earth',
                    rank: 4
                },
                physicalTrait: {
                    name: 'Stamina',
                    rank: 4
                },
                spiritualTrait: {
                    name: 'Willpower',
                    rank: 4
                }
            },
            water: {
                icon: 'images/water_ring_by_exahyl-d3is12g.png',
                ring: {
                    name: 'Water',
                    rank: 4
                },
                physicalTrait: {
                    name: 'Strength',
                    rank: 5
                },
                spiritualTrait: {
                    name: 'Perception',
                    rank: 4
                }
            },
            fire: {
                icon: 'images/fire_ring_by_exahyl-d3is13z.png',
                ring: {
                    name: 'Fire',
                    rank: 2
                },
                physicalTrait: {
                    name: 'Agility',
                    rank: 3
                },
                spiritualTrait: {
                    name: 'Intelligence',
                    rank: 2
                }
            },
            air: {
                icon: 'images/air_ring_by_exahyl-d3is15c.png',
                ring: {
                    name: 'Air',
                    rank: 2
                },
                physicalTrait: {
                    name: 'Reflexes',
                    rank: 2
                },
                spiritualTrait: {
                    name: 'Awareness',
                    rank: 2
                }
            },
            void: {
                icon: 'images/void_by_exahyl-d3is16h.png',
                ring: {
                    name: 'Void',
                    rank: 4
                }
            }
        };
    });
