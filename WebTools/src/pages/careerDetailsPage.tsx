import * as React from 'react';
import {character} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageFactory';
import {Career, CareersHelper} from '../helpers/careers';
import {Skill} from '../helpers/skills';
import {AttributesHelper} from '../helpers/attributes';
import {PageHeader} from '../components/pageHeader';
import {AttributeView} from '../components/attribute';
import {SkillImprovement} from '../components/skillImprovement';
import {Button} from '../components/button';
import CheckBox from '../components/checkBox';
import {ElectiveSkillImprovement} from '../components/electiveSkillImprovement';
import {SignatureSkillSelection} from '../components/signatureSkillSelection';
import TalentList from '../components/talentList';
import {EquipmentList} from '../components/equipmentList';
import {Dialog} from '../components/dialog';
import {HassassinOrdersHelper} from '../helpers/hassassinOrders';
import {MilitaryOrdersHelper} from '../helpers/militaryOrders';
import {SocialClassesHelper} from '../helpers/socialClasses';
import {EquipmentHelper} from '../helpers/equipment';
import {CatSquadsHelper} from '../helpers/catSquads';

const CareerDetailsPage = () => {

    const [_selectedTalent, setSelectedTalent] = React.useState(null)
    const [_selectedEquipment, setSelectedEquipment] = React.useState([])
    const [_signatureSkills, setSignatureSkills] = React.useState([])
    const [_selectedSignatureSkill, setSelectedSignatureSkill] = React.useState(null)
    const [_showEquipment, setShowEquipment] = React.useState(false)
    const [_mandatoryDone, setMandatoryDone] = React.useState(false)
    const [_electiveDone, setElectiveDone] = React.useState(false)
    const [_isHassassin, setIsHassassin] = React.useState(false)
    const [_isMilitaryOrder, setIsMilitaryOrder] = React.useState(false)
    const [_isCatSquad, setIsCatSquad] = React.useState(false)
    const [_order, setOrder] = React.useState(null)
    const [_selectedOrder, setSelectedOrder] = React.useState(null)

    const currentCareer = character.careers[character.careers.length - 1].career
    const career = CareersHelper.getCareer(currentCareer)

    React.useEffect(() =>{
        if (character.hazardDecrease > 0) {
            character.hazardDecrease = 0;
            character.earnings++;
        }

        career.mandatory.forEach(skill => {
            if (_signatureSkills.indexOf(skill) === -1 && !character.skills[skill].isSignature) {
                let signatureSkillsPlaceholder = _signatureSkills
                signatureSkillsPlaceholder.push(skill);
                setSignatureSkills(signatureSkillsPlaceholder)
            }
        });

        career.elective.forEach(skill => {
            if (_signatureSkills.indexOf(skill) === -1 && !character.skills[skill].isSignature) {
                let signatureSkillsPlaceholder = _signatureSkills
                signatureSkillsPlaceholder.push(skill);
                setSignatureSkills(signatureSkillsPlaceholder)
            }
        });

        let n = 0;
        let holdingEquipment = _selectedEquipment
        career.equipment.forEach(eq => {
            if (eq.indexOf('|') > -1) {
                const e = eq.split('|');
                holdingEquipment[n] = e[0];
                n++;
            }
        });
        setSelectedEquipment(holdingEquipment)

        let careerCounter = 0;
        character.careers.forEach(c => {
            if (c.career === currentCareer) {
                careerCounter++;
            }
        });

        setShowEquipment(careerCounter === 1)

        const hassassin = currentCareer === Career.HassassinFidayHaqqislam || currentCareer === Career.HassassinExemplar

        setIsHassassin(hassassin);

        if (hassassin) {
            const newOrder = character.hassassinOrder >= 0 ? character.hassassinOrder : HassassinOrdersHelper.generateOrder()
            setOrder(newOrder);
            setSelectedOrder(newOrder);
        }

        const militaryOrder = currentCareer === Career.Knight || currentCareer === Career.OrderSergeant

        setIsMilitaryOrder(militaryOrder)

        if (militaryOrder) {
            
            const newOrder = character.militaryOrder >= 0 ? character.militaryOrder : MilitaryOrdersHelper.generateOrder();
            setOrder(newOrder) 
            setSelectedOrder(newOrder);
        }

        const catsquad = currentCareer === Career.CatSquadMember

        setIsCatSquad(catsquad);

        if (catsquad) {
            
            const newOrder = character.catSquad >= 0 ? character.catSquad : CatSquadsHelper.generateOrder();
            setOrder(newOrder) 
            setSelectedOrder(newOrder);
        }

        if (character.hassassinEvent) {
            if (character.careers.length >= 2) {
                const lastCareer = character.careers[character.careers.length - 2].career;
                if (lastCareer === currentCareer) {
                    character.hassassinEvent = false;
                    SocialClassesHelper.increaseSocialClass();
                } 
            }
        }

        // Reset this...
        character.firstCareer = undefined;
    },[])

    const drawEquipment = (careerEquipment: string[]) => {
        if (!_showEquipment) {
            return undefined;
        }

        var equipment: string[] = [];

        if (_isHassassin && character.careers[character.careers.length - 1].career !== Career.HassassinFidayHaqqislam) {
            equipment = HassassinOrdersHelper.getOrder(_selectedOrder).gear;
        }
        else if (_isMilitaryOrder) {
            equipment = MilitaryOrdersHelper.getOrder(_selectedOrder).gear;
        }
        else if (_isCatSquad) {
            equipment = CatSquadsHelper.getOrder(_selectedOrder).gear;
        }
        else {
            equipment = careerEquipment;
        }

        return (
            <div className="panel">
                <div className="header-small">EQUIPMENT</div>
                <EquipmentList
                    equipment={equipment}
                    onSelected={(eq, i) => onEquipmentSelected(eq, i) }/>
            </div>
        );
    }

    const drawOrderSelection = () => {
        if (_isHassassin) {
            return (
                <div className="panel">
                    <div className="header-small">HASSASSIN ORDER</div>
                    <div>
                        Your assigned Hassassin Order is {HassassinOrdersHelper.getOrder(_selectedOrder).name}.
                        Changing it will cost you a Life Point.
                    </div>
                    <div>
                        <table className="selection-list">
                            <tbody>
                                {HassassinOrdersHelper.getOrders().map((o, i) => {
                                    const checkBox = <CheckBox
                                        isChecked={_selectedOrder === o.id}
                                        value={o.id}
                                        onChanged={(order) => { setSelectedOrder(order);} }
                                        />;
                                    return (
                                        <tr key={i}>
                                            <td>{o.name}</td>
                                            <td>
                                                {character.lifePoints < 1
                                                    ? o.id !== _selectedOrder
                                                        ? checkBox
                                                        : undefined
                                                    : checkBox}
                                            </td>
                                        </tr>
                                    );
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        else if (_isMilitaryOrder) {
            return (
                <div className="panel">
                    <div className="header-small">MILITARY ORDER</div>
                    <div>
                        Your assigned Military Order is {MilitaryOrdersHelper.getOrder(_selectedOrder).name}.
                        Changing it will cost you a Life Point.
                    </div>
                    <div>
                        <table className="selection-list">
                            <tbody>
                                {MilitaryOrdersHelper.getOrders().map((o, i) => {
                                    const checkBox = <CheckBox
                                        isChecked={_selectedOrder === o.id}
                                        value={o.id}
                                        onChanged={(order) => { setSelectedOrder(order); } }
                                        />;
                                    return (
                                        <tr key={i}>
                                            <td>{o.name}</td>
                                            <td>
                                                {character.lifePoints < 1
                                                    ? o.id !== _selectedOrder
                                                        ? checkBox
                                                        : undefined
                                                    : checkBox}
                                            </td>
                                        </tr>
                                    );
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        else if (_isCatSquad) {
            return (
                <div className="panel">
                    <div className="header-small">'CAT SQUADS</div>
                    <div>
                        Your assigned 'Cat Squad is {CatSquadsHelper.getOrder(_selectedOrder).name}.
                        Changing it will cost you a Life Point.
                    </div>
                    <div>
                        <table className="selection-list">
                            <tbody>
                                {CatSquadsHelper.getOrders().map((o, i) => {
                                    const checkBox = <CheckBox
                                        isChecked={_selectedOrder === o.id}
                                        value={o.id}
                                        onChanged={(order) => { setSelectedOrder(order); }}
                                    />;
                                    return (
                                        <tr key={i}>
                                            <td>{o.name}</td>
                                            <td>
                                                {character.lifePoints < 1
                                                    ? o.id !== _selectedOrder
                                                        ? checkBox
                                                        : undefined
                                                    : checkBox}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        else {
            return undefined;
        }
    }

    const elective = _isHassassin
            ? HassassinOrdersHelper.getOrder(_selectedOrder).electiveSkills
            : _isMilitaryOrder
                ? MilitaryOrdersHelper.getOrder(_selectedOrder).electiveSkills
                : _isCatSquad
                    ? CatSquadsHelper.getOrder(_selectedOrder).electiveSkills
                    : career.elective;

    const equipment = drawEquipment(career.equipment);

    
    const attributes = character.careers.length === 1
        ? career.attributes.map((attr, i) => {
            return <AttributeView key={i} name={AttributesHelper.getAttributeName(i) } points={attr} value={character.attributes[i].value}/>
        })
        : undefined;

    const attributesContainer = character.careers.length === 1
            ? (
                <div className="panel">
                    <div className="header-small">ATTRIBUTES</div>
                    {attributes}
                </div>
              )
            : undefined;

    const mandatory = career.mandatory.map((m, i) => {
        return (
                <SkillImprovement key={i} skill={m} onDone={(done) => {setMandatoryDone(done); } } />
            )
        });

    const onTalentSelected = (talent: string) => {
            setSelectedTalent(talent);
        }

    const onSignatureSkillSelected = (skill: Skill) => {
            setSelectedSignatureSkill(skill);
        }

    const onEquipmentSelected = (eq: string, index: number) => {
            let holdingEquipment = _selectedEquipment
            holdingEquipment[index] = eq;
            setSelectedEquipment(holdingEquipment)
        }

    const onNext = () => {
            if (!_mandatoryDone) {
                Dialog.show("You have not distributed all mandatory skill points.");
                return;
            }
    
            if (!_electiveDone) {
                Dialog.show("You have not distributed all elective skill points.");
                return;
            }
    
            if (character.careers.length === 1 && _selectedSignatureSkill == null) {
                Dialog.show("You have not selected a signature skill.");
                return;
            }

            if (_selectedTalent === null || _selectedTalent.length === 0) {
                Dialog.show("You have not selected a talent.");
                return;
            }
    
            character.addTalent(_selectedTalent);
    
            if (_isHassassin) {
                character.hassassinOrder = _selectedOrder;
            }
            else if (_isMilitaryOrder) {
                character.militaryOrder = _selectedOrder;
            }
            else if (_isCatSquad) {
                character.earnings = CareersHelper.calculateEarnings(CatSquadsHelper.getOrder(_selectedOrder).earnings);
                character.catSquad = _selectedOrder;
            }
    
            if (_selectedOrder !== _order) {
                character.lifePoints--;
            }
    
            if (_showEquipment) {
                // Regular equipment is added in applyCareer.
                _selectedEquipment.forEach(eq => {
                    if (!EquipmentHelper.handleSpecialEquipment(eq)) {
                        character.addEquipment(eq);
                    }
                });
    
                // Hassassin orders get their own set of equipment.
                if (_isHassassin) {
                    const order = HassassinOrdersHelper.getOrder(character.hassassinOrder);
                    order.gear.forEach(eq => {
                        if (eq.indexOf('|') === -1) {
                            character.addEquipment(eq);
                        }
                    });
                }
                else if (_isMilitaryOrder) {
                    const order = MilitaryOrdersHelper.getOrder(character.militaryOrder);
                    order.gear.forEach(eq => {
                        if (eq.indexOf('|') === -1) {
                            character.addEquipment(eq);
                        }
                    });
                }
                else if (_isCatSquad) {
                    const order = CatSquadsHelper.getOrder(character.catSquad);
                    order.gear.forEach(eq => {
                        if (eq.indexOf('|') === -1) {
                            character.addEquipment(eq);
                        }
                    });
                }
            }
    
            Navigation.navigateToPage(character.getCareerPage(PageIdentity.CareerEvent1));
        }

    const signature = character.careers.length < 2
        ? (
            <div className="panel">
                <div className="header-small">SIGNATURE SKILL</div>
                <SignatureSkillSelection skills={_signatureSkills} onSelection={(skill) => onSignatureSkillSelected(skill) } />
            </div>
        )
        : undefined;


    const orders = drawOrderSelection();

    return (
        <div className="page">
            <PageHeader text="CAREER" />
            <div className="header-text">{career.name}</div>
            {orders}
            {attributesContainer}
            <div className="panel">
                <div className="header-small">MANDATORY SKILLS</div>
                {mandatory}
            </div>
            <div className="panel">
                <div className="header-small">ELECTIVE SKILLS</div>
                <ElectiveSkillImprovement skills={elective} points={2} onDone={(done) => { setElectiveDone(done); } } />
            </div>
            {signature}
            <div className="panel">
                <div className="header-small">TALENT</div>
                <TalentList skills={[...career.mandatory, ...career.elective]} onSelection={talent => onTalentSelected(talent)} selTal={_selectedTalent}/>
            </div>
            {equipment}
            <Button text="CAREER EVENT" className="button-next" onClick={() => onNext() }/>
        </div>
    );
}

export default CareerDetailsPage
