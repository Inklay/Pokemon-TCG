import { Lang } from '../structure/Lang'
import { InteractionReply } from '../structure/InteractionReply'
import { getUserHandler } from './userHandler'

/**
 * @function
 * 
 * Draws a serie in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The serie in a Discord embed message
 */
export function drawSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  return handler.drawSerie()
}

/**
 * @function
 * 
 * Draws the next serie in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The serie in a Discord embed message
 */
export function nextSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  handler.incSerieIdx()
  return handler.drawSerie()
}

/**
 * @function
 * 
 * Draws the previous serie in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The serie in a Discord embed message
 */
export function prevSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  handler.decSerieIdx()
  return handler.drawSerie()
}

/**
 * @function
 * 
 * Draws an expansion in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The expansion in a Discord embed message
 */
export function drawExpansion(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  return handler.drawExpansion()
}

/**
 * @function
 * 
 * Draws the next expansion in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The expansion in a Discord embed message
 */
export function nextExpansion(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  handler.incExpansionIdx()
  return handler.drawExpansion()
}

/**
 * @function
 * 
 * Draws the previous expansion in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The expansion in a Discord embed message
 */
export function prevExpansion(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  handler.decExpansionIdx()
  return handler.drawExpansion()
}

/**
 * @function
 * 
 * Opens a booster and draw a card in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The card in a Discord embed message
 */
 export function openBooster(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  return handler.openBooster()
}

/**
 * @function
 * 
 * Draw the card expansion in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The card in a Discord embed message
 */
export function nextCard(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  handler.incCardIdx()
  return handler.drawCard()
}

/**
 * @function
 * 
 * Draw the card expansion in a Discord embed message
 * 
 * @param {Lang} lang - The lang of the server
 * @param {string} id - The id of the user
 * @returns {InteractionReply} The card in a Discord embed message
 */
export function prevCard(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, 'BUYING')
  handler.decCardIdx()
  return handler.drawCard()
}
