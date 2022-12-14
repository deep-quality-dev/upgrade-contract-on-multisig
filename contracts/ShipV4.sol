// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {OwnableUpgradeable} from "./oz/access/OwnableUpgradeable.sol";
import {BeaconProxy} from "./oz/proxy/beacon/BeaconProxy.sol";

contract ShipV4 is OwnableUpgradeable {
  string public name;
  uint256 public fuel;

  event NewShip(address newContract, string name, uint256 fuel);

  function initialize(string memory _name, uint256 _fuel) external initializer {
    __Ownable_init();
    name = _name;
    fuel = _fuel;
  }

  function move() public {
    require(fuel > 0, "no feul");
    fuel--;
  }

  function refuel() public {
    fuel++;
  }

  function doubleRefuel() public {
    fuel += 2;
  }

  function tripleRefuel() public {
    fuel += 3;
  }

  function newShip(
    address beacon,
    string memory _name,
    uint256 _fuel
  ) external returns (address) {
    address newContract = address(
      new BeaconProxy(
        beacon,
        abi.encodeWithSelector(
          ShipV4.initialize.selector,
          address(this),
          _name,
          _fuel
        )
      )
    );

    emit NewShip(newContract, _name, _fuel);
    return newContract;
  }
}
