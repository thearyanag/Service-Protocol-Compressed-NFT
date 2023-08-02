const { Connection } = require("@solana/web3.js");

const ENVIROMENT = process.env.ENVIROMENT || "devnet";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

if (!HELIUS_API_KEY) {
  console.log("Please set the HELIUS_API_KEY environment variable.");
  process.exit(1);
}

let connection;

if (ENVIROMENT == "production") {
  connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=" + HELIUS_API_KEY
  );
} else {
  connection = new Connection(
    "https://devnet.helius-rpc.com/?api-key=" + HELIUS_API_KEY
  );
}

module.exports = { connection };
