const { expect } = require("chai");

describe("EvgeniiToken", function () {
  let MyToken, myToken, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(ethers.parseEther("1000"));

    await myToken.waitForDeployment();
  });

  it("Should assign initial supply to the owner", async function () {
    const ownerBalance = await myToken.balanceOf(owner.address);

    expect(ownerBalance).to.equal(ethers.parseEther("1000"));
  });

  it("Should transfer tokens between accounts", async function () {
    await myToken.transfer(addr1.address, ethers.parseEther("100"));

    const addr1Balance = await myToken.balanceOf(addr1.address);

    expect(addr1Balance).to.equal(ethers.parseEther("100"));
  });
});
