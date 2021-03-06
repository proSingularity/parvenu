import { KEYS } from "./keys";
import { WareButton } from "./WareButton";

export class BuildFactoryButton extends WareButton {
    protected IMAGE_KEY = KEYS.images.buttonUpArrowRight;

    public update() {
        super.update();
        this.setText(`${this.logic.city.getBuildFactoryPrice(this.wareType)}`);
    }

    protected logicCallBackOnClick(): void {
        this.logic.buildFactory(this.wareType);
    }
}
