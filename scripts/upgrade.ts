import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers as hethers } from "hardhat";
import { UpgradeableBeacon__factory } from "../typechain";
import { ProxyAdmin__factory } from "../typechain/factories/oz/proxy/transparent";
import { ShipV4 } from "../typechain/ShipV4";
import {
  GnosisSafeAddress,
  ProxyAdminAddress,
  ShipProxyAddress,
  UpgradeableBeaconAddress,
} from "./config";
import { proposeTransaction, verifyContract } from "./utils";

async function main() {
  const signers = await hethers.getSigners();
  if (signers.length < 1) {
    throw new Error(`Not found deployer`);
  }

  const deployer: SignerWithAddress = signers[0];
  console.log(`Deployer: ${deployer.address}`);

  console.log(
    ">> Please make sure that deployer is one of the owner of Gnosis Safe"
  );

  const ShipV4Factory = await hethers.getContractFactory("ShipV4");
  console.log(`Deploying implementation...`);
  const shipV4 = (await ShipV4Factory.deploy()) as ShipV4;
  await shipV4.deployTransaction.wait(2);

  console.log(`ShipV4 deployed at ${shipV4.address}`);
  await verifyContract(shipV4.address);

  console.log("Proposing transaction for TransparentProxy to Gnosis Safe");
  const ProxyAdmin = ProxyAdmin__factory.connect(ProxyAdminAddress, deployer);
  await proposeTransaction(
    GnosisSafeAddress,
    ProxyAdmin,
    "upgrade",
    [ShipProxyAddress, shipV4.address],
    ProxyAdmin__factory.createInterface(),
    deployer
  );

  console.log("Proposing transaction for BeaconProxy to Gnosis Safe");
  const UpgradeableBeacon = UpgradeableBeacon__factory.connect(
    UpgradeableBeaconAddress,
    deployer
  );
  await proposeTransaction(
    GnosisSafeAddress,
    UpgradeableBeacon,
    "upgradeTo",
    [shipV4.address],
    UpgradeableBeacon__factory.createInterface(),
    deployer
  );

  console.log("Congratulations! You can check your Gnosis Safe!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
