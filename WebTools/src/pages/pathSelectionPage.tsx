import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {IPageProperties, PageIdentity} from './pageFactory';
import {PageHeader} from '../components/pageHeader';
import {Button} from '../components/button';
import CheckBox from '../components/checkBox';
import {Source, SourcesHelper} from '../helpers/sources';

export class PathSelectionPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);
    }

    render() {
        const sources = SourcesHelper.getSources().map((src, i) => {
            return (
                <div key={i} className="panel">
                    <div className="source-select">
                        <CheckBox value={i} onChanged={val => this.onSourceChanged(val) } isChecked={character.hasSource(i) } />
                    </div>
                    <div className="source-name">{src.name}</div>
                </div>
            );
        });

        return (
            <div className="page">
                <PageHeader text="PATH CHOICE" />
                <div className="page-text">
                    Select your sources and character creation path.
                    <br/>
                    Ask your GM for available sources.
                </div>
                <div className="source-list">
                    {sources}
                </div>
                <br/><br/>
                <div className="center-container">
                    <div className="path-choice">
                        <h3 className="option-header">NORMAL</h3>
                        <br/>
                        You gain <b>5 Life Points</b> to help you navigate the tumultous nature of your personal histories.
                        Excess Life Points may be traded for Infinity Points or Assets during the final step.
                        <br /><br /><br /><br />
                        <Button className="button-dark" text="Select" onClick={() => { this.onNormalSelected(); } } />
                        <br />
                    </div>
                    <div style={{ width: "20px", display: "inline-block" }}>&nbsp;</div>
                    <div className="path-choice">
                        <h3 className="option-header">OPTIONAL</h3>
                        <br/>
                        <strong>Use only if your GM allows it!</strong>
                        <br /><br />
                        You gain <b>12 Life Points</b> to help you make the choices you want during character creation.
                        Excess Life Points <i>cannot</i> be traded for Infinity Points or Assets during the final step.
                        <br /><br />
                        <Button className="button-dark" text="Select" onClick={() => { this.onOptionalSelected(); } } />
                        <br />
                    </div>
                </div>
            </div>
        );
    }

    private onSourceChanged(source: Source) {
        if (character.hasSource(source)) {
            character.removeSource(source);
        }
        else {
            character.addSource(source);
        }

        this.forceUpdate();
    }

    private onNormalSelected() {
        character.lifePoints = 5;
        character.isOptional = false;
        Navigation.navigateToPage(PageIdentity.BirthHost);
    }

    private onOptionalSelected() {
        character.lifePoints = 12;
        character.isOptional = true;
        Navigation.navigateToPage(PageIdentity.BirthHost);
    }
}