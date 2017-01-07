'use strict';

import _ from 'lodash';

class SchoolChoiceComponentController {

    constructor(skillService, modelService) {
        this.skillService = skillService;
        this.modelService = modelService;
        // TODO: This all becomes GROSSLY wrong when it's equipment or anything else. Fix that.
    }

    $onInit() {
        if (this.decision.skill && this.decision.skill.id) {
            this.baseSkillId = this.decision.skill.id;
            this.baseSkill = this.skillService[this.baseSkillId];

            if (this.baseSkill.subSkills) {
                this.subSkillText = this.decision.skill.options.choosing;

                if (this.baseSkill.subSkills.indexOf(this.subSkillText) === -1) {
                    this.choosingOther = true;
                    this.otherChoice = this.decision.skill.options.choosing;
                }
            }

        } else {
            this.baseSkillId = null;
            this.baseSkill = null;
            this.choosingOther = false;
            this.otherChoice = null;
        }

        this.decision.formValidation = {};
        this.decision.formValidation['choice' + this.index] = {
            rules: [{
                type: 'empty',
                prompt: 'Please choose a skill.'
            }]
        };

        if (this.choice.type === 'skill') {
            if (this.choice.id) {
                this.choiceOptions = [this.skillService[this.choice.id]];
                this.baseSkillId = this.choice.id;
                this.onSkillChange();
            } else if (this.choice.keywords) {
                this.choiceOptions = this.skillService.getSkillsWithKeyword(this.choice.keywords);
            } else if (this.choice.restrictedKeywords) {
                this.choiceOptions = this.skillService.getSkillsWithoutKeyword(this.choice.restrictedKeywords);
            }

            const modelSkills = _.map(this.modelService.getCurrentModel().skills, (skill) => { return skill.type; });
            this.choiceOptions = _.filter(this.choiceOptions, (skill) => {
                return modelSkills.indexOf(skill) === -1 || (this.decision.skill && this.decision.skill.id === skill.id);
            });
        }
    }

    onSkillChange() {
        this.baseSkill = this.skillService[this.baseSkillId];
        this.decision.skill = {
            id: this.baseSkillId
        };

        if (this.baseSkill.subSkills) {
            this.decision.formValidation['subChoice' + this.index] = {
                rules: [{
                    type: 'empty',
                    prompt: 'Please choose a sub-skill.'
                }]
            };
        }
    };

    onSubSkillChange(newSubSkillText) {
        if (newSubSkillText === 'other') {
            this.choosingOther = true;

            this.decision.formValidation['otherChoice' + this.index] = {
                rules: [{
                    type: 'empty',
                    prompt: 'Please choose an "Other" option.'
                }]
            };

        } else {
            this.decision.skill.options = {
                choosing: newSubSkillText
            };
        }
    };

    onOtherTextChange(otherText) {
        this.decision.skill.options = {
            choosing: otherText
        };
    };
}



let SchoolChoiceComponent = {
    bindings: {
        choice: '=schoolChoice',
        decision: '=schoolDecision',
        index: '='
    },
    controller: SchoolChoiceComponentController,
    templateUrl: 'common/schoolChoice.html'
};

export default SchoolChoiceComponent;
