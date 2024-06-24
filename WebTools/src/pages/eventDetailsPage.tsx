import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Skill, SkillsHelper} from '../helpers/skills';
import {Attribute, AttributesHelper} from '../helpers/attributes';
import {FactionsHelper} from '../helpers/factions';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {IncreaseUntrainedSkillEvent} from '../events/increaseUntrainedSkillEvent';
import {IncreaseSkillEvent} from '../events/increaseSkillEvent';
import {IncreaseAllSkillsEvent} from '../events/increaseAllSkillsEvent';
import {IncreaseSkippedElectiveSkillsEvent} from '../events/increaseSkippedElectiveSkillsEvent';
import {DefectionEvent} from '../events/defectionEvent';
import {DefectionChoiceEvent} from '../events/defectionChoiceEvent';
import {ResurrectedEvent} from '../events/resurrectedEvent';
import {HazardTestOrFiredEvent} from '../events/hazardTestOrFiredEvent';
import {FiredEvent} from '../events/firedEvent';
import {CriminalRecordEvent} from '../events/criminalRecordEvent';
import {HazardTestOrCriminalRecordEvent} from '../events/hazardTestOrCriminalRecordEvent';
import {HazardTestOrReduceEarningsEvent} from '../events/hazardTestOrReduceEarningsEvent';
import {ChineseCurseEvent} from '../events/chineseCurseEvent';
import {HomelessEvent} from '../events/homelessEvent';
import {HelpFriendEvent} from '../events/helpFriendEvent';
import {SelectTalentEvent} from '../events/selectTalentEvent';
import {JailOrDebtEvent} from '../events/jailOrDebtEvent';
import {SelectDrugEvent} from '../events/selectDrugEvent';
import {SelectWeaponEvent} from '../events/selectWeaponEvent';
import {SelectHomelandEvent} from '../events/selectHomelandEvent';
import {PayToContinueCareerEvent} from '../events/payToContinueCareerEvent';
import {ReduceAttributeEvent} from '../events/reduceAttributeEvent';
import {SelectItemTypeEvent} from '../events/selectItemTypeEvent';
import {LearnLanguageEvent} from '../events/learnLanguageEvent';
import {ProdigyEvent} from '../events/prodigyEvent';
import {JailOrDebtHaqqislamEvent} from '../events/JailOrDebtHaqqislamEvent';
import {JailOrDebtPanOEvent} from '../events/jailOrDebtPanOEvent';
import {ImproveHackingOrGeistEvent} from '../events/ImproveHackingOrGeistEvent';
import {CyberneticLegOrArmEvent} from '../events/cyberneticLegOrArmEvent';
import { JailOrJaguarEvent } from '../events/jailOrJaguarEvent';
import { PraxisEvent } from '../events/praxisEvent';
import { JuicyOfferEvent } from '../events/juicyOfferEvent';
import { SocialReductionOrDebtEvent } from '../events/socialReductionOrDebtEvent';
import { TunguskanEliteEvent } from '../events/tunguskanEliteEvent';
import { IncreaseOneAttributeEvent } from '../events/increaseOneAttributeEvent';
import { IncreaseGeistSkillsEvent } from '../events/increaseGeistSkillsEvent';
import { ReduceStatusOrFiredEvent } from '../events/reduceStatusOrFired';

export class EventDetailsPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);
    }

    render() {
        const event = character.pendingEvents[0];
        character.pendingEvents.splice(0, 1);

        var page: JSX.Element;

        if (event.detailView.indexOf("IncreaseUntrained") > -1) {
            page = (<IncreaseUntrainedSkillEvent points={1} />);
        }
        else if (event.detailView.indexOf("IncreaseSkippedElective") > -1) {
            page = (<IncreaseSkippedElectiveSkillsEvent points={1} />);
        }
        else if (event.detailView.indexOf("IncreaseAll") > -1) {
            var skills: Skill[] = [];
            var sk = event.detailView.substr(event.detailView.indexOf("IncreaseAll") + 11);
            var sks = sk.split("|");

            for (var i = 0; i < sks.length; i++) {
                skills.push(SkillsHelper.getSkillByName(sks[i]));
            }

            page = (<IncreaseAllSkillsEvent skills={skills} />);
        }
        else if (event.detailView === "IncreaseGeistSkills") {
            page = (<IncreaseGeistSkillsEvent />);
        }
        else if (event.detailView.indexOf("Increase") > -1) {
            var skills: Skill[] = [];
            var sk = event.detailView.substr(event.detailView.indexOf("Increase") + 8);
            var sks = sk.split("|");

            for (var i = 0; i < sks.length; i++) {
                skills.push(SkillsHelper.getSkillByName(sks[i]));
            }

            page = (<IncreaseSkillEvent skills={skills} points={1} />);
        }
        else if (event.detailView.indexOf("Defection") > -1) {
            var faction = event.detailView.substr(event.detailView.indexOf("Defection") + 9);
            if (faction !== "Choice") {
                page = (<DefectionEvent faction={FactionsHelper.getFactionByName(faction)} />);
            }
            else {
                page = (<DefectionChoiceEvent />);
            }
        }
        else if (event.detailView.indexOf("Resurrection") > -1) {
            page = (<ResurrectedEvent />);
        }
        else if (event.detailView.indexOf("HazardTestOrFired") > -1) {
            page = (<HazardTestOrFiredEvent />);
        }
        else if (event.detailView.indexOf("Fired") > -1) {
            page = (<FiredEvent />);
        }
        else if (event.detailView.indexOf("HazardTestOrCriminalRecord") > -1) {
            page = (<HazardTestOrCriminalRecordEvent />);
        }
        else if (event.detailView.indexOf("CriminalRecord") > -1) {
            page = (<CriminalRecordEvent />);
        }
        else if (event.detailView.indexOf("HazardTestOrReduceEarnings") > -1) {
            page = (<HazardTestOrReduceEarningsEvent />);
        }
        else if (event.detailView.indexOf("ChineseCurse") > -1) {
            page = (<ChineseCurseEvent />);
        }
        else if (event.detailView.indexOf("Homeless") > -1) {
            page = (<HomelessEvent />);
        }
        else if (event.detailView.indexOf("HelpFriend") > -1) {
            page = (<HelpFriendEvent />);
        }
        else if (event.detailView.indexOf("SelectTalent") > -1) {
            if (event.detailView.length > 12) {
                const skillName = event.detailView.substr(12);
                const skill = SkillsHelper.getSkillByName(skillName);

                page = (<SelectTalentEvent skill={skill} />);
            }
            else {
                page = (<SelectTalentEvent />);
            }
        }
        else if (event.detailView.indexOf("JailOrDebtHaqqislam") > -1) {
            page = (<JailOrDebtHaqqislamEvent />);
        }
        else if (event.detailView.indexOf("JailOrDebtPanO") > -1) {
            page = (<JailOrDebtPanOEvent />);
        }
        else if (event.detailView.indexOf("JailOrDebt") > -1) {
            page = (<JailOrDebtEvent />);
        }
        else if (event.detailView.indexOf("JailOrJaguar") > -1) {
            page = (<JailOrJaguarEvent />);
        }
        else if (event.detailView.indexOf("Rockstar") > -1) {
            page = (<SelectDrugEvent />);
        }
        else if (event.detailView.indexOf("HeirloomWeapon") > -1) {
            page = (<SelectWeaponEvent />);
        }
        else if (event.detailView.indexOf("BrandLoyalist") > -1) {
            page = (<SelectWeaponEvent weapons={["Americolt Eagle", "Ojotnik", "Teseum Hatchet"]} />);
        }
        else if (event.detailView.indexOf("SelectHomeland") > -1) {
            page = (<SelectHomelandEvent />);
        }
        else if (event.detailView.indexOf("PayToContinue") > -1) {
            page = (<PayToContinueCareerEvent />);
        }
        else if (event.detailView.indexOf("ReduceAttributes") > -1) {
            const points = parseInt(event.detailView.substr(16));

            page = (<ReduceAttributeEvent points={points} />);
        }
        else if (event.detailView.indexOf("ReduceAttribute") > -1) {
            if (event.detailView.length > 15) {
                const attrs = event.detailView.replace("ReduceAttribute", "").split('|');
                const attributes = [];

                attrs.forEach(a => {
                    attributes.push(AttributesHelper.getAttributeByName(a));
                });

                page = (<ReduceAttributeEvent points={1} attributes={attributes} />);
            }
            else {
                page = (<ReduceAttributeEvent points={1} />);
            }
        }
        else if (event.detailView.indexOf("SelectItemType") > -1) {
            page = (<SelectItemTypeEvent />);
        }
        else if (event.detailView.indexOf("LearnLanguage") > -1) {
            page = (<LearnLanguageEvent />);
        }
        else if (event.detailView.indexOf("Prodigy") > -1) {
            page = (<ProdigyEvent />);
        }
        else if (event.detailView.indexOf("ImproveHackingOrGeist") > -1) {
            page = (<ImproveHackingOrGeistEvent />);
        }
        else if (event.detailView.indexOf("CyberneticLegOrArm") > -1) {
            page = (<CyberneticLegOrArmEvent />);
        }
        else if (event.detailView.indexOf("Praxis") > -1) {
            page = (<PraxisEvent />);
        }
        else if (event.detailView === "JuicyOffer") {
            page = (<JuicyOfferEvent />);
        }
        else if (event.detailView === "SocialReductionOrDebt") {
            page = (<SocialReductionOrDebtEvent />);
        }
        else if (event.detailView === "TunguskanElite") {
            page = (<TunguskanEliteEvent />);
        }
        else if (event.detailView === "IncreaseOneAttribute") {
            page = (<IncreaseOneAttributeEvent />);
        }
        else if (event.detailView === "PayStatusToContinue") {
            page = (<ReduceStatusOrFiredEvent />);
        }

        return (
            <div className="page">
                <PageHeader text="EVENT" />
                <div className="page-text">{event.effect}</div>
                {page}
            </div>
        );
    }

    private onNext() {
        Navigation.navigateToPage(character.getCareerPage(PageIdentity.Career1));
    }
}