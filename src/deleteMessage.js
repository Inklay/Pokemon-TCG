const fs = require('fs')

module.exports =
{
    change: function(id, type, language, channel)
    {
        rawData = fs.readFileSync('data/server.json')
        data = JSON.parse(rawData)
        found = false
        value = true
        for (i in data.servers)
        {
            if (data.servers[i].id == id && data.servers[i].type == type)
            {
                value = data.servers[i].delete_message = !data.servers[i].delete_message
                found = true
            }
        }
        if (!found)
        {
            data.servers.push({"id": id, "delete_message": false, "type": type})
            value = false
        }
        json = JSON.stringify(data)
        fs.writeFileSync('data/server.json', json)
        let enabled
        switch (language)
        {
            case "français":
                if (value)
                {
                    enabled = "activée"
                }
                else
                {
                    enabled = "désactivée"
                }
                channel.send(`La suppression des messages a été ${enabled}.`)
                break;
            case "english":
            default:
                if (value)
                {
                    enabled = "enabled"
                }
                else
                {
                    enabled = "disabled"
                }
                channel.send(`Message deletation was ${enabled}.`)
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
                if (data.servers[i].hasOwnProperty('delete_message'))
                {
                    return data.servers[i].delete_message
                }
                else
                {
                    return true
                }
            }
        }
    }
}