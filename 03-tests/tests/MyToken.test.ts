import { ethers } from "hardhat";
import { expect } from "chai";
import { MyToken, MyToken__factory } from "../typechain-types";

describe("MyToken", function () {
    let token: MyToken;
    let owner: any;
    let user1: any;

    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();
    
        const TokenFactory = (await ethers.getContractFactory("MyToken")) as MyToken__factory;
        token = await TokenFactory.deploy(ethers.parseUnits("1000000", 18));
        await token.waitForDeployment();
    });

    it("Should assign initial supply to the owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        expect(ownerBalance).to.equal(ethers.parseUnits("1000000", 18));
    });

    it("Should transfer tokens between accounts", async function () {
        await token.transfer(user1.address, ethers.parseUnits("1000", 18));
        const user1Balance = await token.balanceOf(user1.address);
        expect(user1Balance).to.equal(ethers.parseUnits("1000", 18));
    });

    it("Should approve tokens for delegated transfer", async function () {
        const amount = ethers.parseUnits("500", 18);
        await expect(token.approve(user1.address, amount))
          .to.emit(token, "Approval")
          .withArgs(owner.address, user1.address, amount);
      
        const allowance = await token.allowance(owner.address, user1.address);
        expect(allowance).to.equal(amount);
      });
      
      it("Should allow transferFrom after approval", async function () {
        const amount = ethers.parseUnits("300", 18);
      
        await token.approve(user1.address, amount);
      
        const tokenFromUser1 = token.connect(user1);
        await tokenFromUser1.transferFrom(owner.address, user1.address, amount);
      
        const user1Balance = await token.balanceOf(user1.address);
        expect(user1Balance).to.equal(amount);
      });
      
    it("Should fail transferFrom without approval", async function () {
        const amount = ethers.parseUnits("200", 18);
        const tokenFromUser1 = token.connect(user1);
      
        await expect(
          tokenFromUser1.transferFrom(owner.address, user1.address, amount)
        ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
      });

    it("Should fail if sender doesn't have enough tokens", async function () {
        const tokenFromUser1 = token.connect(user1);
        const amount = ethers.parseUnits("1000000", 18);
    
        await expect(
            tokenFromUser1.transfer(owner.address, amount)
        ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("Should emit a Transfer event on successful transfer", async function () {
        const amount = ethers.parseUnits("1000", 18);
    
        await expect(token.transfer(user1.address, amount))
            .to.emit(token, "Transfer")
            .withArgs(owner.address, user1.address, amount);
    });
});