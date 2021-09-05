abstract class global {
  abstract commandError: string
  abstract doNotHavePermission: string
  abstract permissionMissing: string
  abstract dir: string
}

abstract class lang {
  abstract embed: langEmbed
}

abstract class langEmbed {
  abstract langList: string
  abstract french: string
  abstract english: string
  abstract langSet: string
  abstract langUpdated: string
}

abstract class help {
  abstract labels: helpLabels
  abstract embed: helpEmbed
}

abstract class helpLabels {
  abstract userCommands: string
  abstract adminCommands: string
}

abstract class helpEmbed {
  abstract commandList: string
  abstract adminCommandList: string
  abstract viewCommandDescription: string
  abstract buyCommandDescription: string
  abstract moneyCommandDescription: string
  abstract languageCommandDescription: string
  abstract languageListCommandDescription: string
  abstract prefixCommandDescription: string
  abstract deleteMessageCommandDescription: string
}

abstract class money {
  abstract embed: moneyEmbed
}

abstract class moneyEmbed {
  abstract yourMoney: string
  abstract gotMoney: string
  abstract youHave: string
  abstract youHaveToWait: string
  abstract minutes: string
}

abstract class serie {
  abstract selectSerie: string
  abstract embed: serieEmbed
}

abstract class serieEmbed {
  abstract next: string
  abstract previous: string
}

export abstract class Lang {
  abstract global: global
  abstract help: help
  abstract lang: lang
  abstract money: money
  abstract serie: serie
}
