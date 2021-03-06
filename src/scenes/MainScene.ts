import { difference } from "lodash";
import { Scene, Types } from "phaser";
import { CityName } from "../logic/CityName";
import { ILogicEvent } from "../logic/events/ILogicEvent";
import { IObservable } from "../logic/events/IObservable";
import { IObserver } from "../logic/events/IObserver";
import { LogicEvent } from "../logic/events/LogicEvents";
import { ICity } from "../logic/ICity";
import { ILogic } from "../logic/ILogic";
import { IMainSceneParams } from "../logic/IMainSceneParams";
import { logicConfig } from "../logic/Logic.config";
import { LogicBuilder } from "../logic/LogicBuilder";
import { CitySelectionScene } from "./CitySelectionScene";
import { getCities } from "./data-registry/getCities";
import { getLogic } from "./data-registry/getLogic";
import { FactoryScene } from "./FactoryScene";
import { cityViewConfig, KEYS } from "./keys";
import { TableScene } from "./TableScene";
import { WarehouseScene } from "./WarehouseScene";

export class MainScene extends Scene implements IObserver {
    private logic!: ILogic & IObservable;
    private cities!: ICity[];
    private childScenes: Scene[] = [this];

    constructor() {
        super({
            key: KEYS.scenes.main,
        });
    }

    public create(): void {
        const logicObjects = LogicBuilder.create();
        this.setRegistry(logicObjects);

        this.logic = getLogic(this);
        this.cities = getCities(this);
        this.logic.register(this);

        this.addBackgroundMusic();
        this.addBackground(this.logic.city.name);
        this.addScene(KEYS.scenes.citySelection, CitySelectionScene);
        this.addScene(KEYS.scenes.table, TableScene);
        this.addScene(KEYS.scenes.warehouse, WarehouseScene);
        this.addScene(KEYS.scenes.factory, FactoryScene);

        this.time.addEvent(this.getHandleNextTimeEvent());
        this.events.on(KEYS.events.cityChanged, () => this.handleCityChanged());

        // TODO #78 REMOVE debug shortcut
        this.input.keyboard.on("keydown-G", () => this.gotoGameOver());
    }

    public onLogicEvent(event: ILogicEvent) {
        if (event.name === LogicEvent.CitySet) {
            // transform to phaser event and notify all childs incl. itself
            this.childScenes.forEach(scene =>
                scene.events.emit(KEYS.events.cityChanged, {
                    city: this.logic.city,
                })
            );
        }
    }

    private getHandleNextTimeEvent(): Types.Time.TimerEventConfig {
        return {
            callback: () =>
                this.cities.forEach(city => city.consumeAndProduce()),
            delay: logicConfig.cityConsumeTime,
            loop: true,
        };
    }

    private addScene(
        key: string,
        sceneConfig:
            | Scene
            // tslint:disable: ban-types
            | Function
            | Types.Scenes.SettingsConfig
            | Types.Scenes.CreateSceneFromObjectConfig
    ) {
        const scene = this.scene.add(key, sceneConfig, true);
        this.childScenes.push(scene);
    }

    private handleCityChanged() {
        this.addBackground(this.logic.city.name);
    }

    private gotoGameOver() {
        this.sound.stopAll();
        const trueChildScenes = difference(this.childScenes, [this]);
        trueChildScenes.forEach(scene => this.scene.remove(scene));
        this.scene.start(KEYS.scenes.gameOver);
    }

    private setRegistry(logicObjects: IMainSceneParams) {
        this.registry.set(KEYS.registry.logic, logicObjects.logic);
        this.registry.set(KEYS.registry.cities, logicObjects.cities);
        this.registry.set(KEYS.registry.player, logicObjects.player);
    }

    private addBackgroundMusic() {
        this.sound
            .add(KEYS.sound.backgroundMusic.key)
            .play("", { volume: 0.3, loop: true });
    }

    private addBackground(name: CityName) {
        const image = cityViewConfig[name].backgroundImage;
        this.add
            .image(0, 0, image.key)
            .setOrigin(0)
            .setScale(
                this.scale.width / image.width,
                this.scale.height / image.height
            );
    }
}
