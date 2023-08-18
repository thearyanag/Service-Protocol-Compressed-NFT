# Service-Protocol-Compressed-NFT

A protocol to manage merkle trees for compressed NFTs, just send the nft data, we add it to tree and send you back. ez. **ONLY POSSIBLE ON SOLANA**

**refer to our postman collection on how to use https://documenter.getpostman.com/view/11754828/2s9XxwxZyp**

### Folder Structure

1. /routes - contains all the routes included in the postman
2. /utils - creates the core logic for setting up the tree and adding the NFT to the tree.

### Local Setup

1. clone the repo using `git clone git@github.com:thearyanag/Service-Protocol-Compressed-NFT.git`
2. create a .env file and set the variables as shown in `.env.example` file
3. Make sure to have enough SOL in your wallet before running the `/api/admin/setup` route to setup the trees. [ if you are using the default values , it takes nearly 90 SOL to setup ]
4. Now you are good to go.

If you need the devnet sol to set it up, ping me on discord at @0xaryan

#### open pr for any issues