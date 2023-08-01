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
const { Console } = require("console");

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=7af4bda5-23e2-4d78-a78f-49e79cf354ed");

const payer = Keypair.fromSecretKey(

);

const maxDepth = [20, 20, 20, 20];

const maxBufferSize = [64, 256, 1024, 2048];

const canopyDepth = [14, 15, 15, 16];

// Returns the SOL balance required to make the trees
async function getBalanceRequired() {
  let requiredSpace = 0;

  for (let i = 0; i < maxDepth.length; i++) {
    let space = getConcurrentMerkleTreeAccountSize(
      maxDepth[i],
      maxBufferSize[i],
      canopyDepth[i]
    );

    let res = await connection.getMinimumBalanceForRentExemption(space);
    console.log(res / LAMPORTS_PER_SOL);
    requiredSpace += res / LAMPORTS_PER_SOL;
  }

  return requiredSpace;
}

/**
 * Creates the Merkle Trees.
 * m0 = 20,64,14
 * m1 = 20,64,15
 * m2 = 20,256,15
 * m3 = 20,1024,15
 */
async function init() {
  let merkleTreeAccounts = [];

  for (let i = 0; i < 4; i++) {
    merkleTreeAccounts.push(Keypair.generate());
  }

  let merkleTreeAuthority = [];

  for (let i = 0; i < 4; i++) {
    merkleTreeAuthority.push(
      PublicKey.findProgramAddressSync(
        [merkleTreeAccounts[i].publicKey.toBuffer()],
        BUBBLEGUM_PROGRAM_ID
      )[0]
    );
  }

  let createAllocTreeIxArray = [];

  for (let i = 0; i < 4; i++) {
    createAllocTreeIxArray.push(
      await createAllocTreeIx(
        connection,
        merkleTreeAccounts[i].publicKey,
        payer.publicKey,
        {
          maxDepth: maxDepth[i],
          maxBufferSize: maxBufferSize[i],
        },
        canopyDepth[i]
      )
    );
  }

  let createCreateTreeInstructionArray = [];

  for (let i = 0; i < 4; i++) {
    createCreateTreeInstructionArray.push(
      createCreateTreeInstruction(
        {
          payer: payer.publicKey,
          treeCreator: payer.publicKey,
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

  for (let i = 0; i < 1; i++) {
    const tx = new Transaction()
      .add(createAllocTreeIxArray[i])
      .add(createCreateTreeInstructionArray[i]);
    tx.feePayer = payer.publicKey;

    let txSig = await sendAndConfirmTransaction(
      connection,
      tx,
      [merkleTreeAccounts[i], payer],
      {
        commitment: "confirmed",
        skipPreflight: true,
      }
    );

    console.log(txSig);
  }
}

init();
