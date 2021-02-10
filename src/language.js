const fs = require('fs');

module.exports = {
    set: function(language, channel, id, type)
    {
        if (type == "guild")
            console.log("language.js: setting guild " + id + " language to " + language);
        else
            console.log("language.js: setting user " + id + " language to " + language);

        found = false;
        rawData = fs.readFileSync('data/server.json');
        data = JSON.parse(rawData);

        switch (language) {
            case "francais":
            case "français":
            case "fr":
                language = "français";
                break;
            case "en":
            case "english":
                language = "english";
                break;
            default:
                channel.send("English: unkown or unsupported language, type \'pokedex language list\' to view supported languages.\n"
                + "Français: langue inconnue ou non supportée, tapez \'pokedex language list'\ pour voir la liste des langues supportées.");
                return;
        }
        for (i in data.servers) {
            if (data.servers[i].id == id && data.servers[i].type == type) {
                data.servers[i].language = language;
                found = true;
            }
        }
        if (!found)
            data.servers.push({"id": id, "language": language, "type": type});
        json = JSON.stringify(data);
        fs.writeFileSync('data/server.json', json);

        if (type == "guild")
            console.log("language.js: guild " + id + " set it's language to " + language);
        else
            console.log("language.js: user " + id + " set it's language to " + language);

        switch (language) {
            case "français":
                channel.send("La langue a bien été définie.");
                break;
            case "english":
            default:
                channel.send("Language successfully set.");
                break;
        }
    },
    get: function(id, type)
    {
        rawData = fs.readFileSync('data/server.json');
        data = JSON.parse(rawData);
        for (i in data.servers) {
            if (data.servers[i].id == id && data.servers[i].type == type)
                return data.servers[i].language;
        }
        return null;
    },
    list: function(channel)
    {
        channel.send("Français (fr)\nEnglish (en)");
    }
};