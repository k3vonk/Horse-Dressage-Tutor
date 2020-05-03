/**
 * The App component : displays loading when retrieving files then displays the container
 *
 * @author: Ga Jun Young, 16440714
 */

import React from 'react';
import LoadingPage from "./views/LoadingPage";
import LoadManager from "./utils/LoadManager";
import {Container} from "./views/Container";
import {DRESSAGE_SHEET_FILEPATHS} from "./utils/defined/Constants";
import {AppState} from "./utils/defined/StateInterfaces";

export default class App extends React.PureComponent<{}, AppState> {
    private loadManager: LoadManager;

    constructor(props) {
        super(props);

        this.state = {
            isPageLoading: true,
            dressageJsonSheets: [],
            horseFile: null,
            fontFile: null,
        };

        this.loadManager = new LoadManager();
    }

    /**
     * When the component is set up, load files and json sheets
     */
    componentDidMount(): void {
        // setup onLoad for loading manager
        this.loadManager.manager.onLoad = () => {
            this.setState({
                horseFile: this.loadManager.horseGLTF,
                fontFile: this.loadManager.font
            });

            this.fetchJsonDressageSheets();
        };

        // call methods to load specific ThreeJS objects
        this.loadManager.loadHorse();
        this.loadManager.loadFont();
    }

    /**
     * Fetches the Json dressage sheets
     */
    private fetchJsonDressageSheets = () => {
        for(let i = 0; i < DRESSAGE_SHEET_FILEPATHS.length; i++) { // iterate through all available dressage files...
            fetch(DRESSAGE_SHEET_FILEPATHS[i])
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        dressageJsonSheets: [...this.state.dressageJsonSheets, data] // append new json data to the array
                    });

                    if(i === DRESSAGE_SHEET_FILEPATHS.length - 1) {
                        this.setState({
                            isPageLoading: false
                        });
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
        if (this.state.isPageLoading) { return <LoadingPage />; }

        return <Container {...this.state}/>
    }
}
