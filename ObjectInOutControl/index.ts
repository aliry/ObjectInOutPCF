import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { MainContainer } from "./MainContainer";
import { StaticDataSchema, STATIC_DATA } from "./StaticData";

export class ObjectInOutControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _staticData: Partial<typeof STATIC_DATA> = {};
    private notifyOutputChanged: () => void;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void
    ): void {
        context.mode.trackContainerResize(true);
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const inputDataStr = context.parameters.InputData.raw;
        let inputData = {};
        if (inputDataStr) {
            try {
                inputData = JSON.parse(inputDataStr)
            }
            catch { // do nothing
            }
        }
        return React.createElement(MainContainer,
            {
                width: context.mode.allocatedWidth,
                height: context.mode.allocatedHeight,
                onLoadData: this.onLoadData,
                onClearData: this.onClearData,
                inputData
            }
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            StaticData: this._staticData
        };
    }

    public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> {
        return Promise.resolve({
            StaticData: StaticDataSchema
        });
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private onLoadData = async () => {
        this._staticData = STATIC_DATA;
        this._staticData.loadCounter = (this._staticData.loadCounter || 0) + 1;
        this.notifyOutputChanged();
    }

    private onClearData = () => {
        this._staticData = {};
        this.notifyOutputChanged();
    }
}
