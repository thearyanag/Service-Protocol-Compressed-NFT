const {
  TokenProgramVersion,
  TokenStandard,
  PROGRAM_ID: BUBBLEGUM_PROGRAM_ID,
  createMintToCollectionV1Instruction,
} = require("@metaplex-foundation/mpl-bubblegum");
const {
  SPL_NOOP_PROGRAM_ID,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
} = require("@solana/spl-account-compression");
const {
  PROGRAM_ID: TOKEN_METADATA_PROGRAM_ID,
} = require("@metaplex-foundation/mpl-token-metadata");

const { connection, wallet } = require("../../../client/web3");
let { Keypair, Transaction, PublicKey } = require("@solana/web3.js");

const addNFTToTree = async (keypair, owner, metadata, collection) => {
  owner = new PublicKey(owner);

  let treeAddress = keypair.publicKey;

  collection = {
    collectionAuthority: new PublicKey(collection.collectionAuthority),
    collectionMint: new PublicKey(collection.collectionMint),
    collectionMetadata: new PublicKey(collection.collectionMetadata),
  };

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const [bubblegumSigner, __] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );

  metadata = {
    ...metadata,
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible,
  };

  const compressedMintIx = createMintToCollectionV1Instruction(
    {
      payer: wallet.publicKey,
      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
      treeDelegate: wallet.publicKey,

      leafOwner: owner,
      leafDelegate: owner,

      collectionAuthority: collection.collectionAuthority,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collection.collectionMint,
      collectionMetadata: collection.collectionMetadata,
      editionAccount: collection.editionAccount,

      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      bubblegumSigner: bubblegumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(metadata, {
        collection: {
          key: collection.collectionMint,
          verified: false,
        },
      }),
    }
  );

  const tx = new Transaction();

  tx.add(compressedMintIx);

  tx.feePayer = wallet.publicKey;

  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

  console.log(wallet.publicKey)

  tx.partialSign(wallet);

  console.log(
    tx.serialize({
      requireAllSignatures: false,
    })
  );
};

module.exports = { addNFTToTree };
