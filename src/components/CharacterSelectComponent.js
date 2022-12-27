import React, { Component } from "react";
import './CharacterComponent.css';

class CharacterSelectComponent extends Component {
    render() {
        return (
            <div>
                {/*Select options*/}
                <div>
                    <div className="textStyle">
                        Starting Class
                    </div>
                    <select
                        className="selectStyle"
                        onChange={this.props.classChange}
                    >
                        {Object.keys(this.props.state.classes).map(className =>
                            <option
                                className="optionStyle"
                                key={className}
                                value={className}
                            >
                                {className}
                            </option>
                        )}
                    </select>
                </div>
            </div>
        );
    }
}

export default CharacterSelectComponent;