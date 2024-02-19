const t = require('tap')
const sinon = require('sinon')
const crypto = require('crypto')

const DotenvKeys = require('../../../src/lib/helpers/dotenvKeys')

t.test('#run (.env and no .env.keys yet)', ct => {
  const randomBytesStub = sinon.stub(crypto, 'randomBytes')
  const fakeRandomValue = 'ac300a21c59058c422c18dba8dc9892a537a63e156af14b5c5ef14810dc71f20'
  randomBytesStub.returns(Buffer.from(fakeRandomValue, 'hex'))

  const envFilepaths = ['.env']
  const dotenvKeys = {}

  const { envKeys, addedKeys, existingKeys } = new DotenvKeys(envFilepaths, dotenvKeys).run()

  const expectedEnvKeys = `#/!!!!!!!!!!!!!!!!!!!.env.keys!!!!!!!!!!!!!!!!!!!!!!/
#/   DOTENV_KEYs. DO NOT commit to source control   /
#/   [how it works](https://dotenvx.com/env-keys)   /
#/--------------------------------------------------/
DOTENV_KEY_DEVELOPMENT="dotenv://:key_ac300a21c59058c422c18dba8dc9892a537a63e156af14b5c5ef14810dc71f20@dotenvx.com/vault/.env.vault?environment=development"
`

  ct.same(envKeys, expectedEnvKeys)
  ct.same(addedKeys, ['DOTENV_KEY_DEVELOPMENT'])
  ct.same(existingKeys, [])

  randomBytesStub.restore()

  ct.end()
})

t.test('#run (.env and .env.keys already exists with DOTENV_KEY_environment)', ct => {
  const envFilepaths = ['.env']
  const dotenvKeys = {
    'DOTENV_KEY_DEVELOPMENT': 'dotenv://:key_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@dotenvx.com/vault/.env.vault?environment=development'
  }

  const { envKeys, addedKeys, existingKeys } = new DotenvKeys(envFilepaths, dotenvKeys).run()

  const expectedEnvKeys = `#/!!!!!!!!!!!!!!!!!!!.env.keys!!!!!!!!!!!!!!!!!!!!!!/
#/   DOTENV_KEYs. DO NOT commit to source control   /
#/   [how it works](https://dotenvx.com/env-keys)   /
#/--------------------------------------------------/
DOTENV_KEY_DEVELOPMENT="dotenv://:key_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@dotenvx.com/vault/.env.vault?environment=development"
`

  ct.same(envKeys, expectedEnvKeys)
  ct.same(addedKeys, [])
  ct.same(existingKeys, ['DOTENV_KEY_DEVELOPMENT'])

  ct.end()
})

t.test('#_guessEnvironment (.env)', ct => {
  const dotenvKeys = new DotenvKeys()
  const filepath = '.env'
  const environment = dotenvKeys._guessEnvironment(filepath)

  ct.same(environment, 'development')

  ct.end()
})

t.test('#_guessEnvironment (.env.production)', ct => {
  const dotenvKeys = new DotenvKeys()
  const filepath = '.env.production'
  const environment = dotenvKeys._guessEnvironment(filepath)

  ct.same(environment, 'production')

  ct.end()
})

t.test('#_generateDotenvKey (production)', ct => {
  const dotenvKeys = new DotenvKeys()
  const environment = 'production'

  const randomBytesStub = sinon.stub(crypto, 'randomBytes')
  const fakeRandomValue = 'ac300a21c59058c422c18dba8dc9892a537a63e156af14b5c5ef14810dc71f20'
  randomBytesStub.returns(Buffer.from(fakeRandomValue, 'hex'))

  const dotenvKey = dotenvKeys._generateDotenvKey(environment)

  ct.same(dotenvKey, 'dotenv://:key_ac300a21c59058c422c18dba8dc9892a537a63e156af14b5c5ef14810dc71f20@dotenvx.com/vault/.env.vault?environment=production')

  randomBytesStub.restore()

  ct.end()
})
