import type { Client, Collection, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { PICK_BAN_CONFIGS } from "./constants";

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  pickBanStates: Collection<string, PickBanState>;
}

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface TeamData {
  roleId: string;
  captainId: string;
  memberIds: string[];
}

export enum StepAction {
  MAP_PICK = "Map Pick",
  SIDE_PICK = "Side Pick",
  BAN = "Ban",
  DECIDER = "Decider",
}

export enum Side {
  North = "North",
  South = "South",
  East = "East",
  West = "West",
}

export enum ActingTeam {
  TEAM_A = "TEAM_A",
  TEAM_B = "TEAM_B",
  DECIDER = "DECIDER",
}

export interface WorldOfTanksMap {
  name: string;
  sideOptions: Side[];
  firstSide: Side | undefined;
}

export interface PickBanConfig {
  timePerAction: number;
  actions: PickBanAction[];
}

export interface PickBanAction {
  action: StepAction;
  actingTeam: ActingTeam;
}

export interface PickBanState {
  teamARoleId: string;
  teamBRoleId: string;
  teamACaptainId: string;
  teamBCaptainId: string;
  log: string[];
  isProcessing: boolean;

  timePerAction: number;
  channelId: string;
  configKey: keyof typeof PICK_BAN_CONFIGS;
  currentStepIndex: number;
  bannedMaps: WorldOfTanksMap[];
  pickedMaps: WorldOfTanksMap[];
  availableMaps: WorldOfTanksMap[];

  messageId: string | null;
  timeoutId: NodeJS.Timeout | null;
}
