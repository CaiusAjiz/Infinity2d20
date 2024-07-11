import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {Button} from '../components/button';
import CheckBox from '../components/checkBox';
import {Dialog} from '../components/dialog';
import {PageIdentity} from '../pages/pageFactory';
import {Faction} from '../helpers/factions';
import {CareersHelper} from '../helpers/careers';
import {SkillsHelper, Skill} from '../helpers/skills';
import {DiceRoller} from '../helpers/diceRoller';

interface IFiredEventProperties {
}

export class CriminalRecordEvent extends React.Component<IFiredEventProperties, {}> {
    private _joinSubmondo: boolean;

    constructor(props: IFiredEventProperties) {
        super(props);

        this._joinSubmondo = false;
    }

    render() {
        const submondo = character.faction !== Faction.Submondo
            ? (
                <div>
                    Do you want to switch to the Submondo faction?
                    <br/><br/>
                    <CheckBox value={1} isChecked={this._joinSubmondo} onChanged={() => this.toggleJoinSubmondo()} />
                </div>
              )
            : undefined;

        const skills = CareersHelper.getCareer(character.careers[character.careers.length - 1].career).mandatory.map((skill, i) => {
            return (
                <div className="skill-container" key={i}>
                    <Button text="Select" className="button-small align-right" onClick={() => { this.onRoll(skill) } } />
                    <div className="skill-name">
                        {SkillsHelper.getSkillName(skill) }
                    </div>
                    <div className="skill-expertise">
                        Expertise&nbsp;
                        {character.skills[skill].expertise}
                    </div>
                    <div className="skill-focus">
                        Focus&nbsp;
                        {character.skills[skill].focus}
                    </div>
                </div>
            );
        });

        return (
            <div>
                <div className="panel">
                    <div>
                        You have gained a Criminal Record.
                    </div>
                    <br/><br/>
                    {submondo}
                    <br/><br/>
                    You must pass an Average (D1) hazard test for your current career or you are Fired. Select a skill.
                    {skills}
                </div>
            </div>
        );
    }

    private onRoll(skill: Skill) {
        if (this._joinSubmondo) {
            character.heritage = character.faction;
            character.faction = Faction.Submondo;
            character.hasDefected = true;
        }

        const targetValue = character.skills[skill].expertise + character.attributes[SkillsHelper.getAttributeForSkill(skill)].value;
        const roll = DiceRoller.roll(targetValue, character.skills[skill].focus, 1);
        if (roll.successes > 0 && !roll.hasRepercusions) {
            Dialog.show("Your hazard attempt was successful!", () => {
                Navigation.navigateToPage(PageIdentity.AfterEvent);
            });
        }
        else {
            Dialog.show("Your hazard attempt failed. You are fired!", () => {
                Navigation.navigateToPage(PageIdentity.Fired);
            });
        }
    }

    private toggleJoinSubmondo() {
        this._joinSubmondo = !this._joinSubmondo;
        this.forceUpdate();
    }
}