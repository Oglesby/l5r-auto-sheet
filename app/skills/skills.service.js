'use strict';

angular.module('pocketIkoma').service('skillService', function(_) {
    var Skill = function (id, name, traitId, description, availableEmphases, keywords, subSkills) {
        this.id = id;
        this.name = name;
        this.traitId = traitId;
        this.description = description;
        this.availableEmphases = availableEmphases;
        this.subSkills = subSkills;
        this.xpMult = 1;
        this.xpMod = 0;
        this.keywords = keywords;
    };
    Skill.prototype.increase = function (model, options) {
        options = options || {};
        model.skills = model.skills || [];

        var id = this.id,
            skill = _.find(model.skills, function (item) {
                return item.type && item.type.id === id && item.choosing === options.choosing;
            });

        if (!skill) {
            skill = {
                'type': this,
                'rank': 1,
                'emphases': [],
                'masteryAbilities': [],
                'schoolSkill': !!options.schoolSkill
            };

            if (options.choosing) {
                skill.choosing = options.choosing;
            }

            model.skills.push(skill);
        } else {
            skill.rank++;
        }
        return skill;
    };
    Skill.prototype.purchase = function (model, options, costOverride) {
        var skill = this.increase(model, options);
        var xpCost = _.isUndefined(costOverride) ? skill.rank : costOverride;

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var description = skill.type.name;
        if (options && options.choosing) {
            description += ': ' + options.choosing;
        }

        var invalidReasons = [];
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' ' + Number(skill.rank).toString() + ' at this point.');
        }
        return {cost: xpCost, newValue: skill.rank, name: description, invalidReasons: invalidReasons};
    };
    Skill.prototype.addEmphasis = function (model, emphasis, options) {
        options = options || {};
        var id = this.id,
            skill = _.find(model.skills, function (item) {
                return item.type && item.type.id === id && item.choosing === options.choosing;
            });

        if (!skill) {
            throw Error('Couldn\'t find a skill with ID ' + id + ' to add emphasis ' + emphasis + ' to.');
        } else {
            skill.emphases.push(emphasis);
        }

        return skill;
    };
    Skill.prototype.purchaseEmphasis = function (model, emphasis, options) {
        var skill = this.addEmphasis(model, emphasis, options);
        var xpCost = 2;

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var description = skill.type.name;
        if (options && options.choosing) {
            description += ': ' + options.choosing;
        }

        var invalidReasons = [];
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }

        return {cost: xpCost, name: emphasis, skill: description, invalidReasons: invalidReasons};
    };

    var json = [
        // High
        {
            id: 'acting',
            name: 'Acting',
            traitId: 'awareness',
            description: '',
            keywords: ['high', 'social', 'perform'],
            availableEmphases: ['Clan', 'Gender', 'Profession']
        }, {
            id: 'artisan',
            name: 'Artisan',
            description: '',
            traitId: 'awareness',
            keywords: ['high', 'macro'],
            subSkills: [{
                name: 'Bonsai',
                availableEmphases: ['*']
            }, {
                name: 'Gardening',
                availableEmphases: ['*']
            }, {
                name: 'Ikebana',
                availableEmphases: ['*']
            }, {
                name: 'Origami',
                availableEmphases: ['*']
            }, {
                name: 'Painting',
                availableEmphases: ['*']
            }, {
                name: 'Poetry',
                availableEmphases: ['*']
            }, {
                name: 'Sculpture',
                availableEmphases: ['*']
            }, {
                name: 'Tattooing',
                availableEmphases: ['*']
            }]
        }, {
            id: 'calligraphy',
            name: 'Calligraphy',
            traitId: 'intelligence',
            description: '',
            keywords: ['high', 'artisan'],
            availableEmphases: ['Cipher', 'High Rokugani']
        }, {
            id: 'courtier',
            name: 'Courtier',
            traitId: 'awareness',
            description: '',
            keywords: ['high', 'social'],
            availableEmphases: ['Gossip', 'Manipulation', 'Rhetoric']
        }, {
            id: 'divination',
            name: 'Divination',
            traitId: 'intelligence',
            description: '',
            keywords: ['high'],
            availableEmphases: ['Astrology', 'Kawaru']
        }, {
            id: 'empathy',
            name: 'Empathy',
            traitId: 'awareness',
            description: '',
            keywords: ['high', 'social'],
            availableEmphases: ['Emotion', 'Interrogation', 'Personalities']
        }, {
            id: 'etiquette',
            name: 'Etiquette',
            traitId: 'awareness',
            description: '',
            keywords: ['high', 'social'],
            availableEmphases: ['Bureaucracy', 'Conversation', 'Courtesy']
        }, {
            id: 'games',
            name: 'Games',
            description: '',
            keywords: ['high', 'macro'],
            subSkills: [{
                name: 'Fortunes and Winds',
                traitId: 'awareness',
                availableEmphases: ['*']
            }, {
                name: 'Go',
                traitId: 'intelligence',
                availableEmphases: ['*']
            }, {
                name: 'Kemari',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Letters',
                traitId: 'awareness',
                availableEmphases: ['*']
            }, {
                name: 'Sadane',
                traitId: 'awareness',
                availableEmphases: ['*']
            }, {
                name: 'Shogi',
                traitId: 'intelligence',
                availableEmphases: ['*']
            }]
        }, {
            id: 'investigation',
            name: 'Investigation',
            traitId: 'perception',
            description: '',
            keywords: ['high'],
            availableEmphases: ['Interrogation', 'Notice', 'Search']
        }, {
            id: 'lore',
            name: 'Lore',
            description: '',
            traitId: 'intelligence',
            keywords: ['high', 'macro'],
            subSkills: [{
                name: 'Anatomy',
                availableEmphases: ['*']
            }, {
                name: 'Architecture',
                availableEmphases: ['*']
            }, {
                name: 'Bushido',
                availableEmphases: ['*']
            }, {
                name: 'Great Clan',
                availableEmphases: ['*'],
                choices: ['Crab', 'Crane', 'Dragon', 'Lion', 'Mantis', 'Phoenix', 'Scorpion', 'Unicorn', '*']
            }, {
                name: 'Elements',
                availableEmphases: ['*']
            }, {
                name: 'Gaijin Culture',
                availableEmphases: ['*'],
                choices: ['Yobanjin', 'Thrane', '*']
            }, {
                name: 'Ghosts',
                availableEmphases: ['*']
            }, {
                name: 'Heraldry',
                availableEmphases: ['*']
            }, {
                name: 'History',
                availableEmphases: ['*']
            }, {
                name: 'Maho',
                availableEmphases: ['*']
            }, {
                name: 'Nature',
                availableEmphases: ['*']
            }, {
                name: 'Nonhuman Culture',
                availableEmphases: ['*'],
                choices: ['Naga', 'Ratling', '*']
            }, {
                name: 'Omens',
                availableEmphases: ['*']
            }, {
                name: 'Shadowlands',
                availableEmphases: ['*']
            }, {
                name: 'Shugenja',
                availableEmphases: ['*']
            }, {
                name: 'Spirit Realms',
                availableEmphases: ['*']
            }, {
                name: 'Theology',
                availableEmphases: ['*']
            }, {
                name: 'Underworld',
                availableEmphases: ['*']
            }]
        }, {
            id: 'medicine',
            name: 'Medicine',
            traitId: 'intelligence',
            description: '',
            keywords: ['high'],
            availableEmphases: ['Antidotes', 'Disease', 'Herbalism', 'Non-Humans', 'Wound Treatment']
        }, {
            id: 'meditation',
            name: 'Meditation',
            traitId: 'void',
            description: '',
            keywords: ['high'],
            availableEmphases: ['Fasting', 'Void Recovery']
        }, {
            id: 'perform',
            name: 'Perform',
            description: '',
            keywords: ['high', 'macro'],
            subSkills: [{
                name: 'Biwa',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Dance',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Drums',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Flute',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Oratory',
                traitId: 'awareness',
                availableEmphases: ['*']
            }, {
                name: 'Puppeteer',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Samisen',
                traitId: 'agility',
                availableEmphases: ['*']
            }, {
                name: 'Song',
                traitId: 'awareness',
                availableEmphases: ['*']
            }, {
                name: 'Storytelling',
                traitId: 'awareness',
                availableEmphases: ['*']
            }]
        }, {
            id: 'sincerity',
            name: 'Sincerity',
            traitId: 'awareness',
            description: '',
            keywords: ['high', 'social'],
            availableEmphases: ['Honesty', 'Deceit']
        }, {
            id: 'spellcraft',
            name: 'Spellcraft',
            traitId: 'intelligence',
            description: '',
            keywords: ['high'],
            availableEmphases: ['Importune', 'Spell Research']
        }, {
            id: 'teaCeremony',
            name: 'Tea Ceremony',
            traitId: 'void',
            description: '',
            keywords: ['high'],
            availableEmphases: ['']
        },
        // Bugei
        {
            id: 'athletics',
            name: 'Athletics',
            traitId: 'strength',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Climbing', 'Running', 'Throwing', 'Swimming']
        }, {
            id: 'battle',
            name: 'Battle',
            traitId: 'perception',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Mass Combat', 'Skirmish']
        }, {
            id: 'defense',
            name: 'Defense',
            traitId: 'reflexes',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['']
        }, {
            id: 'horsemanship',
            name: 'Horsemanship',
            traitId: 'agility',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Gaijin Riding Horse', 'Rokugani Pony', 'Utaku Steed']
        }, {
            id: 'hunting',
            name: 'Hunting',
            traitId: 'perception',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Survival', 'Tracking', 'Trailblazing']
        }, {
            id: 'iaijutsu',
            name: 'Iaijutsu',
            traitId: 'reflexes',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Assessment', 'Focus']
        }, {
            id: 'jiujutsu',
            name: 'Jiujutsu',
            traitId: 'agility',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Grappling', 'Improvised Weapons', 'Martial Arts']
        }, {
            id: 'weapons',
            name: 'Weapons (Other)',
            traitId: '*',
            description: '',
            keywords: ['bugei', 'weapon', 'macro'],
            subSkills: []
        }, {
            id: 'chainWeapons',
            name: 'Chain Weapons',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Kusarigama', 'Kyoketsu-shogi', 'Manrikikusari']
        }, {
            id: 'heavyWeapons',
            name: 'Heavy Weapons',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Dai Tsuchi', 'Masakari', 'Ono', 'Tetsubo']
        }, {
            id: 'kenjutsu',
            name: 'Kenjutsu',
            traitId: 'agility',
            description: '',
            keywords: ['bugei'],
            availableEmphases: ['Katana', 'Ninja-to', 'No-dachi', 'Parangu', 'Scimitar', 'Wakazashi']
        }, {
            id: 'knives',
            name: 'Knives',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Aiguchi', 'Jute', 'Kama', 'Sai', 'Tanto']
        }, {
            id: 'kyujutsu',
            name: 'Kyujutsu',
            traitId: 'reflexes',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Dai-kyu', 'Han-kyu', 'Yumi']
        }, {
            id: 'ninjutsu',
            name: 'Ninjutsu',
            traitId: '*',
            description: '',
            keywords: ['bugei', 'weapon', 'low'],
            availableEmphases: ['Blowgun', 'Shuriken', 'Tsubute']
        }, {
            id: 'polearms',
            name: 'Polearms',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Bisento', 'Nagamaki', 'Naginata', 'Sasumata', 'Sodegarami']
        }, {
            id: 'spears',
            name: 'Spears',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Mai Chong', 'Kumade', 'Lance', 'Nage-yari', 'Yari']
        }, {
            id: 'staves',
            name: 'Staves',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: ['Bo', 'Jo', 'Machi-kanshisha', 'Nunchaku', 'Sang Kauw', 'Tonfa']
        }, {
            id: 'warFan',
            name: 'War Fan',
            traitId: 'agility',
            description: '',
            keywords: ['bugei', 'weapon'],
            availableEmphases: []
        }, {
            id: 'animalHandling',
            name: 'Animal Handling',
            traitId: 'awareness',
            description: '',
            keywords: ['merchant'],
            availableEmphases: ['Dogs', 'Horses', 'Falcons', '*']
        }, {
            id: 'commerce',
            name: 'Commerce',
            traitId: 'intelligence',
            description: '',
            keywords: ['merchant'],
            availableEmphases: ['Appraisal', 'Mathematics']
        }, {
            id: 'craft',
            name: 'Craft',
            description: '',
            keywords: ['merchant', 'macro'],
            subSkills: [{
                name: 'Armorsmithing',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Blacksmithing',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Bowyer',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Carpentry',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Cartography',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Cobbling',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Cooking',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Farming',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Fishing',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Masonry',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Mining',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Poison',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Pottery',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Shipbuilding',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Tailoring',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Weaponsmithing',
                traitId: '*',
                availableEmphases: ['*']
            }, {
                name: 'Weaving',
                traitId: '*',
                availableEmphases: ['*']
            }]
        }, {
            id: 'engineering',
            name: 'Engineering',
            traitId: 'intelligence',
            description: '',
            keywords: ['merchant'],
            availableEmphases: ['Construction', 'Siege']
        }, {
            id: 'sailing',
            name: 'Sailing',
            traitId: '*',
            description: '',
            keywords: ['merchant'],
            availableEmphases: ['Knots', 'Navigation']
        }, {
            id: 'forgery',
            name: 'Forgery',
            traitId: 'agility',
            description: '',
            keywords: ['low'],
            availableEmphases: ['Artwork', 'Documents', 'Personal Seals', '*']
        }, {
            id: 'intimidation',
            name: 'Intimidation',
            traitId: 'awareness',
            description: '',
            keywords: ['low', 'social'],
            availableEmphases: ['Bullying', 'Control', 'Torture']
        }, {
            id: 'sleightOfHand',
            name: 'Sleight of Hand',
            traitId: 'agility',
            description: '',
            keywords: ['low'],
            availableEmphases: ['Conceal', 'Escape', 'Pick Pocket', 'Prestidigitation']
        }, {
            id: 'stealth',
            name: 'Stealth',
            traitId: 'agility',
            description: '',
            keywords: ['low'],
            availableEmphases: ['Ambush', 'Shadowing', 'Sneaking', 'Spell Casting']
        }, {
            id: 'temptation',
            name: 'Temptation',
            traitId: 'awareness',
            description: '',
            keywords: ['low', 'social'],
            availableEmphases: ['Bribery', 'Seduction']
        }
    ];

    function processJson(jsonArray) {
        var skills = {};

        jsonArray.forEach(function(skillJson) {
            var skill = new Skill(skillJson.id, skillJson.name, skillJson.traitId, skillJson.description,
                skillJson.availableEmphases, skillJson.keywords, skillJson.subSkills);
            skills[skill.id] = skill;
        });

        return skills;
    }

    var skills = processJson(json);
    skills.getSkillsWithKeyword = function(keywords) {
        var matchedSkills = [];
        keywords.forEach(function(keyword) {
            matchedSkills = matchedSkills.concat(_.filter(skills, function(skill) {
                return _.includes(skill.keywords, keyword);
            }));
        });
        return _.uniq(matchedSkills);
    };
    skills.getSkillsWithoutKeyword = function(keywords) {
        var matchedSkills = [];
        keywords.forEach(function(keyword) {
            matchedSkills = matchedSkills.concat(_.filter(skills, function(skill) {
                return !_.includes(skill.keywords, keyword) && typeof skill !== 'function';
            }));
        });
        return _.uniq(matchedSkills);
    };
    return skills;
});