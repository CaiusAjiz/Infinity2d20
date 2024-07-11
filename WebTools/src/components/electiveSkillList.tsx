import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';
import CheckBox from '../components/checkBox';

interface IElectiveSkillProperties {
    skill: Skill;
    isSelected: boolean;
    onSelected: (val: any) => void;
}

class ElectiveSkill extends React.Component<IElectiveSkillProperties, {}> {
    constructor(props: IElectiveSkillProperties) {
        super(props);
    }

    render() {
        const {skill, onSelected, isSelected} = this.props;

        const skillExpertise = character.skills[skill].expertise;
        const skillFocus = character.skills[skill].focus;

        return (
            <table className="skill-container" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td className="skill-name" style={{ width: "250px" }}>{SkillsHelper.getSkillName(skill) }</td>
                        <td><CheckBox value={skill} onChanged={val => onSelected(val) } isChecked={isSelected} /></td>
                    </tr>
                    <tr>
                        <td className="skill-expertise">Expertise</td>
                        <td>{skillExpertise}</td>
                    </tr>
                    <tr>
                        <td className="skill-focus">Focus</td>
                        <td>{skillFocus}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

interface IElectiveSkillListProperties {
    skills: Skill[];
    onUpdated?: (skills: Skill[]) => void;
}

export class ElectiveSkillList extends React.Component<IElectiveSkillListProperties, {}> {
    private _selected: Skill[];

    constructor(props: IElectiveSkillListProperties) {
        super(props);
        this._selected = [];
    }

    render() {
        const skills = this.props.skills.map((s, i) => {
            const isSelected = this._selected.indexOf(s) > -1;
            return (<ElectiveSkill key={i} skill={s} isSelected={isSelected} onSelected={skill => this.onSelect(skill) }/>)
        });

        return (
            <div>{skills}</div>
        );
    }

    private onSelect(skill: Skill) {
        const n = this._selected.indexOf(skill);

        if (n < 0) {
            this._selected.push(skill);

            if (this._selected.length === 3) {
                this.deselect(this._selected[0]);
                this._selected.splice(0, 1);
            }

            this.select(skill);
        }
        else {
            this._selected.splice(n, 1);
            this.deselect(skill);
        }

        if (this.props.onUpdated) {
            this.props.onUpdated(this._selected);
        }
        else {
            this.forceUpdate();
        }
    }

    private select(skill: Skill) {
        character.skills[skill].expertise++;
        character.skills[skill].focus++;
    }

    private deselect(skill: Skill) {
        character.skills[skill].expertise--;
        character.skills[skill].focus--;
    }
}