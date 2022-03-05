import web3 from './web3'; // We are getting the instance we created of web3
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x9267a699C79ed7A56bE9B51e56D1c210B9feDd91'
);

export default instance;