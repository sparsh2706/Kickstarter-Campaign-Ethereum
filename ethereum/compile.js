const path = require('path');
const solc = require('solc');
const fs = require('fs-extra'); // File-system access given by JS

/* Get path to build folder */
const buildPath = path.resolve(__dirname, 'build');
/* Remove directory */
fs.removeSync(buildPath); // Deletes everything inside the folder


const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
/* Read source code from file */
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts; // We just need the contract object
// console.log(output);


/* Re-create buiild directory */
fs.ensureDirSync(buildPath); // Checks if dir exists, if not, then creates

/* Loop over the contract and write the contract to different file */
for (let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    )
    /* We would notice a Colon in the name of the compiled
    Contract, this is because thats how it is stored as a key
    in the 'output' object after compilation */

}



/* The Steps to build compile.js

1. We would compile both the contracts (Campaign and CampaignFactory)
2. Save the 2 compiled files to the project directory
3. Make a folder by the name of "build" in Ethereum folder

Anytime we run the compile script, the below should happen:
1. Delete entire 'build' folder => We dont want any old code sitting around
2. Read 'Campaign.sol' from the 'contracts' folder
3. Compile both contracts with Solidity compiler
4. Write output to 'build' driectory => We can access the ABI and interface from here

*/