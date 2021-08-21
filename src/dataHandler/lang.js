const fs = require('fs')

module.exports =
{
    set: function(language, channel, id, type)
    {
        console.log(`language.js: setting ${type} ${id} language to ${language}`)
        let found = false
        const rawData = fs.readFileSync('data/server.json')
        let data = JSON.parse(rawData)
        switch (language)
        {
            case 'francais':
            case 'français':
            case 'fr':
                language = 'fr'
                break
            case 'en':
            case 'english':
                language = 'en'
                break
            default:
                channel.send('English: unkown or unsupported language, type \'pokedex language list\' to view supported languages.\n'
                + 'Français: langue inconnue ou non supportée, tapez \'pokedex language list\' pour voir la liste des langues supportées.')
                return
        }
        for (let i in data.servers)
        {
            if (data.servers[i].id == id && data.servers[i].type == type)
            {
                data.servers[i].language = language
                found = true
            }
        }
        if (!found)
        {
            data.servers.push({"id": id, "language": language, "type": type})
        }
        const json = JSON.stringify(data)
        fs.writeFileSync('data/server.json', json)
        console.log(`language.js: ${type} ${id} set it's language to ${language}`)
        switch (language)
        {
            case "français":
                channel.send("La langue a bien été définie.")
                break;
            case "english":
            default:
                channel.send("Language successfully set.")
                break;
        }
    },
    get: function(id, type)
    {
        const rawData = fs.readFileSync('data/server.json')
        const data = JSON.parse(rawData)
        for (let i in data.servers)
        {
            if (data.servers[i].id == id && data.servers[i].type == type) 
            {
               if (data.servers[i].language) {
                    return data.servers[i].language
                } else {
                    return "en"
                }
            }
        }
        return "en"
    },
    list: function(channel)
    {
        channel.send("Français (fr)\nEnglish (en)")
    }
};