import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers as hethers, upgrades } from "hardhat";
import { ShipV3 } from "../typechain/ShipV3";
import { verifyContract } from "./utils";

async function main() {
  const signers = await hethers.getSigners();
  if (signers.length < 1) {
    throw new Error(`Not found deployer`);
  }

  const deployer: SignerWithAddress = signers[0];
  console.log(`Deployer: ${deployer.address}`);

  const ShipV3Factory = await hethers.getContractFactory("ShipV3");
  console.log(`Deploying implementation...`);
  const shipV3 = (await ShipV3Factory.deploy()) as ShipV3;
  await shipV3.deployed();

  console.log(`ShipV3 deployed at ${shipV3.address}`);
  await verifyContract(shipV3.address);

  // const nextImpl = await upgrades.prepareUpgrade(ShipProxyAddress, ShipV2Factory) as string;
  // console.log(`ShipV2 deployed at ${nextImpl}`);

  // await verifyContract(nextImpl);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
