import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from '@cosmjs/proto-signing'

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

const wallet = await generateNewWallet(networkOptions.bech32AddressPrefix)
const client = await createCosmosClient(networkOptions.url, networkOptions.bech32AddressPrefix, wallet)

const [account] = await wallet.getAccounts()
const accountBalance = await client.getBalance(account.address, networkOptions.feeToken)

console.log(`
    address: ${account.address}
    balance: ${accountBalance.amount}
`)