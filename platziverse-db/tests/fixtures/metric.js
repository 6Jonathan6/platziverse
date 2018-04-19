'use stric'

const metric = {
    id: 1,
    type: 'memory',
    value: '705',
    uuid:'xxx',
    createdAt: new Date(),
    updatedAt: new Date()
}

const agent ={
    id: 1,
    uuid: 'xxx',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const metrics = [
    metric,
    extendModel(metric,{id: 2,type:'memory',value:'350',uuid:'xxx'}),
    extendModel(metric,{id: 3,type:'memory',value:'200',uuid:'yyy'}),
    extendModel(metric,{id: 4,type:'memory',value:'300',uuid:'zzz'}),
    extendModel(metric,{id: 5, type:'cpu',value:'100',uuid:'xxx'}),
    extendModel(metric,{id: 6,type:'cpu',value:'400',uuid:'yyy'}),
    extendModel(metric,{id: 7,type:'cpu',value:'250',uuid:'zzz'}),
    
]

const agents = [
    agent,
    extendModel(agent,{id: 2,uuid:'yyy',connected:true}),
    extendModel(agent,{id: 3,uuid:'xxx',connected:true}),
    extendModel(agent,{id: 4,uuid:'zzz',connected:true}),
]

function extendModel(model,values){
    const clone = Object.assign({},model)
    return Object.assign(clone,values)

}

module.exports = {
    singleMetric : metric,
    byUuid:uuid =>{ 
        let results = metrics.filter(obj => obj.uuid === uuid)
        let types = new Set()
        results.forEach(result => types.add(result.type) )
        let list = []
        types.forEach(type => list.push( { type: type } ))
        return list
    },

    byTypeAgentUuid:(type, uuid) =>{
        let results = metrics.filter(m => m.type === type && m.uuid === uuid)
        return results.sort((a,b) => a.createdAt - b.createdAt)
    }
}