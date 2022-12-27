import React, { Component } from 'react';
import './DisplayComponent.css';
import CharacterComponent from './CharacterComponent';
import WeaponsComponent from './WeaponComponent';
import { loadSheet } from '../utils/utils';

class DisplayComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentClass: {},
            sheet: { scaling: [], weaponIds: [], attackGroupings: [] },
            loaded: false,
        };
        this.updateCurrentClassStats = this.updateCurrentClassStats.bind(this);
    }

    componentDidMount() {
        Promise.all([loadSheet('Scaling'), loadSheet('CalcCorrectGraph_ID'), loadSheet('AttackElementCorrectParam')])
            .then(([scalings, ids, groupings]) => this.setState(
                {
                    sheet: {
                        scaling: scalings,
                        weaponIds: ids,
                        attackGroupings: groupings,
                    },
                    loaded: true,
                })
            );
    }

    updateCurrentClassStats(value) {
        this.setState({ currentClass: value })
    }

    render() {
        return (
            <div className='mainContainer'>
                <div className='borderShadow'>
                    <CharacterComponent currentClass={this.state.currentClass} handler={this.updateCurrentClassStats} />
                    {this.state.loaded && <WeaponsComponent currentClass={this.state.currentClass} sheet={this.state.sheet} />}
                </div>
            </div>
        );
    }
}

export default DisplayComponent;