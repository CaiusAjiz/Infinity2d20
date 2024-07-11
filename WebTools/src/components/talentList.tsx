import * as React from 'react';
import {Skill} from '../helpers/skills';
import {TalentViewModel, TalentsHelper} from '../helpers/talents';
import {DropDownInput} from './dropDownInput';
import CheckBox from './checkBox';

const TalentList = (props) => {
    const { skills, onSelection, selTal} = props
    const [_talents, setTalents] = React.useState([])
    const [_talent, setTalent] = React.useState("");
    const [_selectedIndex, setSelectedIndex] = React.useState(0)
    
    React.useEffect(() => {
        setTalents(TalentsHelper.getTalentsForSkills(skills).filter((value, index, array) => !array.filter((v, i) => value.name === v.name && i < index).length));    
    },[skills])
 
    const selectTalent = (talent) => {
        setTalent(talent);
        onSelection(talent);
    }
    
    return (
        <table className="selection-list">
            <tbody>
                {_talents.map((t, i) => {
                    return (
                        <tr key={i}>
                            <td className="selection-header-small">{t.name}</td>
                            <td>{t.description}</td>
                            <td>
                                <CheckBox
                                    value={t.name}
                                    isChecked={_talent === t.name}
                                    onChanged={(val) => {
                                        selectTalent(val);
                                    } 
                                }/>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

}

export default TalentList

/*interface ITalentListProperties {
    skills: Skill[];
    onSelection: (talent: string) => void;
    selTal: string
}

export class TalentList extends React.Component<ITalentListProperties, {}> {
    private _talents: TalentViewModel[];
    private _selectedIndex: number;
    private _talent: string;

    constructor(props: ITalentListProperties) {
        super(props);
        this._talents = [];
        this._selectedIndex = 0;
    }

    componentWillReceiveProps(props: ITalentListProperties) {
        this._selectedIndex = 0;
        this.props.onSelection("");
    }


    render() {
        this._talents = TalentsHelper.getTalentsForSkills([...this.props.skills]);
        this._talents = this._talents.filter((value, index, array) => !array.filter((v, i) => value.name === v.name && i < index).length);
        console.log(this._talent)
        console.log(this.props.selTal)
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
}*/