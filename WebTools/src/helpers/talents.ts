import {character} from '../common/character';
import {Skill, SkillsHelper} from './skills';

interface ITalentPrerequisite {
    isPrerequisiteFulfilled(): boolean;
}

class TalentPrerequisite implements ITalentPrerequisite {
    private talent: string;

    constructor(talent: string) {
        this.talent = talent;
    }

    isPrerequisiteFulfilled() {
        var found = false;
        for (var talent in character.talents) {
            if (talent === this.talent) {
                found = true;
                break;
            }
        }

        return found;
    }
}

class TalentRankPrerequisite implements ITalentPrerequisite {
    private talent: string;
    private rank: number;

    constructor(talent: string, rank: number) {
        this.talent = talent;
        this.rank = rank;
    }

    isPrerequisiteFulfilled() {
        var found = false;
        for (var talent in character.talents) {
            var t = character.talents[talent];
            if (talent === this.talent && t.rank >= this.rank) {
                found = true;
                break;
            }
        }

        return found;
    }
}

class VariableTalentPrerequisite implements ITalentPrerequisite {
    private talent1: string;
    private talent2: string;

    constructor(talent1: string, talent2: string) {
        this.talent1 = talent1;
        this.talent2 = talent2;
    }

    isPrerequisiteFulfilled() {
        var found = false;
        for (var talent in character.talents) {
            if (talent === this.talent1 || talent === this.talent2) {
                found = true;
                break;
            }
        }

        return found;
    }
}

class ExpertisePrerequisite implements ITalentPrerequisite {
    private skill: Skill;
    private value: number;

    constructor(skill: Skill, value: number) {
        this.skill = skill;
        this.value = value;
    }

    isPrerequisiteFulfilled() {
        return character.skills[this.skill].expertise >= this.value;
    }
}

class FocusPrerequisite implements ITalentPrerequisite {
    private skill: Skill;
    private value: number;

    constructor(skill: Skill, value: number) {
        this.skill = skill;
        this.value = value;
    }

    isPrerequisiteFulfilled() {
        return character.skills[this.skill].focus >= this.value;
    }
}

export class TalentModel {
    name: string;
    description: string;
    prerequisites: ITalentPrerequisite[];
    maxRank: number;

    constructor(name: string, desc: string, prerequisites: ITalentPrerequisite[], maxRank: number) {
        this.name = name;
        this.description = desc;
        this.prerequisites = prerequisites;
        this.maxRank = maxRank;
    }
}

export class TalentViewModel {
    id: string;
    name: string;
    rank: number;
    description: string;

    constructor(name: string, rank: number, showRank: boolean, description: string, skill: Skill) {
        this.id = name;
        this.description = description;
        this.name = name + (showRank ? ' [Rank: ' + rank + ']' : '') + ' (' + SkillsHelper.getSkillName(skill) + ')';
    }
}

export enum TalentSpecial {
    MaximumRanks_EducationFocus = -1,
    MaximumRanks_ScienceFocus = -2,
    MaximumRanks_SurvivalFocus = -3
}

export class Talents {
    private _talents: { [skill: number]: TalentModel[] } = {
        [Skill.Acrobatics]: [
            new TalentModel(
                "Catfall",
                "The character has learned to take advantage of wind resistance and surface conditions when making a landing. For every rank of Catfall, the character treats the distance fallen as being one zone shorter when calculating damage.",
                [new TalentPrerequisite("Long Jumper"), new ExpertisePrerequisite(Skill.Acrobatics, 2)],
                3),
            new TalentModel(
                "Free Runner",
                "A Free Runner trains to recognise the environment and let his body move naturally in response to it, taking advantage of the terrain’s effects. A character with this talent may ignore all effects of moving through difficult terrain. This does not include hazardous terrain.",
                [new TalentPrerequisite("Graceful")],
                3),
            new TalentModel(
                "Graceful",
                "The character may reroll one d20 when making an Acrobatics test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Acrobatics, 1)],
                1),
            new TalentModel(
                "Long Jumper",
                "The character is able to leap extraordinary distances. When making an Acrobatics test to jump, the character reduces the difficulty by one rank, to a minimum of Simple D0.",
                [new TalentPrerequisite("Graceful")],
                1),
            new TalentModel(
                "Roll With It",
                "When the character fails a Defence test against a melee attack or a ranged attack with the Blast quality, they gain additional [CD] Cover Soak equal to the character’s Acrobatics Focus.",
                [new TalentPrerequisite("Catfall")],
                1),
            new TalentModel(
                "Total Reaction",
                "During combat, the character is in a constant state of fluid motion, making it difficult to hit them with ranged attacks. When they take a Defence reaction against ranged attacks, each rank of Total Reaction counts as an additional point of Acrobatics Focus. (This can increase the character’s effective Acrobatics Focus above its normal limits. For example, their effective Focus may be higher than their Acrobatics Expertise.)",
                [new TalentPrerequisite("Graceful")],
                3),
            new TalentModel(
                "Uncanny Dodge",
                "The character has a natural sense for when their life might be endangered. They make a Defence reaction against any ranged attacks, including ones they might not have any immediately apparent reason to know about. (They must still pay the normal Momentum cost for taking a reaction.)",
                [new TalentPrerequisite("Total Reaction"), new ExpertisePrerequisite(Skill.Acrobatics, 2)],
                1)
        ],
        [Skill.Analysis]: [
            new TalentModel(
                "Code Breaker",
                "The character has developed an uncanny insight into cryptographic patterns and the quantronic tools required to crack them. When making an Analysis test related to cryptography, the character reduces the difficulty by one per rank of Code Breaker, to a minimum of Simple D0.",
                [new TalentPrerequisite("Pattern Recognition")],
                3),
            new TalentModel(
                "Combat Analysis",
                "During combat, the character may attempt an Average D1 Analysis test as a Minor Action. On a success, they can identify one special power, hidden piece of equipment, technological advantage, alien ability, or similar effect that an opponent has in use. Each Momentum spent allows the character to recognise one additional effect.",
                [new ExpertisePrerequisite(Skill.Analysis, 2), new TalentPrerequisite("New Perspective")],
                1),
            new TalentModel(
                "Data Analysis",
                "When analysing data, the character enters a fugue state. Each rank of Data Analysis counts as an additional point of Analysis Focus. This can increase the character’s effective Analysis Focus above its normal limits.",
                [new TalentPrerequisite("Pattern Recognition")],
                2),
            new TalentModel(
                "Information Integration",
                "The character is skilled at rapidly collating and integrating information from a team of assistants. When analysing data as a teamwork test, those assisting the character may roll two d20 each, instead of being limited to a single d20.",
                [new TalentPrerequisite("Data Analysis"), new ExpertisePrerequisite(Skill.Analysis, 2)],
                1),
            new TalentModel(
                "Microscopic Threats",
                "The character has a knack for recognizing the subtle clues of biological, chemical, nanonic, and similar threats. Whenever the character is in the presence of biohazards that would be protected by BTS – even if the character is not aware of it – the GM should call for the character to make a Challenging (D2) Analysis test. On a success, the character recognises the presence of the threat and may spend Momentum to identify protective measures against said threat. Every Momentum spent increases BTS by 1 against that attack for the remainder of the scene. A second rank of Microscopic Threats reduces the difficulty of this check to Average (D1).",
                [new TalentPrerequisite("Pattern Recognition")],
                2),
            new TalentModel(
                "New Perspective",
                "The character can intuitively analyse the world around them. They may substitute their Analysis skill for Observation for any task which is not a split second reaction.",
                [new TalentPrerequisite("Pattern Recognition")],
                1),
            new TalentModel(
                "Pattern Recognition",
                "The character may reroll one d20 when making an Analysis test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Analysis, 1)],
                1)
        ],
        [Skill.Animal_Handling]: [
            new TalentModel(
                "Animal Healer",
                "Any time the character is called upon to make a Medicine test upon an animal, they may instead use their Animal Handling skill. Characters with this talent may also substitute their Animal Handling skill for Medicine tests upon humans, but increase the difficulty of such tests by one rank.",
                [new TalentPrerequisite("Symbiosis"), new ExpertisePrerequisite(Skill.Animal_Handling, 2)],
                1),
            new TalentModel(
                "Firm Hand",
                "The character has experience with animals that are resistant to training. Any time the character attempts to direct an animal to take an action that goes against its instinct or training – including if the animal is in service to another – any Momentum spent or Heat paid to add extra dice to the skill test add two d20s to the dice pool instead of one. (The normal maximum of three bonus d20s still applies.)",
                [new TalentPrerequisite("Recognise Cues"), new ExpertisePrerequisite(Skill.Animal_Handling, 2)],
                1),
            new TalentModel(
                "Recognise Cues",
                "The character has come to recognise when and how an animal is reacting to their environment. Any time the character is in the company of animals and needs to make an Observation test, they may substitute their Animal Handling skill instead. This includes active searches if the character can use an animal to aid in the search.",
                [new TalentPrerequisite("Wild Empathy")],
                1),
            new TalentModel(
                "Smells Right",
                "Any time the character encounters a new animal, they make an Average (D1) Observation test as a minor action. On a success, the animal immediately considers them a friend. If the target is a guard animal, it does not alert its handlers to the character’s presence.",
                [new TalentPrerequisite("Firm Hand")],
                1),
            new TalentModel(
                "Strong Rider",
                "The character is particularly adept at riding mounts. When making a skill test to ride an animal, the character reduces the difficulty by one rank. This may eliminate the need for the skill check.",
                [new TalentPrerequisite("Wild Empathy")],
                1),
            new TalentModel(
                "Symbiosis",
                "The character is particularly adept at recognising the needs of their animal companions. Any time the character succeeds on a Survival test, they automatically also find food and shelter for their animal companions. (Note that the presence of animals does not increase the difficulty of the test for characters with this talent.)",
                [new TalentPrerequisite("Wild Empathy")],
                1),
            new TalentModel(
                "Wild Empathy",
                "Having spent much of their lives in the company of animals, the character can quickly recognise personality quirks and sources of distress. On any Animal Handling test where the character generates at least one success, they may immediately roll an additional number of bonus d20s equal to their ranks in Wild Empathy. Any successes generated on these additional dice are added to the initial success total and repercussions on these additional dice may be ignored.",
                [new ExpertisePrerequisite(Skill.Animal_Handling, 1)],
                3)
        ],
        [Skill.Athletics]: [
            new TalentModel(
                "Cliff Dweller",
                "The endless hours of climbing have made vertical surfaces a natural environment for the character. The character never suffers from vertigo or a fear of heights. In addition, they may reduce the difficulty of any climbing test by one step per rank of Cliff Dweller, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Rigorous Training")],
                3),
            new TalentModel(
                "Irresistible Force",
                "The character gains the weapon quality Knockdown on all melee attacks.",
                [new TalentPrerequisite("Leverage"), new ExpertisePrerequisite(Skill.Athletics, 2)],
                1),
            new TalentModel(
                "Leverage",
                "Due to a combination of training and technique, the character is able to perform feats of strength that seem at odds with their physique. On any test to lift or move an inanimate object where the character generates at least one success, they may immediately roll a number of bonus d20s equal to their ranks in Leverage. Any successes generated on these additional dice are added to the initial success total and repercussions on these additional dice may be ignored.",
                [new TalentPrerequisite("Rigorous Training")],
                3),
            new TalentModel(
                "Rigorous Training",
                "The character is exceptionally athletic and physically gifted. For each rank of Rigorous Training, the character generates one bonus Momentum on any Athletics test.",
                [new ExpertisePrerequisite(Skill.Athletics, 1)],
                3),
            new TalentModel(
                "Strong Grip",
                "The character never drops or surrenders an object unless they have chosen to do so. They are immune to any attempt to forcibly disarm them or otherwise knock a weapon or other held object from their hands.",
                [new TalentPrerequisite("Irresistible Force")],
                1),
            new TalentModel(
                "Strong Swimmer",
                "The character is a prodigious swimmer. He reduces the difficulty of any swimming test by one step per rank of Strong Swimmer. This may eliminate the need for the skill test.",
                [new TalentPrerequisite("Rigorous Training")],
                3),
            new TalentModel(
                "Wall Crawler",
                "The character has learned to climb comfortably without equipment, even while carrying significant burdens. They never suffer any penalty for climbing without proper equipment. Furthermore, if rope, harness, or other climbing equipment is available, they can add a bonus d20 to their Athletics test.",
                [new TalentPrerequisite("Cliff Dweller"), new ExpertisePrerequisite(Skill.Athletics, 2)],
                1)
        ],
        [Skill.Ballistics]: [
            new TalentModel(
                "Clear Shot",
                "The character reduces the penalty for firing at a range other than the weapon’s optimal range by one step (to a minimum of zero).",
                [new TalentPrerequisite("Marksman")],
                1),
            new TalentModel(
                "Double Tap",
                "If the character succeeds at a ranged attack and spends Momentum or an Infinity Point to make another attack with the same weapon against the same target, the difficulty of the attack is decreased by one step, to a minimum of Average (D1). Double Tap can only be used once per turn per rank in the talent.",
                [new TalentPrerequisite("Speed Loader")],
                2),
            new TalentModel(
                "Marksman",
                "When making a ranged attack, a character with this talent may reroll a number of damage dice equal to the number of Ballistics talents they have acquired. (As normal, each die may only be re-rolled once.)",
                [new ExpertisePrerequisite(Skill.Ballistics, 1)],
                1),
            new TalentModel(
                "Precise Shot",
                "When spending Momentum for a Called Shot with a ranged attack it only costs one Momentum (instead of two).",
                [new TalentPrerequisite("Clear Shot"), new ExpertisePrerequisite(Skill.Ballistics, 2)],
                1),
            new TalentModel(
                "Quick Draw",
                "The character can draw a weapon or other item as a free action (instead of the normal minor action). This can only be done once per turn, although when the Quick Draw action is taken the character can draw a different item into each hand (in order to dual wield pistols, for example). This talent exists for both the Ballistics and Close Combat skill, and if it is purchased for either skill it can be used as a prerequisite for talents in the other skill.",
                [new TalentPrerequisite("Marksman")],
                1),
            new TalentModel(
                "Speed Loader",
                "The character can disassemble and reassemble their weapon and its components with little thought. During combat, they may spend a Minor Action to increase their rate of fire, allowing them to count the weapon’s Burst as one higher than its listed value.",
                [new TalentPrerequisite("Quick Draw"), new ExpertisePrerequisite(Skill.Ballistics, 2)],
                1),
            new TalentModel(
                "Through and Through",
                "When the character spends Momentum on a Secondary Target effect for a ranged attack it only costs one Momentum (instead of two). In addition, the character can use this Momentum spend a number of times equal to their ranks of Through and Through on any given attack.",
                [new TalentPrerequisite("Marksman")],
                3)
        ],
        [Skill.Close_Combat]: [
            new TalentModel(
                "Combat Specialist",
                "Each point of Momentum or Heat the character pays to gain additional dice for a Close Combat test provides two dice instead of one. (The normal maximum of three bonus d20s still applies.)",
                [new TalentPrerequisite("Martial Artist")],
                1),
            new TalentModel(
                "Deflection",
                "Characters with this talent reduce the Heat cost of Defence or Guard reactions using the Close Combat skill by one. (This can reduce the cost to zero, but no less.)",
                [new TalentPrerequisite("Martial Artist")],
                1),
            new TalentModel(
                "Martial Artist",
                "When making a melee attack, a character with this talent may reroll a number of damage dice equal to the number of Close Combat talents they have acquired. (As normal, these dice may only be re-rolled once.)",
                [new ExpertisePrerequisite(Skill.Close_Combat, 1)],
                1),
            new TalentModel(
                "Master Deflection",
                "On any Defence or Guard reaction using the Close Combat skill where the character generates at least one success, they may immediately roll an additional number of d20s equal to their ranks in Master Deflection. Any successes generated on these additional dice are added to the initial success total and repercussions on these additional dice may be ignored.",
                [new TalentPrerequisite("Deflection"), new ExpertisePrerequisite(Skill.Close_Combat, 2)],
                3),
            new TalentModel(
                "Quick Draw",
                "The character is always prepared for melee combat. They can draw a weapon as a free action (instead of the normal minor action) and do not need to have a weapon in their hand in order to respond to attacks – any weapon within Reach may be used to defend against attacks. This talent exists for both the Ballistics and Close Combat skill, and if it is purchased for either skill it can be used as a prerequisite for talents in the other skill.",
                [new TalentPrerequisite("Martial Artist")],
                1),
            new TalentModel(
                "Reflexive Block",
                "The character has become so attuned to his melee expertise that he can use it to defend against ranged attacks. The character may substitute their Close Combat skill for their Acrobatics skill any time they attempt a Defence or Guard reaction with a weapon in hand.",
                [new TalentPrerequisite("Quick Draw"), new ExpertisePrerequisite(Skill.Close_Combat, 2)],
                1),
            new TalentModel(
                "Riposte",
                "Some characters learn that the instant after an opponent strike is when they are most vulnerable. After successfully executing a parry, characters with this talent may immediately perform a reaction to make a standard melee attack against the foe they parried.",
                [new TalentPrerequisite("Deflection"), new ExpertisePrerequisite(Skill.Close_Combat, 2)],
                1),
            new TalentModel(
                "Weapon Master",
                "When making an attack using the Close Combat skill, each point of Momentum the character spends to deal bonus damage adds two points of damage instead of one.",
                [new TalentPrerequisite("Combat Specialist"), new ExpertisePrerequisite(Skill.Close_Combat, 2)],
                1),
        ],
        [Skill.Command]: [
            new TalentModel(
                "Air of Authority",
                "The character knows how to bring his authority to bear. When making Psywar attacks, the character may use the Command skill instead. Further, they may use Air of Authority as  Psywar attack which has a range of Close and inflicts 1+3[CD] damage with the Area and Stun qualities. The character cannot use this talent unless he has some way to prove his authority – a uniform, a badge of office, or simply being recognised by the people he has authority over.",
                [new TalentPrerequisite("Professional")],
                1),
            new TalentModel(
                "Commanding Presence",
                "The character leads with immense charisma and persuasive skills. When making a Command test, any Momentum spent or Heat paid to add extra dice to the skill test add two d20s to the dice pool instead of one.",
                [new TalentPrerequisite("Air of Authority"), new ExpertisePrerequisite(Skill.Command, 2)],
                1),
            new TalentModel(
                "Coordinator",
                "The character is proficient in coordinating the actions of a group working in unison. Any time the character is involved in a teamwork test – even if they are not the leader for the test – all characters involved may choose to reroll one d20, but must accept the new result.",
                [new TalentPrerequisite("Group Dynamics"), new ExpertisePrerequisite(Skill.Command, 2)],
                1),
            new TalentModel(
                "Font of Courage",
                "The character is an inspiring presence to those who follow them. Any time forces under their direct command are subject to a Psywar attack, those forces gain +2[CD] Morale Soak for each rank of Font of Courage.",
                [new TalentPrerequisite("Professional")],
                2),
            new TalentModel(
                "Group Dynamics",
                "The character is very familiar with the way a crowd normally acts and can recognise actions that are unusual or out of place. When dealing with places full of people – even if the people are not organised – the character may substitute their Command skill for any Observation test. This includes active searches if the character can rally a crowd to assist them.",
                [new TalentPrerequisite("Professional")],
                1),
            new TalentModel(
                "Minions",
                "Individuals under the character’s authority become extremely loyal to them, even willing to sacrifice themselves. Any time the character comes under attack and has a character under their command within three metres, they may pay one Heat to have that character immediately perform a Guard reaction.",
                [new TalentPrerequisite("Commanding Presence")],
                1),
            new TalentModel(
                "Professional",
                "The character has learned to issue orders so that they are clear to the recipient and with little margin for misinterpretation. The character may reroll one d20 when making a Command test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Command, 1)],
                1),
        ],
        [Skill.Discipline]: [
            new TalentModel(
                "Courageous",
                "Some characters are simply more capable of enduring stress and mental assault. The character has Courage Soak equal to twice his ranks in Courageous.",
                [new TalentPrerequisite("Irrepressible"), new ExpertisePrerequisite(Skill.Discipline, 2)],
                3),
            new TalentModel(
                "Guarded Heart",
                "The character is wary even of their friends and comrades. When targeted by Psywar attacks, they gain +2[CD] Morale soak. Further, when rolling Soak dice for Morale, they instead count each Effect rolled as if it were a 2 on those Soak dice.",
                [new TalentPrerequisite("Wary"), new ExpertisePrerequisite(Skill.Discipline, 2)],
                1),
            new TalentModel(
                "Irrepressible",
                "The character has survived countless challenges and is prepared to face even more. When taking the Recover action, they gain a number of bonus Momentum equal to their rank in Irrepressible.",
                [new TalentPrerequisite("Stubborn")],
                1),
            new TalentModel(
                "Jaded",
                "The character has suffered cruelties and emotional trauma repeatedly. They have built up a tolerance to mental suffering. The character increases their Resolve by two points for each rank of Jaded.",
                [new TalentPrerequisite("Stubborn")],
                3),
            new TalentModel(
                "Out of Darkness",
                "Even when their psyche has taken a beating, the character has an organised mental framework that allows them to recover. Whenever the character makes a Discipline check to recover from Trauma, the difficulty of the check is reduced one step per rank of Out of Darkness.",
                [new TalentPrerequisite("Courageous")],
                2),
            new TalentModel(
                "Stubborn",
                "The character may reroll one d20 when making a Discipline test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Discipline, 1)],
                1),
            new TalentModel(
                "Wary",
                "The character is cautious in their trust and hesitant to believe the things that they are told. Any time the character is the target of a Persuade or Command test, any Momentum paid to add dice to their Discipline test add two d20 instead of one.",
                [new TalentPrerequisite("Stubborn")],
                1),
        ],
        [Skill.Education]: [
            new TalentModel(
                "Disciplined Student",
                "The character paid attention in class, was extensively self-taught, or both. They constantly sought out knowledge beyond the scope of the minimum necessary training. If they generate at least one success when attempting an Education test, they may immediately roll an additional d20 and add the result to the test.",
                [new ExpertisePrerequisite(Skill.Education, 1)],
                1),
            new TalentModel(
                "Knowledge Specialisation",
                "The character is particularly devoted to a particular topic (which is chosen at the same time as this talent, subject to the GM’s approval). When making an Education test related to that topic, the character gains +1d20 on their test. This talent can be taken multiple times, with each additional rank either granting a new specialisation or an additional +1d20 to an existing specialisation. (The normal limit of three bonus d20s applies.)",
                [new TalentPrerequisite("Disciplined Student")],
                TalentSpecial.MaximumRanks_EducationFocus),
            new TalentModel(
                "Maya Wired",
                "Years of experience with the datasphere has allowed the character to create and a master a huge suite of customised, automatic research tools that are anticipating their needs. As long as the character has access to their geist (and their geist has access to Maya, Arachne, or a similar datasphere), whenever they attempt an Education test to recall information quickly, the geist may assist on the test, and roll 2d20 rather than the normal 1d20 for assistance. (Their automated systems deliver information they need to know so instantaneously it’s as if they already knew it themselves.)",
                [new TalentPrerequisite("Research Specialist"), new ExpertisePrerequisite(Skill.Education, 2)],
                1),
            new TalentModel(
                "Research Specialist",
                "After spending hours buried in the nooks and crannies of various dataspheres, the character is an expert at finding the information that they need. When making a skill test to research a topic, the character gains bonus Momentum equal to their ranks in Research Specialist.",
                [new TalentPrerequisite("Disciplined Student")],
                3),
            new TalentModel(
                "Trivia Master",
                "The character keeps up on current events, both globally and throughout the Human Sphere. On any Education test that involves pop culture, trivia, or current events within the past twenty years, the character reduces the difficulty by one step per rank of Trivia Master, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Disciplined Student")],
                3),
            new TalentModel(
                "Untraceable Researcher",
                "The danger of relying on the knowledge of the datasphere is that there are those who can trace and track your use of it. There are tricks to avoid such attention, however, and the character is a master of them. They reduce the difficulty of any Stealth check to avoid detection as a result of their research checks by two steps, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Research Specialist")],
                1),
        ],
        [Skill.Extraplanetary]: [
            new TalentModel(
                "EVA Expert",
                "The character has learned how to work fine tools effectively, even when wearing the thick gloves that are part of a pressure suit. The character may ignore any difficulty increases or other penalties associated with wearing a pressure suit or otherwise encumbering equipment.",
                [new TalentPrerequisite("Space Walker")],
                1),
            new TalentModel(
                "Gravity Savant",
                "The character has worked in a broad range of different gravitational environments and has learned to quickly adapt to such changes. The character can ignore any penalties associated with working in situations of gravity that differ from Earth normal.",
                [new TalentPrerequisite("EVA Expert"), new ExpertisePrerequisite(Skill.Extraplanetary, 2)],
                1),
            new TalentModel(
                "Meteor Head",
                "The character may reroll one d20 when making an Extraplanetary test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Extraplanetary, 1)],
                1),
            new TalentModel(
                "Radiation Resistance",
                "Either due to a genetic quirk or a deliberate anatomical modification, the character is less subject to the effects of cosmic radiation. The character reduces the difficulty of all Resistance tests against the effect of radiation exposure by two steps, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Slow Metabolism"), new ExpertisePrerequisite(Skill.Extraplanetary, 2)],
                1),
            new TalentModel(
                "Slow Metabolism",
                "The character has learned to function at a decreased atmospheric pressure and with a reduced level of oxygen in order to extend operating time in pressure suits. Any time the character begins strenuous activity in an EVA suit, they may make an Average (D1) Extraplanetary test. On a success, they do not use up any of the suit’s Oxygen Loads.",
                [new TalentPrerequisite("Meteor Head")],
                1),
            new TalentModel(
                "Spacewalker",
                "The character has significant experience in using EVA suits and operating in zero-g environments. Whenever a test is required for working in such an environment, the character gains two d20s to their Extraplanetary pool for every Momentum spent instead of one.",
                [new TalentPrerequisite("Meteor Head")],
                1),
            new TalentModel(
                "Star Sneak",
                "Years of extraterrestrial experience have familiarized the character with aspects of the environment which landlubbers find it difficult to grok (such as the presence of a meaningful z-axis in day-to-day life in zero-g). While in space or upon alien worlds, the character may substitute their Extraplanetary skill for Stealth tests.",
                [new TalentPrerequisite("Meteor Head")],
                1),
        ],
        [Skill.Hacking]: [
            new TalentModel(
                "Hacker",
                "When making an Infowar attack, the character may reroll a number of damage dice equal to the number of Hacking talents they have acquired. (As normal, dice may only be re-rolled once.)",
                [new ExpertisePrerequisite(Skill.Hacking, 1)],
                1),
            new TalentModel(
                "Paranoid",
                "The character, their geist, and their systems are always ready for enemy intrusion. As a reaction the character may respond to any Infowar attack with an Infowar attack of their own with any software immediately to hand at a penalty of +2 difficulty. This attack is resolved before the enemy attack and if it causes the enemy to suffer a breach, then their hack is prevented. Each additional rank of Paranoid reduces the difficulty of the reaction hack by one. (With three ranks of Paranoid, therefore, the penalty is completely eliminated.)",
                [new TalentPrerequisite("Tricks of the Trade"), new ExpertisePrerequisite(Skill.Hacking, 2)],
                3),
            new TalentModel(
                "Phisher",
                "The character has made it a practice to collect access to other people’s comlogs and financial details. When making a Fake ID, the resulting Fake ID gains +1 to its rating.",
                [new TalentPrerequisite("Hacker")],
                1),
            new TalentModel(
                "Piggyback",
                "The character maintains a log of easily hackable devices and common admin codes, which when referenced allow the hacker to extend their quantronic reach. When performing a remote Infowar attack, piggybacking off these systems allows the hacker to extend their usual hacking ranger from Close to Medium range at a penalty of +1 difficulty.",
                [new TalentPrerequisite("Phisher")],
                1),
            new TalentModel(
                "Quantronic Flak",
                "The character has created a number of protocols and subroutines that generates a burst of signal interference nearby. As a minor action, the character’s current zone gains 2[CD] Interference Soak per rank of Quantronic Flak, which disappears at the start of the character’s next turn.",
                [new TalentPrerequisite("Hacker")],
                2),
            new TalentModel(
                "Quantronic Leap",
                "When the character spends Momentum during an Infowar attack to affect a secondary target, it only costs one Momentum. In addition, the character can use the secondary target Momentum spend on Infowar attacks a number of times equal to their ranks in Quantronic Leap.",
                [new TalentPrerequisite("Piggyback"), new ExpertisePrerequisite(Skill.Hacking, 2)],
                3),
            new TalentModel(
                "Tricks of the Trade",
                "The character may reroll one d20 when making a Hacking test, but must accept the new result.",
                [new TalentPrerequisite("Hacker")],
                1),
        ],
        [Skill.Lifestyle]: [
            new TalentModel(
                "Backdoor Assets",
                "Having contacts with access to valuable assets can be the quickest way to acquire needed equipment. Characters with access to Backdoor Assets may reduce the restriction rating of any item or service by one per rank of Backdoor Assets, to a minimum of one, but the item or service is regarded as illegally-obtained, which may cause other problems later.",
                [new TalentPrerequisite("Network"), new ExpertisePrerequisite(Skill.Lifestyle, 2)],
                3),
            new TalentModel(
                "Bribery",
                "The character recognises that everyone has their price, and they know how to pay it – particularly without raising any flags. They may substitute their Lifestyle skill for Persuade when attempting to bribe an NPC.",
                [new TalentPrerequisite("Socialite")],
                1),
            new TalentModel(
                "Elite Contact",
                "The character has established connections with individuals in positions of significant authority. Each time this talent is selected, the character gains an elite contact. (The player must specify the type and allegiance of the contact, which is subject to the GM’s approval.) The character may make a Daunting D3 Lifestyle test to ask the selected contact for a favour. On a success, the contact responds with resources proportionate to their level of importance – providing one asset, plus one additional asset per point of Momentum spent. The character can make such a skill test once per month, and it takes an hour (if the character is on the same planet) or 2+4[CD] hours (if the character is on a different planet) to make the attempt. Elite Contact may be purchased multiple times, with each purchase establishing a new highly placed contact.",
                [new TalentPrerequisite("Network"), new ExpertisePrerequisite(Skill.Lifestyle, 2)],
                1),
            new TalentModel(
                "Investments",
                "Each rank of Investments increases the character’s Earnings Rating by one.",
                [new TalentPrerequisite("Socialite")],
                3),
            new TalentModel(
                "Network",
                "The character has a broad range of contacts in different fields and in different regions. Any time they need assistance from other individuals, they may reduce the difficulty of a Lifestyle test to find a contact by one step per rank of Network, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Socialite")],
                3),
            new TalentModel(
                "Socialite",
                "The character may reroll one d20 when making a Lifestyle test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Lifestyle, 1)],
                1),
            new TalentModel(
                "Social Mimic",
                "The character is skilled at blending into disparate cultures and social classes. There is no increase in difficulty for differences in social classes when passing.",
                [new TalentPrerequisite("Socialite")],
                1),
        ],
        [Skill.Medicine]: [
            new TalentModel(
                "Emergency Doctor",
                "When making a teamwork test with the Medicine skill to assist another character with the Recover action, the character may roll a number of dice equal to the character’s ranks in Medicine Focus.",
                [new TalentPrerequisite("Physician")],
                1),
            new TalentModel(
                "Field Dressing",
                "The character has become particularly adept at practicing medicine in situations where few resources are available. They suffer no penalty for Medicine tests attempted without the use of MediKit or stocked medical facility.",
                [new TalentPrerequisite("Physician")],
                1),
            new TalentModel(
                "Field Surgery",
                "Having worked with very limited resources in the past, the character has learned to take full advantage of them when available. Each dose of serum used by the character adds two bonus d20s to Medicine tests instead of one. (The normal limit of three bonus d20s still applies.)",
                [new TalentPrerequisite("Field Dressing")],
                1),
            new TalentModel(
                "Miracle Worker",
                "When performing the Treatment action or assisting on the Recover action using the Medicine skill, the character gains two bonus Momentum, which may only be used to recover Vigour or treat Wounds.",
                [new TalentPrerequisite("Field Surgery"), new ExpertisePrerequisite(Skill.Medicine, 2)],
                1),
            new TalentModel(
                "Physician",
                "The character may reroll one d20 when making a Medicine test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Medicine, 1)],
                1),
            new TalentModel(
                "Self-Treatment",
                "When performing a treat test on themselves, a character with Self-Treatment no longer increases the difficulty of the test by two.",
                [new TalentPrerequisite("Physician")],
                1),
            new TalentModel(
                "Trauma Surgeon",
                "The character has learned techniques to aid a character in recovering from particularly grievous injuries. The character may reduce the difficulty of Medicine tests to treat Wounds by one step per rank of Trauma Surgeon they possess, to a minimum of Average (D1).",
                [new TalentPrerequisite("Field Surgery"), new ExpertisePrerequisite(Skill.Medicine, 2)],
                3),
        ],
        [Skill.Observation]: [
            new TalentModel(
                "Acute Senses",
                "On a successful Observation test, the character gains bonus Momentum equal to their ranks in Acute Senses.",
                [new TalentPrerequisite("Sharp Senses")],
                3),
            new TalentModel(
                "Danger Sense",
                "When making a face-to-face test to determine Surprise, the character can reroll any failed check.",
                [new TalentPrerequisite("Sharp Senses")],
                1),
            new TalentModel(
                "Eidetic Memory",
                "The character can recall images, sounds, objects, and other memories with high precision even after only a momentary exposure. When examining such memories, they can even attempt Observation tests at a +1 difficulty to notice things they may have originally missed in the moment. (Such recall is not actually perfect, however, and GMs are encouraged to use complications on such tests to generate false information.)",
                [new TalentPrerequisite("Sense Memory"), new ExpertisePrerequisite(Skill.Observation, 2)],
                1),
            new TalentModel(
                "Night Vision",
                "The character ignores any penalties to skill tests as a result of poor illumination or low light levels. This talent does not help in total darkness, however.",
                [new TalentPrerequisite("Acute Senses"), new ExpertisePrerequisite(Skill.Observation, 2)],
                1),
            new TalentModel(
                "Sense of Direction",
                "The character has a perfect Sense of Direction. With an Average D1 Observation test, they can determine which direction is north. When attempting to retrace their footsteps or follow a path they’ve taken, the difficulty of the test is reduced by one per Observation talent the character has, which may reduce the difficulty to Simple (D0). (This benefit applies even if their senses were obscured. For example, if they were blindfolded or locked in the trunk of a car and attempting to figure out where it had taken them.)",
                [new TalentPrerequisite("Sharp Senses")],
                1),
            new TalentModel(
                "Sense Memory",
                "The character has a knack for recalling patterns of sounds, smells, or colours. They are much more likely to recognise people, places, and objects they have interacted with, even when they are shrouded or attempts have been made to obscure, disguise, or hide them. When trying to detect, locate, or recognise such targets they gain a bonus 1d20 to any related skill tests. (This bonus die may be rolled by the GM to avoid revealing the subject of the Observation test before the test is made.)",
                [new TalentPrerequisite("Sharp Senses")],
                1),
            new TalentModel(
                "Sharp Senses",
                "The character may reroll one d20 when making an Observation test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Observation, 1)],
                1),
        ],
        [Skill.Persuade]: [
            new TalentModel(
                "Charismatic",
                "The character may re-roll 1d20 on any Persuade test, but must keep the new result.",
                [new ExpertisePrerequisite(Skill.Persuade, 1)],
                1),
            new TalentModel(
                "Enticer",
                "The character is particularly adept at seducing others. When using affection, physical attraction, or the promise of sexual favours as part of negotiation, the character gains a number of bonus d20s equal to their ranks in Enticer. (The normal limit of three bonus d20s still applies.) Whether or not the character is honest with their seduction is irrelevant – the character is as effective with fake seduction as with honest attraction.",
                [new TalentPrerequisite("Charismatic")],
                3),
            new TalentModel(
                "Equivocator",
                "The character is willing and able to tell any lie to overcome an opponent’s social defences. When attempting to deceive an opponent, the character gains two bonus d20s to their Persuade test per Momentum spent or Heat paid (instead of the normal one). The normal limit of three bonus d20s still applies.",
                [new TalentPrerequisite("Charismatic")],
                1),
            new TalentModel(
                "Haggler",
                "The character is particularly proficient at striking a bargain, either to obtain goods or favours. They can use Persuade instead of Lifestyle when making attempting to acquire goods or strike a bargain.",
                [new TalentPrerequisite("Magnetic Personality"), new ExpertisePrerequisite(Skill.Persuade, 2)],
                1),
            new TalentModel(
                "Intimidator",
                "The character recognises others’ limitations and is always willing to exploit them. When attempting to intimidate an opponent, the character gains two d20s to their Persuade test per Momentum spent or Heat paid (instead of the normal one). The normal limit of three bonus d20s still applies.",
                [new TalentPrerequisite("Charismatic")],
                1),
            new TalentModel(
                "Magnetic Personality",
                "When making Persuade tests, the character gains one bonus Momentum per rank of Magnetic Personality.",
                [new TalentPrerequisite("Charismatic")],
                3),
            new TalentModel(
                "Relentless",
                "The character’s bonus damage to Psywar attacks is increased by +1[CD] per rank of Relentless.",
                [new TalentPrerequisite("Intimidator"), new ExpertisePrerequisite(Skill.Persuade, 2)],
                2),
        ],
        [Skill.Pilot]: [
            new TalentModel(
                "Ace",
                "The character may reroll one d20 when making a Pilot test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Pilot, 1)],
                1),
            new TalentModel(
                "Born to the Wheel",
                "Decrease the difficulty for any Pilot tests using ground-based vehicles by one, to a minimum of one.",
                [new TalentPrerequisite("Ace")],
                1),
            new TalentModel(
                "Combat Pilot",
                "The character knows how to keep a vehicle running effectively, even when it’s seriously damaged. When performing a Pilot test with a damaged vehicle, the penalty from damage is reduced by one step per rank of Combat Pilot.",
                [new TalentPrerequisite("Ace")],
                3),
            new TalentModel(
                "Push the Envelope",
                "The character is particularly adept at making vehicles perform beyond their design specifications. When making Pilot tests, the character gains one bonus Momentum per rank of Push the Envelope.",
                [new TalentPrerequisite("Ace")],
                3),
            new TalentModel(
                "Ramming Speed",
                "When the character rams their vehicle into another, each point of Momentum spent for bonus damage adds two damage (instead of the normal one). ",
                [new TalentPrerequisite("Combat Pilot"), new ExpertisePrerequisite(Skill.Pilot, 2)],
                1),
            new TalentModel(
                "Storm Breaker",
                "When piloting watercraft, the character may ignore any penalties to a Pilot test that are due to choppy waters, severe weather, or other environmental conditions.",
                [new TalentPrerequisite("Ace")],
                1),
            new TalentModel(
                "Top Gun",
                "The character may substitute their Pilot skill for Ballistics when firing weapons mounted on an airborne vehicle that they are also piloting.",
                [new TalentPrerequisite("Push the Envelope"), new ExpertisePrerequisite(Skill.Pilot, 2)],
                1),
        ],
        [Skill.Psychology]: [
            new TalentModel(
                "Alien Specialist",
                "The character has spent considerable time studying the psychology of a particular non-human species. When making Psychology tests involving members of that species, the character gains +1d20 on their test. This talent can be taken multiple times, with each additional rank granting specialisation with a new alien species. (For the purposes of this talent, the character can select artificial intelligences as a non-human species.)",
                [new TalentPrerequisite("Counsellor")],
                1),
            new TalentModel(
                "Battlefield Psychology",
                "When making a teamwork test with the Psychology skill to assist another character with the Recover action, the character may roll a number of dice equal to the character’s ranks in Psychology Focus.",
                [new TalentPrerequisite("Counsellor")],
                1),
            new TalentModel(
                "Counsellor",
                "When making a Psychology test, the character may reroll any dice that did not generate a success on the initial roll, but they must accept the new result.",
                [new ExpertisePrerequisite(Skill.Psychology, 1)],
                1),
            new TalentModel(
                "Lie Detector",
                "The character is a human lie detector. They roll an additional d20 when making Psychology tests to determine whether or not someone is lying.",
                [new TalentPrerequisite("Counsellor")],
                1),
            new TalentModel(
                "Psychoanalyst",
                "The character is a trained psychologist and is often able to guide a patient’s focus in order to expedite the recovery process. The character may reduce the difficulty of treat tests using the Psychology skill by one step per rank of Psychoanalyst they possess to a minimum of one.",
                [new TalentPrerequisite("Remote Analyst"), new ExpertisePrerequisite(Skill.Psychology, 2)],
                3),
            new TalentModel(
                "Remote Analyst",
                "The character does not suffer any increase in difficulty to Psychology tests due to being unable to interact with the subject face-to-face.",
                [new TalentPrerequisite("Counsellor")],
                1),
            new TalentModel(
                "Therapeutic Insight",
                "The character has a keen insight into those suffering from mental debilitation. When performing the Treat action or assisting on the Recover action using the Psychology skill, the character gains two bonus Momentum, which may only be used to recover Resolve or treat Trauma.",
                [new TalentPrerequisite("Battlefield Psychology"), new ExpertisePrerequisite(Skill.Psychology, 2)],
                1),
        ],
        [Skill.Resistance]: [
            new TalentModel(
                "Fast Healer",
                "When attempting the Recover action, the character can add an additional d20 to the Resistance test per rank of Fast Healer.",
                [new TalentPrerequisite("Quick Recovery")],
                3),
            new TalentModel(
                "Just a Scratch",
                "The character has a knack for ignoring minor injuries and pushing through the pain. When taking the Recover action, the character recovers one additional Vigour per rank of Just a Scratch.",
                [new TalentPrerequisite("Sturdy")],
                3),
            new TalentModel(
                "Mithradatic",
                "The character is either naturally resistant to toxins or has become inured to them through constant exposure (possibly pharmacological). When a character needs to make a Resistance test against a poison, toxin, or the effects of drugs, they may reduce the difficulty by one step per rank of Mithradatic. This may reduce the difficulty to zero, eliminating the need for a test.",
                [new TalentPrerequisite("Sturdy")],
                3),
            new TalentModel(
                "Quick Recovery",
                "When taking the Absterge action, the difficulty of the Resistance test to remove the condition is reduced by one step, to a minimum of Average (D1).",
                [new TalentPrerequisite("Just a Scratch"), new ExpertisePrerequisite(Skill.Resistance, 2)],
                1),
            new TalentModel(
                "Resilient",
                "When making a Resistance test to avoid a status condition, the difficulty of the Resistance test to resist the negative effects is reduced by one step per rank of Resilient. This may reduce the difficulty to Simple (D0), eliminating the need for a test.",
                [new TalentPrerequisite("Sturdy")],
                3),
            new TalentModel(
                "Self-Medicating",
                "The character has learned how to cope with mental trauma through the heavy use of drugs, alcohol, or other pharmacological means, relying on their physical stamina to endure the results. If they’re able to self-medicate with such substances, the character can use their Resistance skill on any recovery test for which they would normally use Discipline. (This sort of behaviour isn’t healthy, of course, and GMs are encouraged to use complications on the recovery test to reflect this.)",
                [new TalentPrerequisite("Mithradatic"), new ExpertisePrerequisite(Skill.Resistance, 2)],
                1),
            new TalentModel(
                "Sturdy",
                "When making Resistance tests, the character may reroll any dice that did not generate a success on the initial roll, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Resistance, 1)],
                1),
        ],
        [Skill.Science]: [
            new TalentModel(
                "Applied Sciences",
                "The character has great experience in taking science out of the lab and into the field. They may substitute their Science skill for any skill tests involving areas of knowledge covered by or involving their Science Specialisation (such as Tech or Education).",
                [new TalentPrerequisite("Science Specialisation"), new ExpertisePrerequisite(Skill.Science, 2)],
                1),
            new TalentModel(
                "Genetic Engineer",
                "The character is not only familiar with the different organisms that dwell in the Human Sphere, they are also comfortable modifying them or even creating new forms of life. The character can use their Science skill instead of Tech or Medicine when performing genetic engineering and also gains +1d20 to such tests.",
                [new TalentPrerequisite("Science Specialisation"), new ExpertisePrerequisite(Skill.Science, 2)],
                1),
            new TalentModel(
                "Science Specialisation",
                "The character is particularly devoted to a particular branch of science (which is chosen at the same time as this talent, subject to the GM’s approval). When making a Science test related to that topic, the character gains +1d20 on their test. This talent can be taken multiple times, with each additional rank either granting a new specialisation or an additional +1d20 to an existing specialisation.",
                [new TalentPrerequisite("Scientist")],
                TalentSpecial.MaximumRanks_ScienceFocus),
            new TalentModel(
                "Scientific Intuition",
                "When making Science tests, the character gains one bonus Momentum per rank of Scientific Intuition.",
                [new TalentPrerequisite("Scientist")],
                3),
            new TalentModel(
                "Scientist",
                "The character may reroll one d20 when making a Science test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Science, 1)],
                1),
            new TalentModel(
                "Sorellian Genius",
                "The adjective of “sorellian”, invoked from the famous Sorel sisters who cracked the mysteries of wormhole travel, has become a popular adjective for gifted scientists. The character may reduce the difficulty of any Science test by one step per rank of Sorellian Genius, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Scientist")],
                3),
        ],
        [Skill.Spacecraft]: [
            new TalentModel(
                "Alone in the Night",
                "It’s not unusual for spacecraft to encounter mechanical difficulties far from facilities where repairs can be made. Pilots often gain practical, hands-on experience with repairing their rides. The character can substitute their Spacecraft skill when making Tech tests to repair spacecraft.",
                [new TalentPrerequisite("Space Ace")],
                1),
            new TalentModel(
                "Fleet Action",
                "The character has commanded squadrons of spacecraft during conflicts and has survived the experience with tales to tell. They may substitute their Spacecraft skill for Command in any such conflicts.",
                [new TalentPrerequisite("Star Fighter")],
                1),
            new TalentModel(
                "Fly Casual",
                "When attempting to evade detection while flying a spacecraft, the character may substitute their Spacecraft skill for Stealth.",
                [new TalentPrerequisite("Space Ace")],
                1),
            new TalentModel(
                "Space Ace",
                "The character may reroll one d20 when making a Spacecraft test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Spacecraft, 1)],
                1),
            new TalentModel(
                "Starfighter",
                "The character may substitute their Spacecraft skill for Ballistics when firing weapons mounted on a space vehicle that they are also piloting.",
                [new TalentPrerequisite("Starslinger"), new ExpertisePrerequisite(Skill.Spacecraft, 2)],
                1),
            new TalentModel(
                "Starslinger",
                "When making Spacecraft tests involving piloting, the character decreases the difficulty rating by one per rank of Starslinger, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Space Ace")],
                3),
            new TalentModel(
                "Transatmospheric",
                "When flying a ship designed for both atmospheric and space flight, the character can substitute their Spacecraft skill for Pilot on tests.",
                [new TalentPrerequisite("Space Ace")],
                1),
        ],
        [Skill.Stealth]: [
            new TalentModel(
                "Camouflage",
                "The character recognises that often it is not important for just themselves to remain unseen, but also their allies and any equipment they might be using. When attempting to conceal anything vehicle sized or larger, any Momentum paid to add dice to their Stealth test adds two d20s instead of one.",
                [new TalentPrerequisite("Scout")],
                1),
            new TalentModel(
                "Disguise",
                "The character has learned to capably impersonate a broad range of people, effectively blending into the background and acting like they belong. When making Stealth tests to make or use a disguise, they gain bonus Momentum equal to their ranks in Disguise.",
                [new TalentPrerequisite("Scout")],
                1),
            new TalentModel(
                "Impersonation",
                "When impersonating another, the character may substitute their Stealth skill for Persuade or Command.",
                [new TalentPrerequisite("Duisguise"), new ExpertisePrerequisite(Skill.Stealth, 2)],
                1),
            new TalentModel(
                "Infiltration",
                "The character has learned a variety of techniques necessary to bypass security measures when infiltrating a target facility. The character may substitute Stealth for Thievery when attempting to bypass physical security measures.",
                [new TalentPrerequisite("Living Shadow"), new ExpertisePrerequisite(Skill.Stealth, 2)],
                1),
            new TalentModel(
                "Living Shadow",
                "When the character attempts to remain unseen or unnoticed, any Momentum spent or Heat paid to add dice to their Stealth test adds two d20s instead of one.",
                [new TalentPrerequisite("Scout")],
                1),
            new TalentModel(
                "Quantronic Static",
                "When the character attempts to evade detection while hacking, any Momentum spent or Heat paid to add dice to their Stealth test adds two d20s instead of one.",
                [new TalentPrerequisite("Scout")],
                1),
            new TalentModel(
                "Scout",
                "The character may reroll one d20 when making a Stealth test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Stealth, 1)],
                1),
        ],
        [Skill.Survival]: [
            new TalentModel(
                "Environmental Specialisation",
                "The character is particularly devoted to a particular kind of environment (Arctic, Desert, Jungle, Mountain, Forest, Plains, Subterranean, or Urban). When making a Survival test in or related to that environment, the character gains +1d20 on their test. This talent can be taken multiple times, with each additional rank either granting a new specialisation or an additional +1d20 to an existing specialisation.",
                [new TalentPrerequisite("Self-Sufficient")],
                TalentSpecial.MaximumRanks_SurvivalFocus),
            new TalentModel(
                "Natural Allies",
                "When interacting with creatures native to their Environmental Specialisation, the character may substitute their Survival skill for Animal Handling tests.",
                [new TalentPrerequisite("Environmental Specialisation"), new ExpertisePrerequisite(Skill.Survival, 2)],
                1),
            new TalentModel(
                "One With Your Surroundings",
                "While moving through their Environmental Specialisation, the character may substitute their Survival skill for Stealth tests.",
                [new TalentPrerequisite("Environmental Specialisation"), new ExpertisePrerequisite(Skill.Survival, 2)],
                1),
            new TalentModel(
                "Provider",
                "The character is particularly capable of finding the necessities of life. When attempting to find food, water, or shelter, each point of Momentum earned on the Survival test can be spent to provide necessities for two days (instead of the normal one).",
                [new TalentPrerequisite("Self-Sufficient")],
                1),
            new TalentModel(
                "Scrounger",
                "Useful items and resources are often discarded or abandoned. A resourceful individual can often recover these for their own purposes. The character may reduce the restriction rating of any item by one per rank of Scrounger, to a minimum of one.",
                [new TalentPrerequisite("Provider"), new ExpertisePrerequisite(Skill.Survival, 2)],
                2),
            new TalentModel(
                "Self-Sufficient",
                "The character may reroll one d20 when making a Survival test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Survival, 1)],
                1),
            new TalentModel(
                "Tracker",
                "The character is experienced with recognising all the signs of passage, from the subtle to the obvious. When tracking an opponent, the character reduces the difficulty of the Survival test by one step per rank of Tracker, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Self-Sufficient")],
                3),
        ],
        [Skill.Tech]: [
            new TalentModel(
                "Design Savant",
                "The character has a knack for designing novel solutions to problems. Any time the character chooses to design a new piece of equipment – or modify an existing design – they may reduce the difficulty of the Tech test by one step per rank of Design Savant, to a minimum of Simple (D0).",
                [new TalentPrerequisite("Natural Engineer")],
                3),
            new TalentModel(
                "Explosives Expert",
                "When setting an explosive charge, the character gains bonus Momentum equal to their ranks in Explosives Expert. ",
                [new TalentPrerequisite("Natural Engineer"), new ExpertisePrerequisite(Skill.Tech, 2)],
                3),
            new TalentModel(
                "Greasemonkey",
                "The character is familiar with mechanical systems, and recognises the most likely points of failure intuitively. When attempting to treat damage sustained by an object or construct (something with Structure and Faults, instead of Vigour and Wounds), the character gains two bonus Momentum.",
                [new TalentPrerequisite("Natural Engineer")],
                1),
            new TalentModel(
                "Jury Rig",
                "Often when a critical piece of equipment breaks down – either due to wear and tear or damage – components necessary to replace it are unavailable. Characters with this talent have a knack for making do without. They suffer no penalty for Tech tests attempted without the use of proper tools. They can also make an Average D1 Tech test to temporarily repair a device when necessary parts are unavailable. On a success, the device will continue functioning for one hour. Each point of Momentum earned on the test can be spent to add an additional hour of function.",
                [new TalentPrerequisite("Snap Diagnosis"), new ExpertisePrerequisite(Skill.Tech, 2)],
                1),
            new TalentModel(
                "Makeshift Wizard",
                "When the character uses Parts, each Part expended grants two bonus d20s instead of the normal one. (The normal limit of three bonus d20s still applies.)",
                [new TalentPrerequisite("Greasemonkey"), new ExpertisePrerequisite(Skill.Tech, 2)],
                1),
            new TalentModel(
                "Natural Engineer",
                "When making a Tech test, the character may reroll any dice that did not generate a success on the initial roll, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Tech, 1)],
                1),
            new TalentModel(
                "Snap Diagnosis",
                "The character is able to identify the problem with any broken or malfunctioning device – to recognise a vulnerability that could be used to compromise it. The character reduces the difficulty of any Tech test performed for diagnostic purposes by one, to a minimum of Simple (D0). When an Exploit action is taken, Snap Diagnosis also grants the Piercing weapon quality to the character’s subsequent attack with a value equal to their Tech Focus (which stacks with the normal Piercing quality granted by Exploit).",
                [new TalentPrerequisite("Natural Engineer")],
                1),
        ],
        [Skill.Thievery]: [
            new TalentModel(
                "Bypass Security",
                "The character has studied different security systems and has developed a broad range of different techniques to mitigate their efficiency. Any time the character attempts to pick a lock or overcome a security system – regardless of whether it is electronic or mechanical – they may reroll a number of d20s equal to their ranks in Bypass Security. The results on the rerolled dice must be accepted.",
                [new TalentPrerequisite("Thief")],
                3),
            new TalentModel(
                "Inconspicuous",
                "Committing a crime is easy, getting away is harder. Through practice, the character has learned how to avoid notice and slip away undetected. They may substitute their Thievery skill for Stealth when attempting to escape from the scene of a crime, con job, heist, or other Thievery tasks.",
                [new TalentPrerequisite("Surreptitious Reconnaissance"), new ExpertisePrerequisite(Skill.Thievery, 2)],
                1),
            new TalentModel(
                "Life of Crime",
                "After years of dealing with the criminal underworld, the character has a basic familiarity of how to interact with the Submondo. When making a Persuade or Education test relating to or interacting with the criminal element, they gain bonus Momentum equal to their Life of Crime ranks.",
                [new TalentPrerequisite("Thief")],
                3),
            new TalentModel(
                "Misdirection",
                "A successful theft relies on making sure the target has no reason to expect it. In a Face-to-Face Thievery test (such as against Observation to see if a theft is noticed), if the character generates at least one success they can immediately roll an additional d20 and add the result to the skill test.",
                [new TalentPrerequisite("Surreptitious Reconnaissance"), new ExpertisePrerequisite(Skill.Thievery, 2)],
                1),
            new TalentModel(
                "Pick Pocket",
                "The character is an expert on lifting and placing objects around someone’s person. When making a face-to-face Thievery test (against the target’s Observation) to remove an item from someone’s body, or to place an item on their person, the opponent’s difficulty to detect the crime is increased by one for each rank of Pick Pocket.",
                [new TalentPrerequisite("Thief")],
                3),
            new TalentModel(
                "Surreptitious Reconnaissance",
                "When making Observation tests to case a joint, spot a mark, or otherwise prepare for Thievery tasks, the character can substitute their Thievery skill for Analysis or Observation tests.",
                [new TalentPrerequisite("Thief")],
                1),
            new TalentModel(
                "Thief",
                "The character may reroll one d20 when making a Thievery test, but must accept the new result.",
                [new ExpertisePrerequisite(Skill.Thievery, 1)],
                1),
        ]
    };

    getTalents() {
        return this._talents;
    }

    getTalent(name: string) {
        var talent: TalentModel = null;

        var found = false;
        for (var tal in this._talents) {
            if (found) {
                break;
            }

            for (var i = 0; i < this._talents[tal].length; i++) {
                var t = this._talents[tal][i];
                if (t.name === name) {
                    talent = t;
                    break;
                }
            }
        }

        return talent;
    }

    getTalentsForSkills(skills: Skill[]) {
        var talents: TalentViewModel[] = [];

        skills.forEach((s, i) => {
            if (s == undefined) {
                return;
            }

            for (var i = 0; i < this._talents[s].length; i++) {
                var include = true;
                var talent = this._talents[s][i];

                talent.prerequisites.forEach((p, i) => {
                    if (!p.isPrerequisiteFulfilled()) {
                        include = false;
                    }
                });

                if (include) {
                    if (talent.maxRank > 1) {
                        if (character.hasTalent(talent.name) && character.talents[talent.name].rank === talent.maxRank) {
                            include = false;
                        }
                    }
                    else if (talent.maxRank === TalentSpecial.MaximumRanks_EducationFocus) {
                        if (character.hasTalent(talent.name) && character.talents[talent.name].rank === character.skills[Skill.Education].focus) {
                            include = false;
                        }
                    }
                    else if (talent.maxRank === TalentSpecial.MaximumRanks_ScienceFocus) {
                        if (character.hasTalent(talent.name) && character.talents[talent.name].rank === character.skills[Skill.Science].focus) {
                            include = false;
                        }
                    }
                    else if (talent.maxRank === TalentSpecial.MaximumRanks_SurvivalFocus) {
                        if (character.hasTalent(talent.name) && character.talents[talent.name].rank === character.skills[Skill.Survival].focus) {
                            include = false;
                        }
                    }
                    else {
                        if (character.hasTalent(talent.name)) {
                            include = false;
                        }
                    }

                    if (include) {
                        var rank = character.hasTalent(talent.name)
                            ? character.talents[talent.name].rank + 1
                            : 1;

                        talents.push(new TalentViewModel(talent.name, rank, talent.maxRank > 1, talent.description, s));
                    }
                }
            }
        });

        talents.sort((a, b) => a.name.localeCompare(b.name));

        return talents;
    }

    getSkillForTalent(talent: string) {
        var n = 0;
        for (var skill in this._talents) {
            for (var i = 0; i < this._talents[skill].length; i++) {
                var t = this._talents[skill][i];
                if (t.name === talent) {
                    return n;
                }
            }

            n++;
        }

        return n;
    }
}

export const TalentsHelper = new Talents();