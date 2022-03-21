const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
const { BN, expectRevert, time } = require('@openzeppelin/test-helpers');

describe("Staking", function () {
  let staking, token, owner, user1, currentTime, timeIncrease = 0;
  const DAYSECONDS = 86400;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy();

    const Staking = await ethers.getContractFactory("StakingMRT");
    staking = await Staking.deploy();

    currentTime = Math.floor(new Date() / 1000) + Number(timeIncrease);
  });

  it("Check if the contract is initialized and owner", async function () {
    await staking.initialize(token.address, currentTime);
    expect(await staking.owner()).to.equal(owner.address);
  });

  it("Contract should not be initialized again", async function () {
    await staking.initialize(token.address, currentTime);
    await expectRevert(staking.initialize(token.address, currentTime), "Initializable: contract is already initialized");
  });

  it("Deposit amount in tier-1 and check reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    expect(await staking.calculateRewards(owner.address, 1)).to.be.equal(10);
  });

  it("Deposit amount in tier-2 and check reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    expect(await staking.calculateRewards(owner.address, 1)).to.be.equal(20);
  });

  it("Deposit amount in tier-3 and check reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    expect(await staking.calculateRewards(owner.address, 1)).to.be.equal(30);
  });

  it("Deposit amount after 270 days and check deposit disables", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(271 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await expectRevert(staking.deposit(100), "deposit disabled")
  });

  it("Deposit amount and claim tier-1 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(10);
  });  

  it("Deposit amount and claim tier-2 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(20);
  });

  it("Deposit amount and claim tier-3 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(30);
  });

  it("Deposit amount and claim tier-4 reward", async function () {
    currentTime += 100;
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(360 * DAYSECONDS) + 100]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(40);
  });

  it("Deposit amount and reinvest tier-1 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    expect((await staking.connect(user1).userInfo(user1.address, 1)).depositAmount).to.be.equal(110);
  });

  it("Deposit amount and reinvest tier-2 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    expect((await staking.connect(user1).userInfo(user1.address, 1)).depositAmount).to.be.equal(120);
  });

  it("Deposit amount and reinvest tier-3 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    expect((await staking.connect(user1).userInfo(user1.address, 1)).depositAmount).to.be.equal(130);
  });

  it("Deposit amount and reinvest tier-4 reward disables", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(271 * DAYSECONDS) - 1]);
    await ethers.provider.send("evm_mine");
    await expectRevert(staking.connect(user1).reinvestReward(1), "reinvest disabled");
  });

  it("Deposit amount and withdraw with tier-1 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).withdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(110);
  });

  it("Deposit amount and withdraw with tier-2 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).withdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(120);
  });

  it("Deposit amount and withdraw with tier-3 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).withdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(130);
  });

  it("Deposit amount and withdraw with tier-4 reward", async function () {
    currentTime += 100;
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(360 * DAYSECONDS) + 100]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).withdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(140);
  });

  it("Deposit amount and emergency withdraw before tier-1 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(100);
  });

  it("Deposit amount and emergency withdraw before tier-2 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(135 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(110);
  });

  it("Deposit amount and emergency withdraw before tier-3 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(225 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(120);
  });

  it("Deposit amount and emergency withdraw before tier-4 reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(315 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(130);
  });

  it("Deposit amount and emergency withdraw before tier-2 reward (with claim)", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(110);
  });

  it("Deposit amount and emergency withdraw before tier-3 reward (with claim)", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(120);
  });

  it("Deposit amount and emergency withdraw before tier-4 reward (with claim)", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).claimReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(130);
  });

  it("Deposit amount and emergency withdraw before tier-2 reward (with reinvest)", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(110);
  });

  it("Deposit amount and emergency withdraw before tier-3 reward (with reinvest)", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(120);
  });

  it("Deposit amount and emergency withdraw before tier-4 reward (with reinvest)", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).emergencyWithdraw(1);
    expect(await token.balanceOf(user1.address)).to.be.equal(130);
  });

  it("Emergency withdraw rewards by admin", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.emergencyWithdrawRewardsAdmin(70, owner.address);
    expect(await token.balanceOf(staking.address)).to.be.equal(130);
  });

  it("Emergency withdraw rewards by admin more than share", async function () {
    await staking.initialize(token.address, currentTime);
    await token.transfer(user1.address, 100);
    await token.transfer(staking.address, 100);
    await token.connect(user1).approve(staking.address, 100);
    await staking.connect(user1).deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await staking.connect(user1).reinvestReward(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(45 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await expectRevert(staking.emergencyWithdrawRewardsAdmin(71, owner.address), "Amount more than reward");
  });

  it("Deposit amount 2nd time in tier-1 and check reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(1);
    await staking.deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(90 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    expect(await staking.calculateRewards(owner.address, 2)).to.be.equal(10);
  });

  it("Deposit amount 2nd time in tier-2 and check reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(1);
    await staking.deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(180 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    expect(await staking.calculateRewards(owner.address, 2)).to.be.equal(20);
  });

  it("Deposit amount 2nd time in tier-3 and check reward", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(1);
    await staking.deposit(100);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(270 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    expect(await staking.calculateRewards(owner.address, 2)).to.be.equal(30);
  });

  it("Deposit amount 2nd time after 270 days and check deposit disables", async function () {
    await staking.initialize(token.address, currentTime);
    await token.approve(staking.address, 1000);
    await staking.deposit(1);
    timeIncrease = await ethers.provider.send("evm_increaseTime", [(271 * DAYSECONDS)]);
    await ethers.provider.send("evm_mine");
    await expectRevert(staking.deposit(100), "deposit disabled")
  });
});
