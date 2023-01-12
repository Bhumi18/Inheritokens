const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Inheritokens", function () {
    let inheritokens, owner, owner1, recover_address, nominee1, nominee2, nominee3
    before(async function () {
        // get accounts
        [owner, owner1, recover_address, nominee1, nominee2, nominee3] = await ethers.getSigners()
        // contract deployment
        const Inheritokens = await ethers.getContractFactory("Inheritokens")
        inheritokens = Inheritokens.deploy()
        inheritokens = await (await inheritokens).deployed()
    });

    // for owner registration
    it("should register owner details", async function () {
        await inheritokens.addOwnerDetails("Bhumi", "bhumi@gmail.com", "abc")
        expect(await inheritokens.isOwnerAdded(owner.address)).to.equal(true)
    })

    it("should not register again", async function(){
        const len = await inheritokens.getTotalOwner()
        await inheritokens.addOwnerDetails("Bhumi", "bhumi@gmail.com", "abc")
        expect(await inheritokens.getTotalOwner()).to.equal(len)
    })

    it("should allow new owner to register", async function(){
        await inheritokens.addOwnerDetails("Lajja", "lajja@gmail.com", "abc")
        expect(await inheritokens.isOwnerAdded(owner.address)).to.equal(true)
    })

    // for wallet recovery
    it("should able to add recovery address", async function () {
        await inheritokens.addWalletRecovery(owner.address, recover_address.address)
        expect(await inheritokens.getRecoveryAddress(owner.address)).to.equal(recover_address.address)
    })
})
