import { Side, ActingTeam, StepAction, type WorldOfTanksMap } from "./models";

export const TANK_BAN_NAME = "Tank";

export const LIQUIPEDIA_BASE_URL = "https://liquipedia.net/worldoftanks/";
export const TOMATOGG_BASE_URL = "https://tomato.gg/stats/";

export const MAP_POOL: WorldOfTanksMap[] = [
  {
    name: "Cliff",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Ensk",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Ghost Town",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Himmelsdorf",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Murovanka",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Pilsen",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Sand River",
    sideOptions: [Side.East, Side.West],
    firstSide: undefined,
  },
  {
    name: "Tundra",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
  {
    name: "Ruinberg",
    sideOptions: [Side.North, Side.South],
    firstSide: undefined,
  },
];

export const PICK_BAN_CONFIGS = {
  BEST_OF_5: {
    steps: [
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.DECIDER, actingTeam: ActingTeam.DECIDER },
    ],
  },
  BEST_OF_7: {
    steps: [
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.DECIDER, actingTeam: ActingTeam.DECIDER },
    ],
  },
  BEST_OF_9: {
    steps: [
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_B },
      { action: StepAction.DECIDER, actingTeam: ActingTeam.DECIDER },
    ],
  },
  TEST: {
    steps: [
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.MAP_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.SIDE_PICK, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.BAN, actingTeam: ActingTeam.TEAM_A },
      { action: StepAction.DECIDER, actingTeam: ActingTeam.DECIDER },
    ],
  },
};
