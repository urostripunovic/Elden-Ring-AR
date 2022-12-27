import React, { Component } from "react";
import './WeaponsComponent.css';

class WeaponDmgComponent extends Component {
    render() {
        return (
            <div>
                <div className="leftContainerTextStyle">
                    Attack Power
                </div>
                {typeof this.props.currentWeapon.attack !== 'undefined' &&
                    this.props.currentWeapon.attack.filter(stat => stat.name !== 'Rng').map(type => {
                        return (
                            <div
                                key={type.name}
                            >
                                <div className="contentText">
                                    <span> {type.name} </span>
                                    <span>
                                        {(type.name !== 'Crit' && type.amount) > 0 ?
                                            type.amount +
                                            (this.props.currentWeapon.weaponCalcInfo[type.name].calc > 0 ?
                                                "+" + this.props.currentWeapon.weaponCalcInfo[type.name].calc :
                                                "" + this.props.currentWeapon.weaponCalcInfo[type.name].calc)
                                            : type.amount}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default WeaponDmgComponent;