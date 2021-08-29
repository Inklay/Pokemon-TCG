class global {
  commandError = ""
  doNotHavePermission = ""
  permissionMissing = ""
}

class lang {
  embed = new langEmbed()
}

class langEmbed {
  langList = ""
  french = ""
  english = ""
  langSet = ""
  langUpdated = ""
}

class help {
  labels = new helpLabels()
  embed = new helpEmbed()
}

class helpLabels {
  userCommands = ""
  adminCommands = ""
}

class helpEmbed {
  commandList = ""
  adminCommandList = ""
  viewCommandDescription = ""
  buyCommandDescription = ""
  moneyCommandDescription = ""
  languageCommandDescription = ""
  languageListCommandDescription = ""
  prefixCommandDescription = ""
  deleteMessageCommandDescription = ""
}

class Money {
  embed = new moneyEmbed()
}

class moneyEmbed {
  yourMoney = ""
  gotMoney = ""
  youHave = ""
  youHaveToWait = ""
  minutes = ""
}

export class Lang {
  global = new global()
  help = new help()
  lang = new lang()
  money = new Money()
}
