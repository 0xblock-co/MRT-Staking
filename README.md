# MRT Staking Project

This project demonstrates staking for fixed time, the staking allowed on this contract is 360 days from initialization, and then distribute tokens based on the deposit amount.

Example - 
If deposit amount is 100 then rewards are as follows:
1. 10% i.e 10 MRT for 90 days serving
2. 20% i.e 20 MRT for 180 days serving
3. 30% i.e 30 MRT for 270 days serving
4. 40% i.e 40 MRT for 360 days serving

Functionalities available like:
1. Reinvest reward
2. Claim reward
3. Withdraw deposited amount with reward
4. Emergency exit
5. Admin to withdraw tokens left for reward on contract

Note - 
1. There is open window of 1 day after serving 90 days to claim, reinvest or withdraw the amount given to contract by user, i.e after serving 90 days, on the 91st day you can either claim, reinvest or withdraw tokens, the same goes for other days too.

2. Deposit and Reinvest is disabled after 270th day because we give rewards based on 90 days, and total days are 360, so 360 - 270 = 90, if user joins 271st day we will not be able to give reward for 90 days as it sums upto only 89 days, so we disable depositing and reinvesting.

`````Shell````
Install dependencies:
npm i

To run the demo contract:
npx hardhat run --network NETWORK scripts/deploy-staking-demo.js

To run the main contract:
npx hardhat run --network NETWORK scripts/deploy-staking.js

To upgrade the contract:
npx hardhat run --network NETWORK scripts/upgrade-staking.js

To run the testcases:
npx hardhat node
npx hardhat test
