import { CardCount } from "./CardCount";

/**
 * @class CardList
 * 
 * The cards of a user
 * 
 * @property {CardCount[]} SWSH5 - The cards of SWSH5 expansion
 * @property {CardCount[]} SWSH45SV - The cards of SWSH45SV expansion
 * @property {CardCount[]} SWSH45 - The cards of SWSH45 expansion
 * @property {CardCount[]} SWSH4 - The cards of SWSH4 expansion
 * @property {CardCount[]} SWSH35 - The cards of SWSH35 expansion
 * @property {CardCount[]} SWSH3 - The cards of SWSH3 expansion
 * @property {CardCount[]} SWSH2 - The cards of SWSH2 expansion
 * @property {CardCount[]} SWSH1 - The cards of SWSH1 expansion
 */
export class CardList {
  [index: string] : CardCount[]
  public SWSH5: CardCount[] = []
  public SWSH45SV: CardCount[] = []
  public SWSH45: CardCount[] = []
  public SWSH4: CardCount[] = []
  public SWSH35: CardCount[] = []
  public SWSH3: CardCount[] = []
  public SWSH2: CardCount[] = []
  public SWSH1: CardCount[] = []
}

