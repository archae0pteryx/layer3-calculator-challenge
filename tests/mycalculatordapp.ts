import * as anchor from "@project-serum/anchor";
import { assert } from "chai";
const { SystemProgram } = anchor.web3;

let calculator
let program


// use before hook instead of describe block / 'private' var
// for cleaner, less coupled code that are individual units
before(async () => {
  const provider = anchor.Provider.local()
  anchor.setProvider(provider)
  program = anchor.workspace.Mycalculatordapp
  calculator = anchor.web3.Keypair.generate()
  await program.rpc.create('Foobar', {
    accounts: {
      calculator: calculator.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    },
    signers: [calculator]
  })
})

describe('calculator app', () => {
  it('creates a calc', async () => {
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.greeting === 'Foobar')
  })

  it('adds two numbers', async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(5)))
    assert.ok(account.greeting === 'Foobar')
  })

  it('subtracts two numbers', async () => {
    await program.rpc.subtract(new anchor.BN(10), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(5)))
    assert.ok(account.greeting === 'Foobar')
  })
  it('multiplys two numbers', async () => {
    await program.rpc.multiply(new anchor.BN(10), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)
    assert.ok(account.result.eq(new anchor.BN(50)))
    assert.ok(account.greeting === 'Foobar')
  })
  it('divides two numbers', async () => {
    await program.rpc.divide(new anchor.BN(9), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey
      }
    })
    const account = await program.account.calculator.fetch(calculator.publicKey)

    assert.ok(account.result.eq(new anchor.BN(1)))
    assert.ok(account.remainder.eq(new anchor.BN(4)))
    assert.ok(account.greeting === 'Foobar')
  })
  
})
