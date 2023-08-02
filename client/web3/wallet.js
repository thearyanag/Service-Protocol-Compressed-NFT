const { Keypair, PublicKey } = require("@solana/web3.js");
const bs58 = require("bs58");

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.log("Please set the PRIVATE_KEY environment variable.");
  process.exit(1);
}

let wallet = Keypair.fromSecretKey(bs58.decode(privateKey));

module.exports = { wallet };
