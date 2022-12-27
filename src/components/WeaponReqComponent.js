import React, { Component } from "react";
import './WeaponsComponent.css';

class WeaponReqComponent extends Component {
    render() {
        return (
            <div>
                <div className="leftContainerBottomTextStyle">
                    Attributes Required
                </div>
                {Object.keys(this.props.weaponInfo).map(stat =>
                    <div
                        key={stat}
                        className="contentText"
                    >
                        <span> {stat} </span>
                        <span
                            className={this.props.weaponInfo[stat].reqMet ? "normal--text" : "error--text"}
                        >
                            {this.props.weaponInfo[stat].amount}
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default WeaponReqComponent;