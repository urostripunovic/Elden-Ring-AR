import React, { Component } from "react";
import './CharacterComponent.css';

class CharacterLvlComponent extends Component {
    render() {
        return (
            <div>
                <div className="textStyle levelStyler borderRow">
                    <div id="text">
                        Level
                    </div>
                    <div className="lvlContainer">
                        {this.props.state.currentClass['level']}
                    </div>
                </div>

                {Object.keys(this.props.state.currentClass).filter(e => e !== 'level').map(stat =>
                    <div
                        key={stat}
                        className="statStyler"
                    >
                        <div className="textStyle">
                            {stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </div>
                        <div>
                            <input
                                className="inputStyle"
                                id={stat}
                                defaultValue={this.props.currentClass[stat]}
                                onKeyDown={this.props.inputLevel}
                                type="number"
                                name={stat}
                            />
                            <button
                                onClick={this.props.statIncrement}
                                name={stat}
                                value={1}
                                className="btn fa fa-arrow-circle-up"
                            />
                            <button
                                onClick={this.props.statIncrement}
                                name={stat}
                                value={-1}
                                className="btn fa fa-arrow-circle-down"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default CharacterLvlComponent