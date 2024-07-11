import * as React from 'react';
import {character} from '../common/character';
import CheckBox from './checkBox';

interface ILanguageListProperties {
    onSelection: (langs: string[]) => void;
    points: number;
}

export class LanguageList extends React.Component<ILanguageListProperties, {}> {
    private _languages: string[];
    private _points: number;

    constructor(props: ILanguageListProperties) {
        super(props);

        this._languages = [];
        this._points = props.points;
    }

    render() {
        /*const homelands = HomelandsHelper.getHomelands();
        let languages: string[] = [];

        homelands.forEach(homeland => {
            homeland.languageOptions.forEach(lang => {
                if (!character.hasLanguage(lang) && languages.indexOf(lang) === -1) {
                    languages.push(lang);
                }
            });
        });

        languages = languages.sort((a, b) => a.localeCompare(b));

        const langs = languages.map((l, i) => {
            const isSelected = this._languages.indexOf(l) > -1;

            return (
                <tr key={i}>
                    <td>{l}</td>
                    <td>
                        <CheckBox value={l} onChanged={val => this.onLanguageSelected(val) } isChecked={isSelected} />
                    </td>
                </tr>
            )
        });

        return (
            <table className="selection-list" cellSpacing="0" cellPadding="0">
                <tbody>
                    {langs}
                </tbody>
            </table>
        );*/
        return undefined;
    }

    private onLanguageSelected(lang: string) {
        this._languages.push(lang);

        if (this._languages.length === this._points + 1) {
            this._languages.splice(0, 1);
        }

        this.props.onSelection(this._languages);
    }
};