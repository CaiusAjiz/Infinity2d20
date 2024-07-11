import * as React from 'react';
import {PathSelectionPage} from './pathSelectionPage';
import {BirthHostPage} from './birthHostPage';
import {BirthHostPage_LifePoints} from './birthHostPage_LifePoints';
import {HostBodyPage} from './hostBodyPage';
import {FactionPage} from './factionPage';
import {HeritagePage} from './heritagePage';
import {FactionDetailsPage} from './factionDetailsPage';
import {BirthPlacePage} from './birthPlacePage';
import {BirthPlaceDetailsPage} from './birthPlaceDetailsPage';
import {TribePage} from './tribePage';
import {TribeDetailsPage} from './tribeDetailsPage';
import {SissoluWatersPage} from './sissoluWatersPage';
import {SissoluWatersDetailsPage} from './sissoluWatersDetailsPage';
import {SocialClassPage} from './socialClassPage';
import {HomeEnvironmentPage} from './homeEnvironmentPage';
import {StatusDetailsPage} from './statusDetailsPage';
import {YouthEventPage} from './youthEventPage';
import {YouthEventDetailsPage} from './youthEventDetailsPage';
import {EducationPage} from './educationPage';
import {EducationDetailsPage} from './educationDetailsPage';
import {AdolescenceEventPage} from './adolescenceEventPage';
import {EventDetailsPage} from './eventDetailsPage';
import {AfterEventPage} from './afterEventPage';
import {CareerPage} from './careerPage';
import {HazardFailPage} from './hazardFailPage';
import CareerDetailsPage from './careerDetailsPage';
import {CareerEventPage} from './careerEventPage';
import {FiredPage} from './firedPage';
import {CriminalRecordPage} from './criminalRecordPage';
import {GeistPage} from './geistPage';
import {FinalTweaksPage} from './finalTweaksPage';
import {FinalTweaks_LifePoints} from './finalTweaks_LifePoints';
import {FinishPage} from './finishPage';
import {AlephFormPage} from './alephFormPage';
import {AlephDetailsPage} from './alephDetailsPage';
import {ExportTestPage} from './exportTestPage';
import { ToolSelectionPage } from './toolSelectionPage';
import { TalentsOverviewPage } from './talentsOverviewPage';
import { UpliftHostPage } from './upliftHostPage';
import { AwakeningEventPage } from './awakeningEventsPage';
import { AwakeningEventDetailsPage } from './awakeningEventDetailsPage';
import { UpliftHostDetailsPage } from './upliftHostDetailsPage';

export enum PageIdentity {
    PathSelection,
    BirthHost,
    BirthHost_LifePoints,
    HostBody,
    Faction,
    Heritage,
    FactionDetails,
    BirthPlace,
    BirthPlaceDetails,
    Tribe,
    TribeDetails,
    SissoluWaters,
    SissoluWatersDetails,
    SocialClass,
    HomeEnvironment,
    StatusDetails,
    YouthEvent,
    YouthEventDetails,
    Education,
    EducationDetails,
    AdolescenceEvent,
    EventDetails,
    Career1,
    Career2,
    Career3,
    Career4,
    HazardFail1,
    HazardFail2,
    HazardFail3,
    HazardFail4,
    CareerDetails1,
    CareerDetails2,
    CareerDetails3,
    CareerDetails4,
    CareerEvent1,
    CareerEvent2,
    CareerEvent3,
    CareerEvent4,
    ExtendedCareerEvent1,
    ExtendedCareerEvent2,
    ExtendedCareerEvent3,
    ExtendedCareerEvent4,
    Geist,
    FinalTweaks,
    FinalTweaks_LifePoints,
    Finish,

    AlepForms,
    AlephDetails,

    UpliftHosts,
    UpliftHostDetails,
    AwakeningEvent,
    AwakeningEventDetails,

    AfterEvent,
    Fired,
    CriminalRecord,
    ToolSelection,
    TalentsOverview,

    ExportTest
}

export interface IPageProperties {
}

export class PageFactory {
    private factories = {};

    constructor() {
        this.factories = {};
        this.factories[PageIdentity.ToolSelection] = () => <ToolSelectionPage />;
        this.factories[PageIdentity.PathSelection] = () => <PathSelectionPage/>;
        this.factories[PageIdentity.BirthHost] = () => <BirthHostPage/>;
        this.factories[PageIdentity.BirthHost_LifePoints] = () => <BirthHostPage_LifePoints/>;
        this.factories[PageIdentity.HostBody] = () => <HostBodyPage/>;
        this.factories[PageIdentity.Faction] = () => <FactionPage/>;
        this.factories[PageIdentity.Heritage] = () => <HeritagePage/>;
        this.factories[PageIdentity.FactionDetails] = () => <FactionDetailsPage/>;
        this.factories[PageIdentity.BirthPlace] = () => <BirthPlacePage/>;
        this.factories[PageIdentity.BirthPlaceDetails] = () => <BirthPlaceDetailsPage/>;
        this.factories[PageIdentity.Tribe] = () => <TribePage/>;
        this.factories[PageIdentity.TribeDetails] = () => <TribeDetailsPage/>;
        this.factories[PageIdentity.SissoluWaters] = () => <SissoluWatersPage/>;
        this.factories[PageIdentity.SissoluWatersDetails] = () => <SissoluWatersDetailsPage/>;
        this.factories[PageIdentity.SocialClass] = () => <SocialClassPage/>;
        this.factories[PageIdentity.HomeEnvironment] = () => <HomeEnvironmentPage/>;
        this.factories[PageIdentity.StatusDetails] = () => <StatusDetailsPage/>;
        this.factories[PageIdentity.YouthEvent] = () => <YouthEventPage/>;
        this.factories[PageIdentity.YouthEventDetails] = () => <YouthEventDetailsPage/>;
        this.factories[PageIdentity.Education] = () => <EducationPage/>;
        this.factories[PageIdentity.EducationDetails] = () => <EducationDetailsPage/>;
        this.factories[PageIdentity.AdolescenceEvent] = () => <AdolescenceEventPage/>;
        this.factories[PageIdentity.EventDetails] = () => <EventDetailsPage/>;
        this.factories[PageIdentity.AfterEvent] = () => <AfterEventPage/>;
        this.factories[PageIdentity.Career1] = () => <CareerPage/>;
        this.factories[PageIdentity.Career2] = () => <CareerPage/>;
        this.factories[PageIdentity.Career3] = () => <CareerPage/>;
        this.factories[PageIdentity.Career4] = () => <CareerPage/>;
        this.factories[PageIdentity.HazardFail1] = () => <HazardFailPage/>;
        this.factories[PageIdentity.HazardFail2] = () => <HazardFailPage/>;
        this.factories[PageIdentity.HazardFail3] = () => <HazardFailPage/>;
        this.factories[PageIdentity.HazardFail4] = () => <HazardFailPage/>;
        this.factories[PageIdentity.CareerDetails1] = () => <CareerDetailsPage/>;
        this.factories[PageIdentity.CareerDetails2] = () => <CareerDetailsPage/>;
        this.factories[PageIdentity.CareerDetails3] = () => <CareerDetailsPage/>;
        this.factories[PageIdentity.CareerDetails4] = () => <CareerDetailsPage/>;
        this.factories[PageIdentity.CareerEvent1] = () => <CareerEventPage/>;
        this.factories[PageIdentity.CareerEvent2] = () => <CareerEventPage/>;
        this.factories[PageIdentity.CareerEvent3] = () => <CareerEventPage/>;
        this.factories[PageIdentity.CareerEvent4] = () => <CareerEventPage/>;
        this.factories[PageIdentity.ExtendedCareerEvent1] = () => <CareerEventPage/>;
        this.factories[PageIdentity.ExtendedCareerEvent2] = () => <CareerEventPage/>;
        this.factories[PageIdentity.ExtendedCareerEvent3] = () => <CareerEventPage/>;
        this.factories[PageIdentity.ExtendedCareerEvent4] = () => <CareerEventPage/>;
        this.factories[PageIdentity.Fired] = () => <FiredPage/>;
        this.factories[PageIdentity.CriminalRecord] = () => <CriminalRecordPage/>;
        this.factories[PageIdentity.Geist] = () => <GeistPage/>;
        this.factories[PageIdentity.FinalTweaks] = () => <FinalTweaksPage/>;
        this.factories[PageIdentity.FinalTweaks_LifePoints] = () => <FinalTweaks_LifePoints/>;
        this.factories[PageIdentity.Finish] = () => <FinishPage/>;
        this.factories[PageIdentity.AlepForms] = () => <AlephFormPage/>;
        this.factories[PageIdentity.AlephDetails] = () => <AlephDetailsPage />;
        this.factories[PageIdentity.UpliftHosts] = () => <UpliftHostPage />;
        this.factories[PageIdentity.UpliftHostDetails] = () => <UpliftHostDetailsPage />;
        this.factories[PageIdentity.AwakeningEvent] = () => <AwakeningEventPage />;
        this.factories[PageIdentity.AwakeningEventDetails] = () => <AwakeningEventDetailsPage />;
        this.factories[PageIdentity.TalentsOverview] = () => <TalentsOverviewPage />;
        this.factories[PageIdentity.ExportTest] = () => <ExportTestPage/>;
    }

    createPage(page: PageIdentity) {
        const factory = this.factories[page];
        if (!factory) {
            console.error(`Unable to find a page factory for ${PageIdentity[page]}`);
        }

        return factory ? factory() : undefined; // TODO: return an error page instead of undefined
    }
}