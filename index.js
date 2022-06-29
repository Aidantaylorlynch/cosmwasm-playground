import fs from 'fs'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from '@cosmjs/proto-signing'

const pathToMnemonic = './words'

const networkOptions = {
    bech32AddressPrefix: 'wasm',
    url: 'https://rpc.malaga-420.cosmwasm.com',
    feeToken: 'umlg'
}

const generateNewWallet = async (bech32AddressPrefix) => {
    const hdDerivationPath = makeCosmoshubPath(0)
    const numberOfWordsInMnemonic = 12
    return await DirectSecp256k1HdWallet.generate(numberOfWordsInMnemonic, { hdPaths: [hdDerivationPath], prefix: bech32AddressPrefix })
}

const createCosmosClient = async (url, bech32AddressPrefix, wallet) => {
    return await SigningCosmWasmClient.connectWithSigner(url, wallet, { prefix: bech32AddressPrefix })
}

const getExistingWalletFromMnemonic = async (bech32AddressPrefix, mnemonic) => {
    return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: bech32AddressPrefix})
}

//const wallet = await generateNewWallet(networkOptions.bech32AddressPrefix)
const mnemonic = fs.readFileSync(pathToMnemonic).toString()
const wallet = await getExistingWalletFromMnemonic(networkOptions.bech32AddressPrefix, mnemonic)
const client = await createCosmosClient(networkOptions.url, networkOptions.bech32AddressPrefix, wallet)

const [account] = await wallet.getAccounts()
const accountBalance = await client.getBalance(account.address, networkOptions.feeToken)

//fs.writeFileSync(pathToMnemonic, wallet.mnemonic)

console.log(`
    address: ${account.address}
    balance: ${accountBalance.amount}
`)