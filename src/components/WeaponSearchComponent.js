import React, { Component } from "react";
import './WeaponsComponent.css';

class WeaponsSearchComponent extends Component {
    render() {
        return (
            <div className="searchField">
                <div className="textStyle">
                    Weapon
                </div>
                <input
                    className="search"
                    id="input"
                    onChange={this.props.autoComplete}
                    type="search"
                    autoComplete="off"
                    spellCheck="false"
                    defaultValue={this.props.state.currentWeapon.name}
                />
                {this.props.state.showResults &&
                    <div className="scrollThing">
                        {this.props.state.suggestions.map(weapon => {
                            return (
                                <div
                                    className="item"
                                    key={weapon}
                                    id={weapon}
                                    onClick={this.props.handleClick}
                                >
                                    {weapon}
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        );
    }
}

export default WeaponsSearchComponent;