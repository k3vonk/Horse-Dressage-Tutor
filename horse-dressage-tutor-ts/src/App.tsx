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
import {Container} from "./views/Container";

const DRESSAGE_SHEETS =["./sample/novice_dressage_110_2012.json",
    "./sample/ipc_novice_dressage_championship_2017.json",
    "./sample/airc_novice_dressage_22_2020.json"];

interface LoadState {
    loading: boolean,
    dressageSheets: DressageTest[],
    horseGLTF: GLTF,
    font: Font,
}

export default class App extends React.PureComponent {
    private loadManager = new LoadManager();
    state: LoadState = {
        loading: true,
        dressageSheets: [],
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
     * Fetches the dressage sheets
     */
    private fetchDressageSheet = () => {
        for(let i = 0; i < DRESSAGE_SHEETS.length; i++) {
            fetch(DRESSAGE_SHEETS[i])
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        dressageSheets: [...this.state.dressageSheets, data]
                    });

                    if(i === DRESSAGE_SHEETS.length - 1) {
                        this.setState({loading: false})
                    }
                })
                .catch(error => {
                    console.log("Dressage sheet cannot be read: " + error);
                });
        }
    };

    /**
     * Render the components
     */
    render(): React.ReactElement| string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        if (this.state.loading) { return <Loader />; }

        // loaded content as props for our container
        const { dressageSheets, horseGLTF, font } = this.state;
        console.log(dressageSheets);
        return <Container dressageSheets={dressageSheets} horseGLTF={horseGLTF} font={font}/>
    }
}
