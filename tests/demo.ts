import { createLocalDemo } from "../services/relayer/src/demo.js";
const { relayer, activation, reads } = createLocalDemo();
console.log("HumanArt LOCAL SIMULATION: no World, NFC cryptography, blockchain or IPFS.");
const activationJob = relayer.submitActivation(activation);
if (activationJob.status !== "confirmed") throw new Error(activationJob.error);
console.log("Activation:", activationJob.status);
for (const read of [reads[1]!, reads[1]!, reads[2]!]) {
  const { receipt } = relayer.submitScanVerification(read);
  console.log(JSON.stringify(receipt, null, 2));
}
