import { GameObjects } from "phaser";
import { WareType } from "../logic//WareType";
import { ICity } from "../logic/ICity";
import { ILogic as ILogicBase } from "../logic/ILogic";
import { getTradeButtonTweenConfig } from "./getTradeButtonTweenConfig";
import { KEYS } from "./keys";

interface ILogic extends Pick<ILogicBase, "store" | "take"> {
    city: Pick<ICity, "getBuyPrice">;
}

// TODO #102 extend a general GameObjects.GameObject?
// TODO #102 use for TextSellPrice and TextBuyPrice?
export abstract class WareButton extends GameObjects.Text {
    protected logic!: ILogic;
    protected wareType!: WareType;

    private button!: GameObjects.Image;

    public init(logic: ILogic, type: WareType) {
        this.logic = logic;
        this.wareType = type;

        this.addButton();
        this.addClickZone();
    }

    protected abstract logicCallBackOnClick(): void;

    private addClickZone() {
        // super random values although they should be equal to fillRoundedRect()
        const clickZone = this.scene.add.zone(this.x + 30, this.y + 20, 70, 50);
        clickZone.setInteractive();
        clickZone.on("pointerdown", () => this.onButtonClick());
    }

    private onButtonClick() {
        // TODO #106 only play sound / tween on successful buy
        this.logicCallBackOnClick();
        this.scene.sound.play(KEYS.sound.buy.key);
        this.scene.add.tween(getTradeButtonTweenConfig(this.button));
    }

    private addButton() {
        const buttonCfg = KEYS.images.buttonUpRect;
        this.button = this.scene.add
            .image(this.x + 29, this.y + 19, buttonCfg.key)
            .setScale(0.36);
    }
}
