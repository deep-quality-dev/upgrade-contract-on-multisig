# How to upgrade Smart Contract based on Multisig of Gnosis Safe

In this repository, we can see the upgrading steps for `Transparent Proxy` and `Beacon Proxy`.

`Ship` contract is deployed as `Transaparent Proxy` where the contract deployed by `newShip()` function is `Beacon Proxy`.

## Prerequisite

To upgrade from Gnosis Safe, the following ownership should be transferred to Gnosis Safe.

1. `ProxyAdmin` for `TransparentProxy`
2. `UpgradeableBeacon` for `BeaconProxy`
3. `TransparentProxy`(optional)

## Steps to upgrade contract

You can run `npm run upgrade` command to upgrade.

Please make sure that `deployer` account given by `TEST_PRIVATE_KEY` is one of the owners of Gnosis Safe.

Only owner can propose transaction to Gnosis Safe.

### Detailed steps to upgrade transparent proxy

Here's the detailed steps which `upgrade` script runs:

1. Deploy new implementation contract.
2. Goto Gnosis Safe App.
3. Click on `New Transaction` Button on the left-top and propose transaction.

- Contract: `ProxyAdmin`
- Function: `upgrade(TransparentProxy, NewImplementation)`

4. Confirm transaction and execute
5. Check the proxy contract if the implementation has been upgraded with new one.

### Detailed steps to upgrade beacon proxy

Here's the detailed steps which `upgrade` script runs:

1. Deploy new implementation contract.
2. Goto Gnosis Safe App.
3. Click on `New Transaction` Button on the left-top and propose transaction.

- Contract: `UpdateBeacon`
- Function: `upgradeTo(NewImplementation)`

4. Confirm transaction and execute
5. Check the proxy contract if the implementation has been upgraded with new one.
