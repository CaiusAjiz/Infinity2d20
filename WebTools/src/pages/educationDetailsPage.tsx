import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity, IPageProperties} from './pageFactory';
import {Education, EducationsHelper} from '../helpers/educations';
import {Skill, SkillsHelper} from '../helpers/skills';
import {AttributesHelper} from '../helpers/attributes';
import {TalentsHelper} from '../helpers/talents';
import {PageHeader} from '../components/pageHeader';
import {AttributeView} from '../components/attribute';
import {SkillImprovement} from '../components/skillImprovement';
import {Button} from '../components/button';
import {ElectiveSkillImprovement} from '../components/electiveSkillImprovement';
import {SignatureSkillSelection} from '../components/signatureSkillSelection';
import TalentList from '../components/talentList';
import {EquipmentList} from '../components/equipmentList';
import {Dialog} from '../components/dialog';

export class EducationDetailsPage extends React.Component<IPageProperties, {}> {
    private _selectedTalent: string;
    private _selectedEquipment: string[];
    private _signatureSkills: Skill[];
    private _selectedSignatureSkill: Skill;
    private _mandatoryDone: boolean;
    private _electiveDone: boolean;

    constructor(props: IPageProperties) {
        super(props);

        const education = EducationsHelper.getEducation(character.education);

        this._signatureSkills = [];

        education.mandatory.forEach(skill => {
            if (this._signatureSkills.indexOf(skill) === -1) {
                if (!character.skills[skill].isSignature) {
                    this._signatureSkills.push(skill);
                }
            }
        });

        education.elective.forEach(skill => {
            if (!character.skills[skill].isSignature) {
                if (this._signatureSkills.indexOf(skill) === -1) {
                    this._signatureSkills.push(skill);
                }
            }
        });

        this._selectedEquipment = [];

        var n = 0;
        education.equipment.forEach(e => {
            if (e.indexOf('|') > -1) {
                this._selectedEquipment[n] = e.split('|')[0];
                n++;
            }
        });

        this._mandatoryDone = false;
        this._electiveDone = false;
    }

    render() {
        var education = EducationsHelper.getEducation(character.education);

        const attributes =
            (
                <div>
                    <AttributeView name={AttributesHelper.getAttributeName(education.plus2) } points={2} value={character.attributes[education.plus2].value}/>
                    <AttributeView name={AttributesHelper.getAttributeName(education.plus1) } points={1} value={character.attributes[education.plus1].value}/>
                    <AttributeView name={AttributesHelper.getAttributeName(education.minus1) } points={-1} value={character.attributes[education.minus1].value}/>
                </div>
            );

        const mandatory = education.mandatory.map((m, i) => {
            return (
                <SkillImprovement key={i} skill={m} onDone={(done) => { this._mandatoryDone = done; this.onUpdate(); } } />
            )
        });

        return (
            <div className="page">
                <PageHeader text="EDUCATION" />
                <div className="header-text">{education.name}</div>
                <div className="panel">
                    <div className="header-small">ATTRIBUTES</div>
                    {attributes}
                </div>
                <div className="panel">
                    <div className="header-small">MANDATORY SKILLS</div>
                    {mandatory}
                </div>
                <div className="panel">
                    <div className="header-small">ELECTIVE SKILLS</div>
                    <ElectiveSkillImprovement skills={education.elective} points={2} onDone={(done) => { this._electiveDone = done; this.onUpdate(); } } />
                </div>
                <div className="panel">
                    <div className="header-small">SIGNATURE SKILL</div>
                    <SignatureSkillSelection skills={this._signatureSkills} onSelection={(skill) => this.onSignatureSkillSelected(skill) } />
                </div>
                <div className="panel">
                    <div className="header-small">TALENT</div>
                    <TalentList skills={[this._selectedSignatureSkill]} onSelection={talent => this.onTalentSelected(talent) } selTal={this._selectedTalent}/>
                </div>
                <div className="panel">
                    <div className="header-small">EQUIPMENT</div>
                    <EquipmentList equipment={education.equipment} onSelected={(eq, i) => this.onEquipmentSelected(eq, i) } />
                </div>
                <Button text="ADOLESCENCE EVENT" className="button-next" onClick={() => this.onNext() }/>
            </div>
        );
    }

    private onUpdate() {
        this.forceUpdate();
    }

    private onSignatureSkillSelected(skill: Skill) {
        this._selectedSignatureSkill = skill;
        this.forceUpdate();
    }

    private onTalentSelected(talent: string) {
        this._selectedTalent = talent;
    }

    private onEquipmentSelected(eq: string, index: number) {
        this._selectedEquipment[index] = eq;
    }

    private onNext() {
        if (!this._mandatoryDone) {
            Dialog.show("You have not distributed all mandatory skill points.");
            return;
        }

        if (!this._electiveDone) {
            Dialog.show("You have not distributed all elective skill points.");
            return;
        }

        if (this._selectedSignatureSkill == null) {
            Dialog.show("You have not selected a signature skill.");
            return;
        }

        if (this._selectedTalent === null || this._selectedTalent.length === 0) {
            Dialog.show("You have not selected a talent.");
            return;
        }

        character.addTalent(this._selectedTalent);

        this._selectedEquipment.forEach(eq => {
            character.addEquipment(eq);
        });

        Navigation.navigateToPage(PageIdentity.AdolescenceEvent);
    }
}