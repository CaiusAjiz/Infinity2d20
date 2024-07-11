import * as React from 'react';
import {character} from '../common/character';
import {SkillsHelper, Skill} from '../helpers/skills';
import {TalentViewModel, TalentsHelper} from '../helpers/talents';
import {DropDownInput} from './dropDownInput';
import CheckBox from './checkBox';

interface ITalentSelectionProperties {
    talents?: string[];
    onSelection: (talent: string) => void;
}

export class TalentSelection extends React.Component<ITalentSelectionProperties, {}> {
    private _talents: TalentViewModel[];
    private _talent: string;
    private _index: number;

    constructor(props: ITalentSelectionProperties) {
        super(props);

        this._talents = !this.props.talents
            ? TalentsHelper.getTalentsForSkills([...SkillsHelper.getSkills()])
            : this.props.talents.map(t => {
                if (t.indexOf('(') > -1) {
                    t = t.substr(0, t.indexOf('(') - 1);
                }

                if (t.indexOf('[') > -1) {
                    t = t.substr(0, t.indexOf('[') - 1);
                }

                const talent = TalentsHelper.getTalent(t);
                return new TalentViewModel(talent.name, character.hasTalent(t) ? character.talents[t].rank : 1, talent.maxRank > 1, talent.description, TalentsHelper.getSkillForTalent(t));
            });

        this._talents = this._talents.filter((value, index, array) => !array.filter((v, i) => value.name === v.name && i < index).length);

        this._talent = this._talents[0].name;
        this._index = 0;
    }

    render() {
        const talents = this._talents.map((t, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{t.name}</td>
                    <td>{t.description}</td>
                    <td>
                        <CheckBox
                            value={t.name}
                            isChecked={this._talent === t.name}
                            onChanged={(val) => {
                                this.selectTalent(val);
                            } }/>
                    </td>
                </tr>
            );
        });

        return (
            <table className="selection-list">
                <tbody>
                    {talents}
                </tbody>
            </table>
        );
    }

    private selectTalent(talent: string) {
        this._talent = talent;
        this.props.onSelection(this._talent);
        this.forceUpdate();
    }
}