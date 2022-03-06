import web3 from './web3';
import Campaign from './build/Campaign.json';

/* We had to psass in the address arugument since Campaign Show
routes has dynamic address routing and we need campaign for the
address of whose page the user wants to see */
const instance = (address) => {
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    )
};

export default instance;

/* Send the address, and this file would give you the contract functions */