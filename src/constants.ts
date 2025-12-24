import { Side, ActingTeam, StepAction, type Map } from "@/models";

export const STEP_TIMEOUT_MS = 2_000;

export const MAP_POOL: Map[] = [
  {
    name: "Cliff",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Ensk",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Ghost Town",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Himmelsdorf",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Murovanka",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Pilsen",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Sand River",
    sideOptions: [Side.East, Side.West],
  },
  {
    name: "Siegfried Line",
    sideOptions: [Side.North, Side.South],
  },
  {
    name: "Westfield",
    sideOptions: [Side.East, Side.West],
  },
    {
    name: "Westfield2",
    sideOptions: [Side.East, Side.West],
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
