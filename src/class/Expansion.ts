import fs from 'fs'
import path from 'path'
import { LocalizedString } from './LocalizedString'
import { InteractionReply } from './InteractionReply'
import { CardViewerMode } from './CardViewer'
import { Lang } from './Lang'
import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { User } from './User'
import * as Config from '../config'

export class Expansion {
  name: LocalizedString = new LocalizedString()
  price: number = 0
  id: string = ''
  image: LocalizedString = new LocalizedString()
  cardsBaseImage: string = ''
  released: Boolean = false
  fixNumber: Boolean = false
  common: number[] = []
  uncommon: number[] = []
  rare: number[] = []
  ultraRare: number[] = []
  size: number = 0
  canGetSecret: Boolean = false
  secret: number[] = []
  expUrl: string = ''

  public static load(serieId: string) : Expansion[] {
    const filePath = path.join(__dirname, `../../cards/${serieId}.json`)
    const rawData = fs.readFileSync(filePath).toString()
    const data = JSON.parse(rawData) as Expansion[]
    const expansions: Expansion[] = []
    data.forEach(expansionData => {
      const expansion = new Expansion()
      expansions.push(Object.assign(expansion, expansionData))
      if (Config.isDebug) {
        expansion.validateCards()
      }
    })
    return expansions
  }

  private validateCards() {
    const cards = [
      ...this.common,
      ...this.uncommon,
      ...this.rare,
      ...this.ultraRare
    ]

    let missingCards = ''
    for (let i = 1; i < this.size + 1; i++) {
      if (!cards.find(x => x === i)) {
        missingCards += i + ' '
      }
    }
    if (missingCards.length !== 0) {
      console.log(`Expansion ${this.id} is missing those cards:\n${missingCards}`)
    }

    const duplicates = cards.filter((item, index) => cards.indexOf(item) !== index)
    if (duplicates.length > 0 && this.id !== 'SWSH45SV') {
      console.log(`Expansion ${this.id} has duplicate cards:\n${duplicates}`)
    }
  }

  public draw(lang: Lang, idx: number, max: number, mode: CardViewerMode, user: User, resellPrice: number) : InteractionReply {
    const canBuy = this.price <= user.money
    const buttons = this.createButton(lang, idx, max, mode, canBuy, user.favourite === this.id, user.cards[this.id]?.length > 0)
    const embed = new EmbedBuilder()
      .setTitle(this.name[lang.global.dir])
      .setFooter({text: `${idx + 1}/${max}`})
      .setAuthor({name: lang.expansion.selectExpansion})
      .setImage(this.image[lang.global.dir])
  
    let description = ''
    if (!canBuy && mode === 'BUYING') {
      description = `${lang.money.dontHaveEnough}\n`
    }
    if (mode === 'BUYING') {
      description += `${lang.expansion.costs} ${this.price}$\n${lang.global.youHave}: ${user.money}$`
    }
    if (resellPrice > 0) {
      description += `\n${lang.card.soldAllFor} ${resellPrice}$ !`
    }
  
    if (description.length > 0) {
      embed.setDescription(description)
    }
    return new InteractionReply(embed, buttons)
  }

  private createButton(lang: Lang, idx: number, max: number, mode: CardViewerMode, canBuy: boolean, isFavourite: boolean, hasCard: boolean) : ButtonBuilder[] {
    this.fixLink(lang)
    const buttons : ButtonBuilder[] = []

    buttons.push(new ButtonBuilder()
      .setCustomId('expansionPrev')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⬅️')
      .setDisabled(idx == 0)
    )

    buttons.push(new ButtonBuilder()
      .setCustomId('expansionNext')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('➡️')
      .setDisabled(idx + 1 === max)
    )

    if (mode == 'BUYING' && canBuy) {
      buttons.push(new ButtonBuilder()
        .setCustomId('expansionSelect')
        .setStyle(ButtonStyle.Success)
        .setLabel(lang.expansion.select)
        .setEmoji('✔️')
      )
    } else if (mode == 'VIEWING') {
      buttons.push(new ButtonBuilder()
        .setCustomId('expansionViewSelect')
        .setStyle(ButtonStyle.Success)
        .setLabel(lang.expansion.select)
        .setEmoji('✔️')
      )
    } else if (mode == 'TRADING') {
      buttons.push(new ButtonBuilder()
        .setCustomId('expansionTradeSelect')
        .setStyle(ButtonStyle.Success)
        .setLabel(lang.expansion.select)
        .setEmoji('✔️')
      )
    }

    buttons.push(new ButtonBuilder()
      .setCustomId('expansionBack')
      .setStyle(ButtonStyle.Danger)
      .setLabel(lang.global.back)
      .setEmoji('✖️')
    )

    if (mode == 'BUYING') {
      if (isFavourite) {
        buttons.push(new ButtonBuilder()
          .setCustomId('expansionUnsetFav')
          .setStyle(ButtonStyle.Secondary)
          .setLabel(lang.expansion.unsetFav)
          .setEmoji('🌟')
        )
      } else {
        buttons.push(new ButtonBuilder()
          .setCustomId('expansionSetFav')
          .setStyle(ButtonStyle.Secondary)
          .setLabel(lang.expansion.setFav)
          .setEmoji('🌟')
        )
      }
      if (hasCard) {
        buttons.push(new ButtonBuilder()
          .setCustomId('expansionView')
          .setStyle(ButtonStyle.Secondary)
          .setLabel(lang.expansion.viewCollection)
          .setEmoji('👀')
        )
      }
    }

    if ((mode == 'BUYING' && hasCard) || mode == 'VIEWING') {
      buttons.push(new ButtonBuilder()
        .setCustomId('expansionSell')
        .setStyle(ButtonStyle.Secondary)
        .setLabel(lang.card.sellAllDuplicate)
        .setEmoji('💰')
      )
    }

    buttons.push(new ButtonBuilder()
      .setURL(this.expUrl)
      .setStyle(ButtonStyle.Link)
      .setLabel(lang.expansion.info)
    )

    return buttons
  }

  private fixLink(lang: Lang) {
    switch (lang.global.dir) {
      case 'en':
        this.expUrl = this.expUrl.replace('<LANGUAGE>', 'en-us')
        break
      case 'fr':
        this.expUrl = this.expUrl.replace('<LANGUAGE>', 'fr-fr')
        break
    }
  }
}
