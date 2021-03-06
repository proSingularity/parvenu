import { Data } from "phaser";
import { ICity } from "../../logic/ICity";
import { KEYS } from "../keys";

export const getCities = (scene: { registry: Data.DataManager }): ICity[] =>
    scene.registry.get(KEYS.registry.cities) as ICity[];
