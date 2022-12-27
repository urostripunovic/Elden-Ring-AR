import React, { Component } from "react";
import './CharacterComponent.css';
import CharacterSelectComponent from "./CharacterSelectComponent";
import { safeFetchJson } from "../utils/utils";
import CharacterLvlComponent from "./CharacterLvlComponent";

class CharacterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: {},
            currentClass: {},
            initClass: {},
        };

        this.classChange = this.classChange.bind(this);
        this.statIncrement = this.statIncrement.bind(this);
        this.inputLevel = this.inputLevel.bind(this);
    }

    componentDidMount() {
        const tempClasses = {};
        safeFetchJson("https://eldenring.fanapis.com/api/classes")
            .then(res =>
                res.data.filter(e => e.name !== 'Champion' && e.name !== 'Bloody Wolf' && e.name !== 'Enchanted Knight')
                    .map(e => tempClasses[e.name] = e.stats))
            .then(() => {
                this.setState({
                    classes: tempClasses,
                    currentClass: tempClasses[Object.keys(tempClasses)[0]],
                    initClass: tempClasses[Object.keys(tempClasses)[0]]
                }, () => this.props.handler(this.state.currentClass));

            });
    }

    //componentDidUpdate(prevProps, prevState) {}


    classChange(event) {
        this.setState({
            currentClass: this.state.classes[event.target.value],
            initClass: this.state.classes[event.target.value]
        }, () => {
            this.props.handler(this.state.currentClass)
            Object.keys(this.props.currentClass).forEach(element => {
                if (document.getElementById(element) !== null)
                    document.getElementById(element).value = this.state.currentClass[element]
            })
        });
    }

    statIncrement(event) {
        if (+this.state.currentClass[event.target.name] + +event.target.value < this.state.initClass[event.target.name]) return;
        if (+this.state.currentClass[event.target.name] + +event.target.value > 99) return;

        this.setState(prevState => ({
            currentClass: {
                ...prevState.currentClass,
                level: +prevState.currentClass['level'] + +event.target.value,
                [event.target.name]: +prevState.currentClass[event.target.name] + +event.target.value,
            },
        }), () => {
            this.props.handler(this.state.currentClass)
            document.getElementById(event.target.name).value = this.state.currentClass[event.target.name]
        });
    }

    inputLevel(event) {
        if (event.key === 'Enter') {
            if (+event.target.value < this.state.initClass[event.target.name]) {
                this.setState(prevState => ({
                    currentClass: {
                        ...prevState.currentClass,
                        level: +this.state.initClass['level'],
                        [event.target.name]: +this.state.initClass[event.target.name],
                    }
                }), () => {
                    event.target.value = this.state.initClass[event.target.name]
                    this.props.handler(this.state.currentClass) 
                });

            } else if (+event.target.value > 99) {
                this.setState(prevState => ({
                    currentClass: {
                        ...prevState.currentClass,
                        level: +prevState.currentClass['level'] + (99 - +prevState.currentClass[event.target.name]),
                        [event.target.name]: 99,
                    }
                }), () => {
                    event.target.value = 99 
                    this.props.handler(this.state.currentClass)
                });

            } else {
                this.setState(prevState => ({
                    currentClass: {
                        ...prevState.currentClass,
                        level: +prevState.currentClass['level'] + (+event.target.value - +prevState.currentClass[event.target.name]),
                        [event.target.name]: +event.target.value,
                    },
                }), () => this.props.handler(this.state.currentClass));
            }
        }
    }

    render() {
        return (
            <div className="CharacterContainer">
                <CharacterSelectComponent classChange={this.classChange} state={this.state} />
                <CharacterLvlComponent
                    currentClass={this.props.currentClass}
                    state={this.state}
                    inputLevel={this.inputLevel}
                    statIncrement={this.statIncrement}
                />
            </div>
        );
    }
}

export default CharacterComponent;