'use stric'
const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const metricFixture = require('./fixtures/metric')

const single = metricFixture.singleMetric
const uuid= single.uuid
const type = single.type
const responseUuid = metricFixture.byUuid(uuid)
const newMetric = {
    id: 1,
    type: 'memory',
    value: '705',
    uuid:'xxx',
    createdAt: new Date(),
    updatedAt: new Date()
}


const agent = {
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


const AgentStub = {
    hasMany: sinon.spy(),
    findOne: sinon.stub()
}
AgentStub.findOne.withArgs({where:{uuid:single.uuid}}).returns(Promise.resolve(agent))

const findByAgentUuidArgs = { 
    attributes: ['type'],
    group: ['type'],
    include: [{
                attributes: [],
                model: AgentStub,
                where: {
                    uuid:single.uuid
                }
            }],
    raw: true
}

const findByTypeAgentUuidArgs = {
    attributes: ['id', 'type', 'value', 'createdAt'],
    where: {
      type
    },
    limit: 20,
    order: [['createdAt', 'DESC']],
    include: [{
      attributes: ['uuid'],
      model: AgentStub,
      where: {
        uuid:single.uuid
      },
      raw: true
    }]
  }

let config = {
    logging : function(){}
}



let MetricStub = null
let db = null
let sandbox = null

test.beforeEach( async () =>{
    sandbox = sinon.sandbox.create()
    MetricStub ={
        belongsTo: sinon.sandbox.spy(),
        create: sinon.sandbox.stub(),
        findAll: sinon.sandbox.stub(),
    }

    MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
        // result.toJSON en lib/agent.js
        toJSON () { return newMetric }
      }))
    

    MetricStub.findAll.withArgs(findByAgentUuidArgs).returns(Promise.resolve(responseUuid))
    MetricStub.findAll.withArgs(findByTypeAgentUuidArgs).returns(Promise.resolve(metricFixture.byTypeAgentUuid(type,uuid)))

    const setupDataBase = proxyquire('../',{
        './models/agent':() => AgentStub,
        './models/metric':() =>MetricStub,
    })

    db = await setupDataBase(config)

})

test.afterEach(()=>{
    sandbox && sinon.sandbox.restore()
})

test('Metric', t =>{
    t.truthy(db.Metric,'Metric Model Should exist')
})

test.serial('Setup#Metric',t =>{
    t.true(AgentStub.hasMany.called,'Should be called')
    t.true(MetricStub.belongsTo.called,'Should be called')
    t.true(AgentStub.hasMany.calledOnce,'Should be called once')
    t.true(MetricStub.belongsTo.calledOnce,'Should be called once')
    t.true(AgentStub.hasMany.calledWith(MetricStub),'Should be called with MetricModel')
    t.true(MetricStub.belongsTo.calledWith(AgentStub),'Should be called with AgentModel')
})

test.serial('Metric#Create', async t =>{
    let  response = await db.Metric.create('xxx',newMetric)
    
    t.true(AgentStub.findOne.called,'Should be called')
    t.true(AgentStub.findOne.calledOnce,'Should be calledOnce')
    t.true(AgentStub.findOne.calledWith({where:{uuid:agent.uuid}}),'Should be called')
    t.true(MetricStub.create.called,'Should be called')
    t.true(MetricStub.create.calledOnce,'Should be called once')
    t.true(MetricStub.create.calledWith(newMetric),'Should be called with new metric')
    t.deepEqual(response,newMetric,'Response and single should be the same')

})

test.serial('Metric#findAll ---findByAgentUuid',async t =>{
    let response = await db.Metric.findByAgentUuid(uuid)
    t.true(MetricStub.findAll.called,'Shoul be called ')
    t.true(MetricStub.findAll.calledOnce,'Should be called once')
    t.true(MetricStub.findAll.calledWith(findByAgentUuidArgs),'Should be caller with findByAgentUuidArgs ')
    t.is(response.length,metricFixture.byUuid(uuid).length,'Should have same length' )
    t.deepEqual(response,metricFixture.byUuid(uuid),'Should be equal')
})

test.serial('Metric#findAll ---findByTypeAgentUuid',async t =>{
    let response = await db.Metric.findByTypeAgentUuid(type,uuid)
    t.true(MetricStub.findAll.called,'Shoul be called ')
    t.true(MetricStub.findAll.calledOnce,'Should be called once')
    t.true(MetricStub.findAll.calledWith(findByTypeAgentUuidArgs),'Should be caller with findByAgentUuidArgs ')
    t.is(response.length,metricFixture.byTypeAgentUuid(type,uuid).length,'Should have same length' )
    t.deepEqual(response,metricFixture.byTypeAgentUuid(type,uuid),'Should be equal')
})
