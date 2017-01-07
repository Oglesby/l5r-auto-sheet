'use strict';

import _ from 'lodash';

class SkillsTableComponentController {
    constructor(ringService) {
        this.ringService = ringService;
    }

    getTraitForSkill(skill) {
        let traitId;
        if (skill.type.traitId) {
            traitId = skill.type.traitId;
        } else if (skill.type.subSkills) {
            const subSkill = _.find(skill.type.subSkills, {name: skill.choosing});

            if (!subSkill) {
                // TODO: This is the case where it's custom. What do we do here?
                traitId = '*';
            } else {
                traitId = subSkill.traitId;
            }
        }

        if (traitId === '*') {
            return 'Various';
        }

        return this.ringService.findTraitById(traitId, $scope.model).name;
    };
}

export let SkillsComponent = {
    bindings: {
        model: '='
    },
    templateUrl: 'skills/skills.html'
};

export let SkillsTableComponent = {
    bindings: {
        model: '='
    },
    templateUrl: 'skills/skillsTable.html',
    controller: SkillsTableComponentController
};
