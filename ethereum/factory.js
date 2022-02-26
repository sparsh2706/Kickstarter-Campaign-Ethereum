import web3 from './web3'; // We are getting the instance we created of web3
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x75dB4687491b03AD81e94eE9c04F49d3489c3328'
);

export default instance;