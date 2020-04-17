/**
 * The App container : displays loading when retrieving files then displays the container
 *
 * @author: Ga Jun Young, 16440714
 */

import React from 'react';
import Loader from "./views/Loader";
import LoadManager from "./utils/LoadManager";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Font} from "three";
import {DressageTest} from "./utils/types";
import Container from './views/Container';

const noviceSheet2012 = "./sample/novice_dressage_110_2012.json";
interface LoadState {
    loading: boolean,
    dressageSheet: DressageTest,
    horseGLTF: GLTF,
    font: Font,
}

export default class App extends React.Component {
    loadManager = new LoadManager();
    state: LoadState = {
        loading: true,
        dressageSheet: null,
        horseGLTF: null,
        font: null,
    };

    /**
     * When the component is set up, load files
     */
    componentDidMount(): void {
        // setup onLoad for loading manager
        this.loadManager.manager.onLoad = () => {
            this.setState({
                horseGLTF: this.loadManager.horseGLTF,
                font: this.loadManager.font
            });

            this.fetchDressageSheet();
        };

        // call methods to load specific objects
        this.loadManager.loadHorse();
        this.loadManager.loadFont();
    }

    /**
     * Fetches the dressage sheet
     */
    private fetchDressageSheet = () => {
        fetch(noviceSheet2012)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    dressageSheet: data,
                    loading: false
                })
            })
            .catch(error => {
                console.log("Dressage sheet cannot be read: " + error);
            });
    };

    /**
     * Render the components
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.state.loading) { return <Loader />; }

        // loaded content as props for our container
        const { dressageSheet, horseGLTF, font } = this.state;
        return <Container  dressageSheet={dressageSheet} horseGLTF={horseGLTF} font={font}/>
    }
}
