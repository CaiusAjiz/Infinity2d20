import * as React from 'react';
import {character} from '../common/character';
import {Button} from '../components/button';
import CheckBox from '../components/checkBox';
import {Dialog} from '../components/dialog';
import {BirthPlacesHelper} from '../helpers/birthPlaces';

export class LifePointLanguages extends React.Component<{}, {}> {
    private _languages: string[] = [];

    render() {
        const languages = BirthPlacesHelper.getCustomizationLanguages();
        let langs = []; 
        for (var i = 0; i < languages.length; i++) {
            var lang = languages[i];
            if (character.languages.indexOf(lang) === -1) {
                langs.push(lang);
            }
        }

        const langList = langs.map((lang, i) => {
            return (
                <table cellSpacing="0" cellPadding="0" key={i}>
                    <tbody>
                        <tr>
                            <td><CheckBox isChecked={this._languages.indexOf(lang) > -1} value={lang} onChanged={(val) => this.selectLanguage(val) }/></td>
                            <td>{lang}</td>
                        </tr>
                    </tbody>
                </table>
            );
        });

        const button = (<Button text="1-6 Random" lpCost={1} className="button-dark" onClick={() => this.generateLanguages() } />);

        return (
            <div>
                {button}
                {langList}
            </div>
        );
    }

    private selectLanguage(lang: string) {
        const n = this._languages.indexOf(lang);
        if (n > -1) {
            this._languages.splice(n, 1);
            character.lifePoints++;
        }
        else if (character.lifePoints > 0) {
            this._languages.push(lang);
            character.lifePoints--;
        }

        this.forceUpdate();
    }

    private generateLanguages() {
        let langs: string[] = [];
        const num = Math.floor(Math.random() * 6) + 1;
        for (var i = 0; i < num; i++) {
            const lang = BirthPlacesHelper.generateRandomLanguage(character.faction, true, true);
            if (character.languages.indexOf(lang[0]) > -1 || langs.indexOf(lang[0]) > -1) {
                continue;
            }
            else {
                character.addLanguage(lang[0]);
                langs.push(lang[0]);
            }
        }

        if (langs.length === 0) {
            this.generateLanguages();
            return;
        }

        let msg = "You gained the following languages: ";
        for (var lang in langs) {
            msg += langs[lang] + " ";
        }

        character.lifePoints--;

        Dialog.show(msg, () => { this.forceUpdate() });
    }
}