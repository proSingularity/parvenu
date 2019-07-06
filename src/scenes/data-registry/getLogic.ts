import { Data } from "phaser";
import { ILogic } from "../i-logic";
import { KEYS } from "../keys";

export const getLogic = (registryHolder: {
    registry: Data.DataManager;
}): ILogic => registryHolder.registry.get(KEYS.registry.logic);