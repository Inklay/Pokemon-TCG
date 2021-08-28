class global {
  commandError = ""
}

class help {
  description = ""
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

export class Lang {
  global = new global()
  help = new help()
}