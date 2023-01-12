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

    // for adding nominee
    it("should able to add nominee", async function () {
        await inheritokens.addNomineesDetails("Bhumi1", "bhumi1@gmail.com", nominee1.address)
        const len = ((await inheritokens.getAllNominees(owner.address)).length)
        expect(len).to.equal(1)
    })

    it("should able to add second nominee", async function () {
        await inheritokens.addNomineesDetails("Bhumi2", "bhumi2@gmail.com", nominee2.address)
        const len = ((await inheritokens.getAllNominees(owner.address)).length)
        expect(len).to.equal(2)
    })

    // for adding charity
    it("should able to add charity", async function () {
        await inheritokens.addCharity(charity1.address, "charity1", "charity1", "abc")
        charity_id += 1
        expect(await inheritokens.getTotalNumberOfCharity()).to.equal(1)
    })

    it("should able to add second charity", async function () {
        await inheritokens.addCharity(charity2.address, "charity2", "charity2", "abc")
        charity_id += 1
        expect(await inheritokens.getTotalNumberOfCharity()).to.equal(2)
    })

    it("should allow owner to set charity as white list", async function () {
        await inheritokens.setWhiteListedCharities(owner.address, 1)
        const len = ((await inheritokens.getAllWhiteListedCharities(owner.address)).length)
        expect(len).to.equal(1)
    })
})
