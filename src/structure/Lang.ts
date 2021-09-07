interface global {
  commandError: string
  doNotHavePermission: string
  permissionMissing: string
  dir: string
}

interface lang {
  embed: langEmbed
}

interface langEmbed {
  langList: string
  french: string
  english: string
  langSet: string
  langUpdated: string
}

interface help {
  labels: helpLabels
  embed: helpEmbed
}

interface helpLabels {
  userCommands: string
  adminCommands: string
}

interface helpEmbed {
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
  embed: moneyEmbed
}

interface moneyEmbed {
  yourMoney: string
  gotMoney: string
  youHave: string
  youHaveToWait: string
  minutes: string
}

interface serie {
  selectSerie: string
  embed: serieEmbed
}

interface serieEmbed {
  next: string
  previous: string
}

export interface Lang {
  global: global
  help: help
  lang: lang
  money: money
  serie: serie
}
