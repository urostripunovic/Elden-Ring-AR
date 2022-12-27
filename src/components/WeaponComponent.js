import React, { Component } from "react";
import WeaponsSearchComponent from "./WeaponSearchComponent";
import WeaponImageComponent from "./WeaponImageComponent";
import WeaponScalingComponent from "./WeaponScalingComponent";
import WeaponReqComponent from "./WeaponReqComponent";
import './WeaponsComponent.css';
import {
    safeFetchJson,
    weaponScalingValues,
    getWeaponGroupingId,
    groupingScalingValue,
    groupingReqValues,
    calcStatValue,
    groupingStatValues,
    addBaseDmgValues,
} from "../utils/utils";
import { calcAttack } from "../utils/calc";
import WeaponDmgComponent from "./WeaponDmgComponent";

class WeaponsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weapons: {},
            suggestions: [],
            currentWeapon: {},
            showResults: false,
            weaponInfo: {
                Str: { scaling: '-', amount: 0, reqMet: true },
                Dex: { scaling: '-', amount: 0, reqMet: true },
                Int: { scaling: '-', amount: 0, reqMet: true },
                Fai: { scaling: '-', amount: 0, reqMet: true },
                Arc: { scaling: '-', amount: 0, reqMet: true },
            },
        };
        this.autoComplete = this.autoComplete.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const tempWeapons = {};
        //Max limit is 100
        safeFetchJson("https://eldenring.fanapis.com/api/weapons?limit=100")
            .then(res => {
                res.data.forEach(e => tempWeapons[e.name] = e)
                //Object.values(tempWeapons).forEach(e => delete e.name) //No duplicate names
            })
            .then(() => {
                //First weapon pick scalings and req
                const scalingInfo = this.weaponConditions(tempWeapons, 'scalesWith', 'scaling', '-');
                const req = this.weaponConditions(tempWeapons, 'requiredAttributes', 'amount', 0);

                //Get id
                const id = getWeaponGroupingId(tempWeapons[Object.keys(tempWeapons)[0]].name, this.props.sheet.weaponIds)
                //Take out the weapon scaling values from google sheets
                const scalingValues = weaponScalingValues(tempWeapons[Object.keys(tempWeapons)[0]].name, this.props.sheet.scaling)
                //Group the values from scaling sheet with attackgroupings sheet
                const groupingWeaponScaling = groupingScalingValue(id, this.props.sheet.attackGroupings, scalingValues)
                //Group the values from those two with the req values
                const groupingReqsAndWeaponScaling = groupingReqValues(req, groupingWeaponScaling)
                //Calc the stat lvl values 
                const statValues = calcStatValue(tempWeapons[Object.keys(tempWeapons)[0]], this.props.currentClass)
                //Group the stat values with the rest
                const groupingWithStats = groupingStatValues(groupingReqsAndWeaponScaling, statValues);
                //Add the base dmg from the weapon for easier time calcing.
                const lastGrouping = addBaseDmgValues(tempWeapons[Object.keys(tempWeapons)[0]].attack, groupingWithStats)

                this.setState(
                    {
                        weapons: tempWeapons,
                        currentWeapon: {
                            ...tempWeapons[Object.keys(tempWeapons)[0]],
                            //Add the finished calced value
                            weaponCalcInfo: calcAttack(lastGrouping)
                        },
                        weaponInfo: { ...scalingInfo, ...req },
                    })
            });
    }

    /* Uppdatera reqMet för varje gång vi trycker på en ny klass i CharacterComponent men fixa intial först */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentClass !== this.props.currentClass) {
            const newObj = this.lvlReqChange(this.state.currentWeapon.requiredAttributes);
            const groupingReqsAndWeaponScaling = groupingReqValues(newObj, this.state.currentWeapon.weaponCalcInfo);
            const statValues = calcStatValue(this.state.currentWeapon, this.props.currentClass);
            const lastGrouping = groupingStatValues(groupingReqsAndWeaponScaling, statValues);

            this.setState({
                currentWeapon: { ...this.state.currentWeapon, weaponCalcInfo: calcAttack(lastGrouping) },
                weaponInfo: { ...newObj }
            })
        }
    }

    lvlReqChange(arr) {
        const newObj = { ...this.state.weaponInfo };
        typeof arr !== 'undefined' &&
            Object.keys(this.props.currentClass).map(stat =>
                arr.forEach(e => {
                    if (stat.toLowerCase().includes(e.name.toLowerCase()))
                        if (+this.props.currentClass[stat] < e.amount)
                            newObj[e.name].reqMet = false
                        else
                            newObj[e.name].reqMet = true
                })
            )
        return { ...newObj }
    }

    weaponConditions(any, weaponValue, stateValue, resetValue) {
        const newObj = { ...this.state.weaponInfo };
        Object.keys(newObj).map(e => newObj[e][stateValue] = resetValue)
        let toLoop;

        if (typeof any === 'object')
            toLoop = any[Object.keys(any)[0]][weaponValue]
        else if (typeof any === 'string')
            toLoop = this.state.weapons[any][weaponValue]

        toLoop.forEach(e => {
            if (e.name !== '-')
                newObj[e.name][stateValue] = e[stateValue]
        })

        const arr = [];
        Object.keys(newObj).map(e => arr.push({ name: e, amount: newObj[e].amount }))
        const reqMet = this.lvlReqChange(arr);

        return { ...newObj, ...reqMet }
    }

    autoComplete(event) {
        const suggestions = Object.keys(this.state.weapons).filter(e => e.toLowerCase().includes(event.target.value));
        this.setState(
            {
                suggestions: suggestions,
                showResults: event.target.value.length !== 0,
            });
    }

    handleClick(event) {
        //Standard Weaponpick
        const scaling = this.weaponConditions(event.target.id, 'scalesWith', 'scaling', '-');
        const req = this.weaponConditions(event.target.id, 'requiredAttributes', 'amount', 0);

        //top down approach to filling in the groupings, should've moved it to a class.
        const id = getWeaponGroupingId(event.target.id, this.props.sheet.weaponIds)
        const scalingValues = weaponScalingValues(event.target.id, this.props.sheet.scaling)
        const groupingWeaponScaling = groupingScalingValue(id, this.props.sheet.attackGroupings, scalingValues)
        const groupingReqsAndWeaponScaling = groupingReqValues(req, groupingWeaponScaling)
        const statValues = calcStatValue(this.state.weapons[event.target.id], this.props.currentClass)
        const groupingWithStats = groupingStatValues(groupingReqsAndWeaponScaling, statValues);
        const lastGrouping = addBaseDmgValues(this.state.weapons[event.target.id].attack, groupingWithStats)

        this.setState(
            {
                currentWeapon: {
                    ...this.state.weapons[event.target.id],
                    weaponCalcInfo: calcAttack(lastGrouping),
                },
                showResults: false,
                weaponInfo: { ...scaling, ...req, }
            },
            () => {
                document.getElementById("input").value = this.state.currentWeapon.name
            });
    }

    render() {
        return (
            <div className="WeaponContainer">
                <div>
                    <WeaponsSearchComponent autoComplete={this.autoComplete} handleClick={this.handleClick} state={this.state} />
                    <WeaponDmgComponent currentWeapon={this.state.currentWeapon} />
                    <WeaponScalingComponent weaponInfo={this.state.weaponInfo} />
                </div>
                <div>
                    <WeaponImageComponent currentWeapon={this.state.currentWeapon} />
                    <WeaponReqComponent weaponInfo={this.state.weaponInfo} />
                </div>
            </div>
        );
    }
}

export default WeaponsComponent;