const _ = require('../../models')
const client = require('../../client/db')

async function syncModels() {
    await client.sync({ force: true })
    console.log('Models synced')
}

module.exports = syncModels