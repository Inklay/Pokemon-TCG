const fs = require('fs')

module.exports =
{
    set: function(id, type, prefix, language, channel)
    {
        rawData = fs.readFileSync('data/server.json')
        data = JSON.parse(rawData)
        found = false
        for (i in data.servers)
        {
            if (data.servers[i].id == id && data.servers[i].type == type)
            {
                data.servers[i].prefix = prefix
                found = true
            }
        }
        if (!found)
        {
            data.servers.push({"id": id, "prefix": prefix, "type": type})
        }
        json = JSON.stringify(data)
        fs.writeFileSync('data/server.json', json)
        switch (language)
        {
            case "français":
                channel.send(`Le préfix "${prefix}" a bien été défini`)
                break;
            case "english":
            default:
                channel.send(`Prefix "${prefix}" successfully set.`)
                break;
        }
    },
    get: function(id, type)
    {
        rawData = fs.readFileSync('data/server.json')
        data = JSON.parse(rawData)
        for (i in data.servers) {
            if (data.servers[i].id == id && data.servers[i].type == type)
            {
                if (data.servers[i].hasOwnProperty('prefix'))
                {
                    return data.servers[i].prefix
                }
                else
                {
                    return null
                }
            }
        }
    },
    show: function(prefix, language, channel)
    {
        switch (language)
        {
            case "français":
                if (prefix)
                    channel.send("Le préfix configuré pour ce serveur est: " + prefix)
                else
                    channel.send("Aucun préfix configuré pour ce serveur")
                break;
            case "english":
            default:
                if (prefix)
                    channel.send("The configured prefix for this guild is: " + prefix)
                else
                    channel.send("No configured prefix for this guild")
                break;
        }
    }
}