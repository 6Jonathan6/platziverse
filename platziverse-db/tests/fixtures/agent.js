'use stric'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createAt: new Date(),
  updatedAt: new Date()
}
const agents = [
  agent,
  extend(agent, {id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test'}),
  extend(agent, {id: 3, uuid: 'yyy-yyy-yyx', connected: true, username: 'test2'}),
  extend(agent, {id: 4, uuid: 'yyy-yyy-yyz', connected: false, username: 'test3'})

]

// Funcion para crear agentes mas rapido
function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

// creamos algunos querys
module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === 'platzi'),
  byUuid: uuid => agents.filter(a => a.uuid === uuid).shift(),
  byId: id => agents.filter(a => a.id === id)
}
