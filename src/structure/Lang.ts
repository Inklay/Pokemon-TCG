interface global {
  commandError: string
  doNotHavePermission: string
  permissionMissing: string
  dir: string
  back: string
}

interface lang {
  langList: string
  french: string
  english: string
  langSet: string
  langUpdated: string
}

interface help {
  userCommands: string
  adminCommands: string
  commandList: string
  adminCommandList: string
  viewCommandDescription: string
  buyCommandDescription: string
  moneyCommandDescription: string
  languageCommandDescription: string
  languageListCommandDescription: string
  prefixCommandDescription: string
  deleteMessageCommandDescription: string
}

interface money {
  yourMoney: string
  gotMoney: string
  youHave: string
  youHaveToWait: string
  minutes: string
  dontHaveEnough: string
  notEnough: string
}

interface serie {
  selectSerie: string
  select: string
}

interface expansion {
  selectExpansion: string
  select: string
  costs: string
}

interface Card {
  openingOf: string
  new: string
  moreInfo: string
  soldFor: string
  soldAllFor: string
  duplicateSold: string
  noDuplicates: string
}

interface User {
  settingsUpdated: string
  autoSellSet: string
}

export interface Lang {
  global: global
  help: help
  lang: lang
  money: money
  serie: serie
  expansion: expansion
  card: Card
  user: User
}
