import { ethers } from "hardhat";
import { MyToken__factory } from "../../typechain-types";

async function main() {
  const [owner, receiver] = await ethers.getSigners();

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const token = MyToken__factory.connect(contractAddress, owner);

  const ownerBalance = await token.balanceOf(owner.address);
  console.log(`💰 Balance of owner: ${ethers.formatUnits(ownerBalance, 18)} EVG`);

  const amountToSend = ethers.parseUnits("100", 18);
  const tx = await token.transfer(receiver.address, amountToSend);
  await tx.wait();

  console.log(`🔁 Transferred 100 EVG to ${receiver.address}`);

  const receiverBalance = await token.balanceOf(receiver.address);
  console.log(`📥 Balance of receiver: ${ethers.formatUnits(receiverBalance, 18)} EVG`);
  console.log(`🏷️ Token: ${await token.name()} (${await token.symbol()})`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
