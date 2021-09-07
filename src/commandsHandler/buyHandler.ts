import { Lang } from '../structure/Lang'
import { InteractionReply } from '../structure/InteractionReply'
import { getUserHandler, userHandlerMode } from './userHandler'

export function drawSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, userHandlerMode.BUYING)
  return handler.drawSerie()
}

export function nextSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, userHandlerMode.BUYING)
  handler.incSerieIdx()
  return handler.drawSerie()
}

export function prevSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, userHandlerMode.BUYING)
  handler.decSerieIdx()
  return handler.drawSerie()
}

export function drawExpansion(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, userHandlerMode.BUYING)
  return handler.drawExpansion()
}

export function nextExpansion(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, userHandlerMode.BUYING)
  handler.incExpansionIdx()
  return handler.drawExpansion()
}

export function prevExpansion(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id, userHandlerMode.BUYING)
  handler.decExpansionIdx()
  return handler.drawExpansion()
}
