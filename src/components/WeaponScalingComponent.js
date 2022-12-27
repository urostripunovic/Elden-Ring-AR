import React, { Component } from "react";
import './WeaponsComponent.css';

class WeaponScalingComponent extends Component {
    render() {
        return (
            <div>
                <div className="leftContainerBottomTextStyle">
                    Attribute Scaling
                </div>
                {Object.keys(this.props.weaponInfo).map(stat =>
                    <div
                        key={stat}
                        className="contentText"
                    >
                        <span> {stat} </span>
                        <span> {this.props.weaponInfo[stat].scaling} </span>
                    </div>
                )}
            </div>
        );
    }
}

export default WeaponScalingComponent;