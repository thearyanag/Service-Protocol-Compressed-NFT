const adminRouter = require("express").Router();
const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");

const {
  createTreeAccounts,
  checkTreeAccountsExist,
  syncModels,
} = require("../utils/admin/setup");

const { destroyTreeAccounts } = require("../utils/admin/reset");

const { connection, wallet, collectionWallet } = require("../client/web3");
const { PublicKey } = require("@solana/web3.js");

adminRouter.post("/setup", async (req, res) => {
  await syncModels();

  let ifExists = await checkTreeAccountsExist();

  if (!ifExists) {
    await createTreeAccounts();
    res.status(200).send({
      message:
        "Tree accounts created, please make sure to have 90 SOL in your private key to fund the accounts",
    });
  } else {
    res.status(400).send({
      message: "Tree accounts already exist, use /api/admin/reset to reset",
    });
  }
});

adminRouter.post("/reset", async (req, res) => {
  await syncModels();

  let ifExists = await checkTreeAccountsExist();

  if (ifExists) {
    await destroyTreeAccounts();

    res.status(200).send({
      message: "Tree accounts reset",
    });
  } else {
    res.status(400).send({
      message: "Tree accounts do not exist, use /api/admin/setup to setup",
    });
  }
});

/**
 * A helper route to create a new collection for testing with a new wallet
 */
adminRouter.post("/collection", async (req, res) => {
  const metaplex = Metaplex.make(connection);
  metaplex.use(keypairIdentity(wallet));

  collectionConfig = {
    name: "Test Collection",
    metadata: "https://arweave.net/NwingoFDQ2eDPVU_BP6vGoJ3gUWFfinbminj3G3ZYjw",
    sellerFeeBasisPoints: 100,
  };

  const collection = await metaplex.nfts().create(
    {
      name: collectionConfig.name,
      uri: collectionConfig.metadata,
      sellerFeeBasisPoints: collectionConfig.sellerFeeBasisPoints,
      isCollection: true,
      updateAuthority: collectionWallet,
    },
    { commitment: "finalized" }
  );

  res.send({
    collectionAuthority: collection.nft.updateAuthorityAddress,
    collectionMint: collection.mintAddress,
    collectionMetadata: collection.metadataAddress,
    editionAccount: collection.masterEditionAddress,
  });
});

module.exports = adminRouter;

// 50357713967;
