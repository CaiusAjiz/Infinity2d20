import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Attribute, AttributesHelper} from '../helpers/attributes';
import {Skill, SkillsHelper} from '../helpers/skills';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {AttributeImprovementCollection, AttributeImprovementCollectionMode} from '../components/attributeImprovement';
import {UntrainedSkillImprovement} from '../components/untrainedSkillImprovement';
import TalentList from '../components/talentList';
import {Dialog} from '../components/dialog';

export class FinalTweaksPage extends React.Component<IPageProperties, {}> {
    private _talent: string;
    private _attributesDone: boolean;
    private _skillsDone: boolean;
    private _points: number;

    constructor(props: IPageProperties) {
        super(props);

        this._attributesDone = false;
        this._skillsDone = false;

        this._points = 2;

        character.equipment.forEach(eq => {
            if (eq === "Biografted Attribute Augmentation 2") {
                this._points += 2;
            }
        });
    }

    render() {
        let skills: Skill[] = [];
        character.skills.forEach(skill => {
            skills.push(skill.skill);
        });

        return (
            <div className="page">
                <PageHeader text="FINAL TWEAKS"/>
                <div className="page-text">
                    Improve up to {this._points} attributes and up to 2 untrained skills.
                    <br/>
                    Then select a talent for any of your skills.
                </div>
                <div className="header-text">ATTRIBUTES</div>
                <div className="panel">
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Increase} points={this._points} onDone={(done) => { this._attributesDone = done; } } />
                </div>
                <br/>
                <div className="header-text">SKILLS</div>
                <div className="panel">
                    <UntrainedSkillImprovement points={2} skills={skills} onDone={(done) => { this._skillsDone = done; this.forceUpdate(); } }/>
                </div>
                <br/>
                <div className="header-text">TALENT</div>
                <div className="panel">
                    <TalentList skills={SkillsHelper.getSkills()} onSelection={(talent) => { this._talent = talent } } selTal={this._talent} />
                </div>
                <Button text="NEXT" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private onNext() {
        if (!this._attributesDone) {
            Dialog.show("You have not distributed all attribute points.");
            return;
        }

        if (!this._skillsDone) {
            Dialog.show("You have not distributed all skill points.");
            return;
        }

        if (this._talent === null || this._talent.length === 0) {
            Dialog.show("You have not selected a talent.");
            return;
        }

        character.addTalent(this._talent);

        if (!character.isOptional) {
            Navigation.navigateToPage(PageIdentity.FinalTweaks_LifePoints);
        }
        else {
            Navigation.navigateToPage(PageIdentity.Finish);
        }
    }
}