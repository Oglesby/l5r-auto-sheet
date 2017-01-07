'use strict';

import _ from 'lodash';
import $ from 'jquery';

class AddEditCreationComponentController {

    constructor($timeout, clanService, familyService, schoolService, skillService, logService, modelService) {
        this.clans = clanService;
        this.families = familyService;
        this.schools = schoolService;
        this.skillService = skillService;
        this.logService = logService;
        this.modelService = modelService;

        this.schoolChoices = [];
        if (!this.logModel) {
            this.selectedClanId = null;
            this.selectedFamilyId = null;
            this.selectedSchoolId = null;
            this.differentSchool = false;
            this.initialXp = 40;
        } else {
            this.selectedClanId = this.logModel.clan;
            this.selectedFamilyId = this.logModel.family;
            this.selectedSchoolId = this.logModel.school.id;
            this.initialXp = this.logModel.initialXp;

            // TODO: Fix the direct ID reference?
            const differentSchoolExpenditure = _.find(this.logModel.mandatoryExpenditures, {id: 'differentSchool'});
            this.differentSchool = !!differentSchoolExpenditure;

            if (this.logModel.school.options) {
                this.updateSchoolChoices(this.selectedSchoolId);

                let index = 0;
                this.logModel.school.options.chosenSkills.forEach((chosenSkill) => {
                    this.schoolChoices[index++].decision.skill = chosenSkill;
                });
            }
        }

        // $scope.$watch('schoolChoices', function() {
             this.refreshLog();
        // }, true);

        $timeout(() => {
            // TODO: move into link function.
            $('.ui.initial.form').form({
                fields: {
                    clan: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a clan.'
                        }]
                    },
                    school: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a school.'
                        }]
                    },
                    family: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter a family.'
                        }]
                    },
                    initialXp: {
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter an initial XP.'
                        }]
                    }
                }
            });
        });
    }

    updateSchoolChoices(selectedSchoolId) {
        const selectedSchool = _.find(this.schools, {id: selectedSchoolId});
        const choices = [];
        if (selectedSchool && selectedSchool.choices) {
            selectedSchool.choices.forEach( (choice) => {
                choices.push({
                    choice: choice,
                    decision: {}
                });
            });
        }

        this.schoolChoices.length = 0;
        Array.prototype.push.apply(this.schoolChoices, choices);
    }

    canChooseFamily(familyId) {
        if (!this.selectedClanId) {
            return false;
        }

        const family = _.find(this.families, {id: familyId});
        const selectedClan = _.find(this.clans, {id: this.selectedClanId});

        return familyId === 'none' || (selectedClan.families.indexOf(family.id) > -1);
    };

    canChooseSchool(schoolId) {
        if (!this.selectedClanId) {
            return false;
        }

        const school = _.find(this.schools, {id: schoolId});
        const selectedClan = _.find(this.clans, {id: this.selectedClanId});

        return this.differentSchool || schoolId === 'none' || (selectedClan.schools.indexOf(school.id) > -1);
    };

    hasSchoolChoices() {
        return this.schoolChoices.length > 0;
    };

    getSchoolChoices() {
        return this.schoolChoices;
    };

    setClan() {
        this.selectedFamilyId = null;
        this.selectedSchoolId = null;
        // TODO: Move into link function.
        $('.clan.dropdown').removeClass('error');
        $('.family.dropdown').dropdown('clear');
        $('.school.dropdown').dropdown('clear');
    };

    setFamily() {
        // TODO: Move into link function.
        $('.family.dropdown').removeClass('error');

        this.refreshLog();
    };

    setSchool() {
        // TODO: Move into link function.
        $('.school.dropdown').removeClass('error');
        this.updateSchoolChoices(this.selectedSchoolId);

        this.refreshLog();
    };

    onDifferentSchoolChange() {
        if (!this.differentSchool && !this.canChooseSchool(this.selectedSchoolId)) {
            this.selectedSchoolId = null;
            // TODO: Move into link function.
            $('.school.dropdown').dropdown('clear');
        }
    };

    refreshLog() {
        const logId = this.logModel ? this.logModel.id : this.creationLogModel ? this.creationLogModel.id : undefined;

        const school = {
            id: this.selectedSchoolId ? this.selectedSchoolId : 'none',
            options: {
                chosenSkills: _(this.schoolChoices).filter((choice) => {
                    return !!choice.decision.skill;
                }).map((choice) => {
                    return choice.decision.skill;
                }).value()
            }
        };

        this.creationLogModel = this.logService.makeCreationLogModel(this.initialXp,
            this.selectedClanId, this.selectedFamilyId, school, this.differentSchool);
        this.creationLogModel.id = logId;

        if (!this.logModel) {
            this.modelService.addOrUpdateLogInModel(this.creationLogModel);
        }
    };

    save() {
        // TODO: Move into link function.
        const form = $('.ui.initial.form');
        form.form('validate form');
        if (!form.form('is valid')) {
            return;
        }

        const choiceFields = {
            fields: {}
        };
        _.forEach(this.schoolChoices, (schoolChoice) => {
            _.merge(choiceFields.fields, schoolChoice.decision.formValidation);
        });
        form.form(choiceFields);
        form.form('validate form');
        if (!form.form('is valid')) {
            return;
        }

        if (this.logModel) {
            this.creationLogModel.creationTimestamp = this.logModel.creationTimestamp;
            this.creationLogModel.id = this.logModel.id;
        } else {
            this.creationLogModel.creationTimestamp = new Date().toISOString();
        }

        this.modelService.addOrUpdateLogInModel(this.creationLogModel);
        this.onSave(this.creationLogModel);
    };

    cancel() {
        this.onCancel();
    };
}

let AddEditCreationComponent = {
    bindings: {
        logModel: '=',
        onSave: '<',
        onCancel: '<'
    },
    controller: AddEditCreationComponentController,
    templateUrl: 'log/entryViews/addEditCreation.html'
};

export default AddEditCreationComponent;
