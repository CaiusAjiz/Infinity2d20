import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties, PageIdentity} from './pageFactory';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import {BirthPlacesHelper} from '../helpers/birthPlaces';
import {FactionsHelper} from '../helpers/factions';
import {Dialog} from '../components/dialog';

interface ITribePageState {
    showSelection: boolean;
}

export class SissoluWatersPage extends React.Component<IPageProperties, ITribePageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false
        };
    }

    render() {
        return (
            <div className="page">
                <PageHeader text="SISSOLU WATERS" />
                <div>
                    <div className="page-text">
                        From what Sissolu Waters do you hail?
                    </div>
                    <div className="button-container">
                        <Button text="ROLL SISSOLU WATERS" className="button-dark" onClick={() => { this.rollWaters() } }/>
                    </div>
                </div>
            </div>
        );
    }

    private rollWaters() {
        var waters = BirthPlacesHelper.generateSissoluWaters();
        this.selectWaters(waters.roll);
    }

    private showWaters() {
        this.setState({ showSelection: true });
    }

    private hideWaters() {
        this.setState({ showSelection: false });
    }

    private selectWaters(waters: number) {
        const wat = BirthPlacesHelper.getSissoluWater(waters);
        character.birthPlace += ` (${wat.name})`;
        character.sissoluWaters = waters;

        BirthPlacesHelper.applySissoluWaters(waters);

        Navigation.navigateToPage(PageIdentity.SissoluWatersDetails);
    }
}