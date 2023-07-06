'use strict'

const Fastify = require('fastify')
const t = require('tap')
const test = t.test

test('index.js', async t => {
  await t.test('registering succeeded', async t => {
    t.plan(1)

    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))
  
    // https://node-tap.org/docs/api/mocks/
    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({})
      }
    })
  
    await fastify.register(fastifyDrizzle)
  
    t.equal(typeof fastify.drizzle, 'object')
  })
  
  await t.test('registering with alias', async t => {
    t.plan(2)

    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))
  
    // https://node-tap.org/docs/api/mocks/
    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => ({})
      }
    })
  
    await fastify.register(fastifyDrizzle, {
      alias: 'foo'
    })
  
    t.equal(typeof fastify.foo, 'object')
    t.equal(typeof fastify.drizzle, 'undefined')
  })

  await t.test('registering failed', async t => {
    t.plan(1)

    const fastify = Fastify()
    t.teardown(fastify.close.bind(fastify))
  
    // https://node-tap.org/docs/api/mocks/
    const fastifyDrizzle = t.mock('..', {
      '../lib/utils/connector': {
        deriveConnector: () => { throw new Error() }
      }
    })
  
    t.rejects(() => fastify.register(fastifyDrizzle))
  })
})
