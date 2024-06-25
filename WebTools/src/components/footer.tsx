import * as React from 'react';
import {character} from '../common/character';
import {Events, EventIdentity} from '../common/eventChannel';
import { News } from '../news';
import { Dialog } from './dialog';

interface IFooterProperties {
}

interface IFooterState {
    buttonClass: string;
}

export class Footer extends React.Component<IFooterProperties, IFooterState> {
    private _isSheetVisible: boolean;

    constructor(props: IFooterProperties) {
        super(props);

        this._isSheetVisible = false;
        this.state = {
            buttonClass: "arrow-right"
        };
    }

    render() {
        return (
            <div>
                <div className="page-footer">
                    <div id="history"></div>
                    <div className="page-footer-icon-container" onClick={() => { this.showHistory(); } }>
                        <img src="res/img/history.png" className="page-footer-icon" title="History"/>
                    </div>
                    <div className="page-footer-icon-container" onClick={() => { this.showCharacter(); } }>
                        <img src="res/img/sheet.png" className="page-footer-icon" title="View character"/>
                    </div>
                    <div className="lifepoints-container">
                        <span id="lifepoints" className="lifepoints">{character.lifePoints}</span>
                        <div className="lifepoints-label">Life Points</div>
                    </div>
                    <div className="page-footer-icon-container" onClick={() => { this.feedback(); } }>
                        <img src="res/img/feedback.png" className="page-footer-icon" title="Provide feedback"/>
                    </div>
                    <div className="page-footer-icon-container" onClick={() => { this.whatsNew(); } }>
                        <img src="res/img/news.png" className="page-footer-icon" title="What's new?"/>
                    </div>
                </div>
            </div>
        );
    }

    private showHistory() {
        Events.signal(EventIdentity.ShowHistory);
    }

    private showCharacter() {
        this._isSheetVisible = !this._isSheetVisible;

        var sheetBg = document.getElementById("sheet-bg");

        var sheet = document.getElementsByClassName("sheet-container")[0];
        var content = [
            document.getElementsByClassName("content")[0],
            document.getElementsByClassName("content-container-fullscreen")[0]
        ];

        if (this._isSheetVisible) {
            sheetBg.style.display = "";

            sheet.classList.add("sheet-container-visible");
            sheet.classList.remove("sheet-container-hidden");

            content.forEach(el => {
                el.classList.add("content-nudged");
            });

            this.setState({ buttonClass: "arrow-right arrow-left" });

            Events.signal(EventIdentity.UpdateCharacter);
        }
        else {
            sheetBg.style.display = "none";

            sheet.classList.add("sheet-container-hidden");
            sheet.classList.remove("sheet-container-visible");

            content.forEach(el => {
                el.classList.remove("content-nudged");
            });

            this.setState({ buttonClass: "arrow-right" });
        }
    }

    private feedback() {
        alert("Sorry isn't working right now, it'll return soon!") //remove this once there's a solution for feedback, currently a dead link
        /*const url = "https://goo.gl/forms/z8eOMDViQYig8FM73";
        const win = window.open(url, "_blank");
        if (win) {
            win.focus();
        }
        else {
            alert("Please allow popup windows for this site.");
        } */
    }

    private whatsNew() {
        Dialog.show(News.getWhatsNew());
    }
}