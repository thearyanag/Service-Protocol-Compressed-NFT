const { Transaction, Keypair, Connection } = require("@solana/web3.js");
const bs58 = require("bs58");

let connection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=7af4bda5-23e2-4d78-a78f-49e79cf354ed"
);

let collectionKey =
  "2xv4wsMMSfUq5uVPDx2gnL6oWQu4gUvLsuC2JNs3nqnymvteSFfRCRiPzBe2SJAHUgdrKUvdxBuRqSqabetg2thy";

let tx = Transaction.from(
  Buffer.from(
    "Au2JWlRteXwnKIsrwlIq2CUyX5n7mn+eEFltRh7pPOOAA2CdT6aln/Okjxp3bmmMVoNYRbFOtwH2VOVuvZ/ocgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEJDgisrZLwu3bi/2O1k7PT9g/ZPqxI+3+rwtgdETdDNgVzygQPzrAmAVa8WQEnTugFVNmNLnh57rLEjvR+mlCd/yyiKGtC90vLI3SRGADqL8XPTMGtcuwkDmRGN0Q+sNADaN/ccHfGzUByUZzNPiIcPr/mv+Nz6HSVKyY0vDo0zztT+VC3ijxn+Rbm4Ke10HXST+4PGuCOqWSQZ2D1knWisTQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/CQpN6fskzGnu0X/GgsdMw/fkgxFz6Y7G+UcFzTt0ULbjKDQNkCh/dUj50AyLJjCayjchUmaiG+Q4eAfD8npk2Sy9UYaHX+MALu2V3OGYmY5MB0yVLzK9pvzBOzuievHCA8/FeDgWGhKJX6fKphSzXN5iYjt/MNQSBk/ZJfoLamIuA63k1KGmyJHRfWd2/iiZYyhPcaIEhJjUcrgfBpaUJKhPulcQcugimf1rGfo334doRYl4dZBN/j08jgwN/FAtwZbHj0XxFOJ1Sf2sEw81YuGxzGqD9tUm20bwD+ClGC7wPwLtHyi90xBEulKsTz6PGNOXcF+rLA80aI81+eHz5a0oFTjIfI3ML5Sx5glAcJphsNE+uLBGoG9uplGiTSgEKEAMJCQQAAAEKBgIHCA0LDAXMAZkSsi/FnlYPEAAAAFN0dWRpb3VzIENyYWIgIzEEAAAAQ1JBQnQAAABodHRwczovL25idW9ubXVtMnRhdGtxaHE1ejZsbXp3ZDRmbnhiazVlNWp0bTUydzVhNm1pcm1hcm9laHEuYXJ3ZWF2ZS5uZXQvYUdqbXNvelV3VFZBOE81OHRtYkQ0VnR3cTZUcVpzN3EzUWVZaUxBUmNROPQBAAABAAEAAQAPwkKTen7JMxp7tF/xoLHTMP35IMRc+mOxvlHBc07dFAAAAAAAAA==",
    "base64"
  )
);

let collectionWallet = Keypair.fromSecretKey(bs58.decode(collectionKey));
tx.partialSign(collectionWallet);

connection
  .sendRawTransaction(tx.serialize())
  .then(console.log)
  .catch(console.log);
