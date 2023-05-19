import { PlayerLevel } from "../constants/playerLevel";
import { NextRouter } from "next/router";

export const setPlayersLevelToQuery = async (level: PlayerLevel, router: NextRouter) => {
    await router.push({ pathname: router.pathname, query: {level}});
}