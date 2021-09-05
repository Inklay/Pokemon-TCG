import { Lang } from '../structure/Lang'
import { InteractionReply } from '../structure/InteractionReply'
import { getUserHandler } from './UserHandler'

export function drawSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id)
  return handler.drawSerie()
}

export function nextSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id)
  handler.incSerieIdx()
  return handler.drawSerie()
}

export function prevSerie(lang: Lang, id: string) : InteractionReply {
  const handler = getUserHandler(lang, id)
  handler.decSerieIdx()
  return handler.drawSerie()
}
