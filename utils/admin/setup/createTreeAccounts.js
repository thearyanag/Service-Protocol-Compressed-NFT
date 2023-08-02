const {
  createAllocTreeIx,
  getConcurrentMerkleTreeAccountSize,
  ValidDepthSizePair,
  PROGRAM_ID: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} = require("@solana/spl-account-compression");
const {
  PROGRAM_ID: BUBBLEGUM_PROGRAM_ID,
  createCreateTreeInstruction,
} = require("@metaplex-foundation/mpl-bubblegum");
const {
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const { tree } = require("../../../models");

// CONSTANTS FOR TREE CREATION
// 20,64,14 = free tier
// 20,256,15 = developer tier
// 20,1024,15 = startup tier
// 20,2048,16 = enterprise tier
const maxDepth = [20, 20, 20, 20];
const maxBufferSize = [64, 256, 1024, 2048];
const canopyDepth = [14, 15, 15, 16];

/**
 * Creates the Merkle Trees.
 * 0 = 20,64,14
 * 1 = 20,256,15
 * 2 = 20,1024,15
 * 3 = 20,2048,15
 */

async function createTreeAccounts() {
  // Generate the keypair for merkle tree accounts and store them in databaseß
  let merkleTreeAccounts = [];

  for (let i = 0; i < 4; i++) {
    merkleTreeAccounts.push(Keypair.generate());

    await tree.create({
      id : i,
      depth: maxDepth[i],
      buffer_size: maxBufferSize[i],
      canopy: canopyDepth[i],
      public_key: merkleTreeAccounts[i].publicKey.toString(),
      private_key: merkleTreeAccounts[i].secretKey.toString(),
    });
  }
}

module.exports = { createTreeAccounts };