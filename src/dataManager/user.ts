import fs from 'fs'
import { User } from '../structure/User'

export function update(user: User) {
  const rawData = fs.readFileSync('data/user.json').toString()
  const data = JSON.parse(rawData) as User[]
  const index = data.findIndex(u => u.id == user.id)
  if (index != -1) {
    data[index] = user
  } else {
    data.push(user)
  }
  fs.writeFileSync('data/user.json', JSON.stringify(data))
}

export function get(id: string) : User | undefined{
  const rawData = fs.readFileSync('data/user.json').toString()
  const data = JSON.parse(rawData) as User[]
  let user = data.find(u => u.id == id)
  return user
}

export function save(user: User) {
  const rawData = fs.readFileSync('data/user.json').toString()
  const data = JSON.parse(rawData) as User[]
  data.push(user)
  fs.writeFileSync('data/user.json', JSON.stringify(data))
}