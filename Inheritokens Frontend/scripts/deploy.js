const hre=require("hardhat")

async function main(){
    const Inheritokens = await hre.ethers.getContractFactory("Inheritokens");
    const inheritokens = Inheritokens.deploy()
    await (await inheritokens).deployed()
    console.log(`contract address is ${(await inheritokens).address}`)
}
main().catch((error) => {
    console.log(error)
    process.exitCode = 1
})