const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory; // Reference to the deployed instance of the factory
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    /* Deploy instance of Factory Contract by passing compiled factory's ABI and interface */
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    /* We had two choices to either 'send' or 'call' to the function
    createCampaign, but we use send since we are deploying a new
    contract that is we are modifying the data inside the contract */
    await factory.methods.createCampaign('100').send({
        from: accounts[0], // Manager of campaign
        gas: '1000000'
    });

    /* Now we need to get access to the campaign created, the above
    method only returns a 'Transcation reciept' */
    /* The Square brackets tell ES16 JS that we need the first
    index of the array, we cud have just written campaignAddress=address[0] */
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    /* Now we have to create an actual instance of the Contract.
    Let us create a JS representation of the Contract */
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress // Where this campaign exists
        // We pass in the address only when we have already deployed the contract which is in the above line
    );

});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => { // createCampaign should be called by Manager
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1] // One of the 10 accounts provided to us by ganache
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call() // This allows us to lookup the key in the mapping
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Buy Batteries', '100', accounts[1]) // Any account address
            .send({
                from: accounts[0], // Manager address
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();

        assert.equal(request.description, 'Buy Batteries');
    });

    it('processes a request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        /* Retreive the balance of account [1] */
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance); // balance was a string before
        console.log(balance);
        assert(balance > 104); // 104 eth is taken from the above, we just added 5 to 99 ether, and not 100 since some might have been lost in above test cases
        /* This isnt a very good assert since ganache doesnt restart
        the account balances of the 10 accounts it gives */
    });

});