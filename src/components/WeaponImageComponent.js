import React, { Component } from "react";
import './WeaponsComponent.css';

class WeaponImageComponent extends Component {
    render() {
        return (
            <div>
                <div className="WeaponLore">
                    <img
                        className="image"
                        alt="weapon"
                        src={this.props.currentWeapon.image}
                        title={this.props.currentWeapon.description}
                    />
                </div>
            </div>
        );
    }
}

export default WeaponImageComponent;