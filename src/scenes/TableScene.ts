import { GameObjects, Scene } from "phaser";
import { ILogic } from "../logic/ILogic";
import { IPlayer } from "../logic/IPlayer";
import { WareType } from "../logic/WareType";
import { getLogic } from "./data-registry/getLogic";
import { getPlayer } from "./data-registry/getPlayer";
import { headerIcon } from "./headerIcon";
import { KEYS, SVG_SIZE, wareViewConfig } from "./keys";
import { QuantityButton } from "./QuantityButton";
import { setDefaultTextStyle } from "./setDefaultTextStyle";
import { TextBuyPrice } from "./TextBuyPrice";
import { TextCityWareQuantity } from "./TextCityWareQuantity";
import { TextPlayerMoney } from "./TextPlayerMoney";
import { TextSellPrice } from "./TextSellPrice";

const WARE_ICON_SCALE = 50 / SVG_SIZE;
const HEADER_ICON_PX = 60;
const HEADER_ICON_SCALE = HEADER_ICON_PX / SVG_SIZE;
const BASE_Y = 0;
const BASE_X = 0;
const RIGHT = 640 - 40;
const CENTER = RIGHT / 2;
const PLAYER_MONEY_X = CENTER - HEADER_ICON_PX;
const PLAYER_MONEY_Y = 25;
const HEADER_Y = 50;
const FIRST_ROW_Y = HEADER_Y + 50;
const Y_SPACE_BETWEEN_ROWS = 60;
const COLUMN = {
    city: 50,
    sell: 150,
    ware: CENTER,
    buy: 400,
    player: 500,
};
const TRADED_QUANTITY_BUTTONS_X_CENTER = CENTER - 30;
const TRADED_QUANTITY_BUTTON_X_OFFSET = 100;
const TRADED_QUANTITY_BUTTONS_Y =
    FIRST_ROW_Y + Object.keys(WareType).length * 60;

export class TableScene extends Scene {
    private logic!: ILogic;
    private player!: IPlayer;
    private playerMoneyText!: TextPlayerMoney;
    private textBuyPrices: TextBuyPrice[] = [];
    private textSellPrices: TextSellPrice[] = [];
    private textCityWareQuantities: TextCityWareQuantity[] = [];
    private quantityButtons: QuantityButton[] = [];

    constructor() {
        super({
            key: KEYS.scenes.table,
        });
    }

    public create(): void {
        this.cameras.main.setPosition(BASE_X, BASE_Y);
        this.logic = getLogic(this);
        this.player = getPlayer(this);

        this.addBackground();
        this.addPlayerMoneyText(this.player);
        this.addTable();
    }

    public update() {
        const update = (x: { update(): void }) => x.update();
        this.playerMoneyText.update();
        this.textBuyPrices.forEach(update);
        this.textSellPrices.forEach(update);
        this.textCityWareQuantities.forEach(update);
        this.quantityButtons.forEach(update);
    }

    public setSelectedTradedQuantityButton(quantity: number) {
        const newSelected = this.quantityButtons.find(
            button => button.quantity === quantity
        );
        if (!newSelected) {
            throw new Error(
                `Cannot find TradedQuantityButton for given quantity: ${quantity}`
            );
        }
        this.quantityButtons.forEach(button => (button.selected = false));
        newSelected.selected = true;
    }

    private addPlayerMoneyText(player: IPlayer) {
        const moneybag = KEYS.svgs.moneybag;
        this.add
            .image(PLAYER_MONEY_X, PLAYER_MONEY_Y, moneybag.key)
            .setOrigin(0, 0.3)
            .setScale(HEADER_ICON_SCALE);
        this.playerMoneyText = new TextPlayerMoney(
            this,
            PLAYER_MONEY_X + HEADER_ICON_PX,
            PLAYER_MONEY_Y,
            "",
            {}
        );
        this.children.add(this.playerMoneyText);
        this.playerMoneyText.init(player);
    }

    private addTable() {
        this.addHeader();
        Object.values(WareType).forEach((ware, i) => {
            this.addRow(ware, FIRST_ROW_Y + i * Y_SPACE_BETWEEN_ROWS);
        });
        this.addQuantityButtons();
    }

    private addHeader() {
        headerIcon(
            this.add.image(COLUMN.city, HEADER_Y, KEYS.svgs.village.key)
        );
        headerIcon(this.add.image(COLUMN.player, HEADER_Y, KEYS.svgs.ship.key));
    }

    private addRow(ware: WareType, y: number) {
        const addTextAtY = this.addTableText(y);
        const icon = wareViewConfig[ware].image;
        this.add
            .image(COLUMN.ware, y, icon.key)
            .setOrigin(0.5, 0.2)
            .setScale(WARE_ICON_SCALE);
        this.addCityQuantityText(y, ware);
        this.addPlayerQuantityText(addTextAtY, ware);
        this.addBuyPrice(y, ware);
        this.addSellPrice(y, ware);
    }

    private addBuyPrice(y: number, ware: WareType) {
        const text = new TextBuyPrice(this, COLUMN.buy, y, "", {});
        this.textBuyPrices.push(text);
        this.children.add(text);
        text.init(this.logic, ware);
    }

    private addSellPrice(y: number, ware: WareType) {
        const text = new TextSellPrice(this, COLUMN.sell, y, "", {});
        this.textSellPrices.push(text);
        this.children.add(text);
        text.init(this.logic, ware);
    }

    private addCityQuantityText(y: number, ware: WareType) {
        const text = new TextCityWareQuantity(this, COLUMN.city, y, "", {});
        this.textCityWareQuantities.push(text);
        this.children.add(text);
        text.init(this.logic.city.get(ware));
    }

    private addPlayerQuantityText(
        addTextAtY: (x: number, text: string) => GameObjects.Text,
        ware: WareType
    ) {
        const playerQuantityText = addTextAtY(
            COLUMN.player,
            this.player
                .get(ware)
                .getQuantity()
                .toString()
        );
        this.player
            .get(ware)
            .getQuantity$()
            .subscribe(quantity =>
                playerQuantityText.setText(quantity.toString())
            );
    }

    private addTableText(y: number) {
        return (x: number, text: string) =>
            setDefaultTextStyle(this.add.text(x, y, text));
    }

    private addQuantityButtons() {
        this.addQuantityButton(-TRADED_QUANTITY_BUTTON_X_OFFSET, 1, true);
        this.addQuantityButton(0, 5);
        this.addQuantityButton(TRADED_QUANTITY_BUTTON_X_OFFSET, 10);
    }

    private addQuantityButton(
        xOffset: number,
        quantity: number,
        selected = false
    ) {
        const quantityButton = new QuantityButton(
            this,
            TRADED_QUANTITY_BUTTONS_X_CENTER + xOffset,
            TRADED_QUANTITY_BUTTONS_Y,
            quantity.toString(),
            {}
        );
        this.children.add(quantityButton);
        quantityButton.init(this.logic, quantity, selected);
        this.quantityButtons.push(quantityButton);
    }

    private addBackground() {
        this.add
            .image(0, 0, KEYS.images.parchment.key)
            .setOrigin(0)
            .setScale(1, 0.2 * Object.keys(WareType).length)
            .setAlpha(0.7);
    }
}
