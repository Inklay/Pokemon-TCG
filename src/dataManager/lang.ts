import fs from 'fs';

/**
 * @function setLang - Saves the language of a server
 * 
 * @param {string} language - The name of the language 
 * @param {string} id - The id of the server 
 * @param {string} type The type of the server (either guild or user)
 * @returns {void}
 */
export function setLang (language: string, id: string, type: string) : void {
  let found = false
  const rawData = fs.readFileSync('data/server.json').toString()
  let data = JSON.parse(rawData)
  for (let i in data.servers) {
    if (data.servers[i].id == id && data.servers[i].type == type) {
      data.servers[i].language = language
      found = true
    }
  }
  if (!found)
    data.servers.push({"id": id, "language": language, "type": type})
  const json = JSON.stringify(data)
  fs.writeFileSync('data/server.json', json)
}

/**
 * @function getLang - Gets the language of a server
 * 
 * @param {string} id - The id of the server 
 * @param {string} type The type of the server (either guild or user)
 * @returns {string} - The language of the server
 */
export function getLang (id: string, type: string) : string {
  const rawData = fs.readFileSync('data/server.json').toString()
  const data = JSON.parse(rawData)
  for (let i in data.servers) {
    if (data.servers[i].id == id && data.servers[i].type == type) {
      if (data.servers[i].language)
        return data.servers[i].language
      else
        return "en"
    }
  }
  return "en"
}
