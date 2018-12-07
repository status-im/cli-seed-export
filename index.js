const StatusJS = require('status-js-api');
const ethUtil = require('ethereumjs-util');
const crypto = require('crypto');
const HDKey = require('./hdkey.js');
let prompt = require('password-prompt')

const moot = "source indoor foster invest draft mechanic fortune lion spike what town one"
const defaultSalt = "mnemonic"; 
const defaultHDSalt = "Bitcoin seed";
//https://github.com/status-im/status-go/blob/develop/account/accounts.go#L142  
async function generateAccount (mnemonic, password = "", salt = defaultSalt, hdSalt = defaultHDSalt) {

    console.log("Seed Phrase.: " + mnemonic);

    //https://github.com/status-im/status-go/blob/develop/extkeys/mnemonic.go#L128
    var mnemonicKey = crypto.pbkdf2Sync(mnemonic, salt+password, 2048, 64, 'sha512')

    const hdwallet = HDKey.fromMasterSeed(mnemonicKey, hdSalt);
    const path = "m/44'/60'/0'/0/0";
    const wallet = hdwallet.derive(path);


    let privateKey = '0x' + wallet.privateKey.toString('hex');
    console.log("Private Key.: " + privateKey);


    let publicKey = ethUtil.privateToPublic(privateKey).toString('hex');
    console.log("Public Key..: 0x04" + publicKey);
    
    let address = '0x' + ethUtil.publicToAddress('0x' + publicKey).toString('hex');
    console.log("Address.....: " + address);
    let statusname = await new StatusJS().getUserName('0x04' + publicKey);
    console.log("User Name...: " + statusname);
}

async function main(mode){
    if (mode == "moot") {
        console.log("#moot")
        generateAccount(moot);    
        return;
    }
    let seed = await prompt('Recovery Phrase: ')
    if (mode == "old"){
        let password = await prompt('Account Password: ')    
        generateAccount(seed, password, "status-im", "status-im");
        return;
    }

    generateAccount(seed);    

}

main(process.argv[2]);