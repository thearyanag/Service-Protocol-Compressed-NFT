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
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const { tree } = require("../../../models");

const { connection, wallet } = require("../../../client/web3");

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
  try {
    // Generate the keypair for merkle tree accounts and store them in databaseß
    let merkleTreeAccounts = [];

    for (let i = 0; i < 4; i++) {
      merkleTreeAccounts.push(Keypair.generate());

      await tree.create({
        id: i,
        depth: maxDepth[i],
        buffer_size: maxBufferSize[i],
        canopy: canopyDepth[i],
        public_key: merkleTreeAccounts[i].publicKey.toString(),
        private_key: merkleTreeAccounts[i].secretKey.toString(),
      });
    }

    // Get the PDA using the BUBBLEGUM_PROGRAM_ID
    let merkleTreeAuthority = [];

    for (let i = 0; i < 4; i++) {
      merkleTreeAuthority.push(
        PublicKey.findProgramAddressSync(
          [merkleTreeAccounts[i].publicKey.toBuffer()],
          BUBBLEGUM_PROGRAM_ID
        )[0]
      );
    }

    // create the instruction for allocating space for the merkle trees
    let createAllocTreeIxArray = [];

    for (let i = 0; i < 4; i++) {
      createAllocTreeIxArray.push(
        await createAllocTreeIx(
          connection,
          merkleTreeAccounts[i].publicKey,
          wallet.publicKey,
          {
            maxDepth: maxDepth[i],
            maxBufferSize: maxBufferSize[i],
          },
          canopyDepth[i]
        )
      );
    }

    // create the instruction for actually creating the merkle tree accounts
    let createCreateTreeInstructionArray = [];

    for (let i = 0; i < 4; i++) {
      createCreateTreeInstructionArray.push(
        createCreateTreeInstruction(
          {
            payer: wallet.publicKey,
            treeCreator: wallet.publicKey,
            treeAuthority: merkleTreeAuthority[i],
            merkleTree: merkleTreeAccounts[i].publicKey,
            compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
            logWrapper: SPL_NOOP_PROGRAM_ID,
          },
          {
            maxBufferSize: maxBufferSize[i],
            maxDepth: maxDepth[i],
            public: false,
          },
          BUBBLEGUM_PROGRAM_ID
        )
      );
    }

    // Build and send the transaction
    for (let i = 0; i < 4; i++) {
      const tx = new Transaction()
        .add(createAllocTreeIxArray[i])
        .add(createCreateTreeInstructionArray[i]);
      tx.feePayer = wallet.publicKey;

      let txSig = await sendAndConfirmTransaction(
        connection,
        tx,
        [merkleTreeAccounts[i], wallet],
        {
          commitment: "confirmed",
          skipPreflight: true,
        }
      );

      console.log(txSig);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createTreeAccounts };
