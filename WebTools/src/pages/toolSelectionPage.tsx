import * as React from 'react';
import { Navigation } from '../common/navigator';
import { PageIdentity, IPageProperties } from './pageFactory';
import { Button } from '../components/button';
import CheckBox from '../components/checkBox';
import { PageHeader } from '../components/pageHeader';

enum Tool {
    CharacterGenerator,
    TalentsOverview,
}

export class ToolSelectionPage extends React.Component<IPageProperties, {}> {
    constructor(props: IPageProperties) {
        super(props);
    }

    render() {
        return (
            <div className="page">
                <div className="page-text">
                    Select tool.
                </div>
                <div className="panel">
                    <div className="button-container">
                        <Button text="Character Generator" className="button" onClick={() => { this.selectTool(Tool.CharacterGenerator); }} />
                        <Button text="Talents Overview" className="button" onClick={() => { this.selectTool(Tool.TalentsOverview); }} />
                    </div>
                </div>
            </div>
        );
    }

    private selectTool(tool: Tool) {
        switch (tool) {
            case Tool.CharacterGenerator:
                Navigation.navigateToPage(PageIdentity.PathSelection);
                break;
            case Tool.TalentsOverview:
                Navigation.navigateToPage(PageIdentity.TalentsOverview);
                break;
        }
    }
}