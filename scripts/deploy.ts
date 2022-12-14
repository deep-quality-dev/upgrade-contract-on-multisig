import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractReceipt, ContractTransaction, Event } from "ethers";
import { ethers, upgrades } from "hardhat";
import { Ship } from "../typechain";
import { NewShipEvent } from "../typechain/Ship";
import { GnosisSafeAddress } from "./config";
import { verifyContract } from "./utils";

async function main() {
  const signers = await ethers.getSigners();
  if (signers.length < 1) {
    throw new Error(`Not found deployer`);
  }

  const deployer: SignerWithAddress = signers[0];
  console.log(`Deployer: ${deployer.address}`);

  console.log("Deploying Beacon...");
  const factory = await ethers.getContractFactory("Ship");
  const beacon = await upgrades.deployBeacon(factory);
  console.log(`Beacon deployed at ${beacon.address}`);

  const ship = (await upgrades.deployProxy(factory, ["Ship", 100])) as Ship;
  await ship.deployed();
  console.log(`Ship deployed at ${ship.address}`);

  const shipImpl = await upgrades.erc1967.getImplementationAddress(
    ship.address
  );
  await verifyContract(shipImpl);

  const NewShipTopic = ethers.utils.id("NewShip(address,string,uint256)");
  console.log(`NewShipTopic: ${NewShipTopic}`);

  console.log("Deploying new Ship...");
  const ship2 = await ship
    .newShip(beacon.address, "Ship2", 200)
    .then((tx: ContractTransaction) => tx.wait())
    .then((tx: ContractReceipt) => {
      const filtered = tx.events?.filter(
        (event: Event) => event.event === "NewShip"
      );
      return filtered && filtered.length > 0
        ? (filtered[0] as NewShipEvent).args.newContract
        : undefined;
    });
  console.log(`New Ship deployed at ${ship2}`);

  console.log(
    `Transferring ownership of Proxy to Gnosis Safe: ${GnosisSafeAddress}`
  );
  await upgrades.admin.transferProxyAdminOwnership(GnosisSafeAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
