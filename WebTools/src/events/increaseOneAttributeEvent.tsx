import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import { Button } from '../components/button';
import { Attribute } from '../helpers/attributes';
import { PageIdentity } from '../pages/pageFactory';
import CheckBox from '../components/checkBox';

export class IncreaseOneAttributeEvent extends React.Component<{}, {}> {
    private attr: number = Attribute.Agility;

    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    Increase either Awareness or Agility by 1. However, decrease the Attribute you didn’t select by 1.
                </div>
                <div className="panel">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <CheckBox value={Attribute.Agility} isChecked={this.attr === Attribute.Agility} onChanged={(val) => { this.attr = val; }} />
                                </td>
                                <td>Agility</td>
                            </tr>
                            <tr>
                                <td>
                                    <CheckBox value={Attribute.Awareness} isChecked={this.attr === Attribute.Awareness} onChanged={(val) => { this.attr = val; }} />
                                </td>
                                <td>Awareness</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Button text="DONE" className="button-next" onClick={() => this.onNext()} />
            </div>
        );
    }

    private onNext() {
        switch (this.attr) {
            case Attribute.Agility:
                character.attributes[Attribute.Agility].value++;
                character.attributes[Attribute.Awareness].value--;
                break;
            case Attribute.Awareness:
                character.attributes[Attribute.Awareness].value++;
                character.attributes[Attribute.Agility].value--;
                break;
        }

        Navigation.navigateToPage(PageIdentity.AfterEvent);
    }
}