import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class CampaignShow extends Component {
    /* We pass in a seperate 'props' in the GetInitialProps since
    we in the routes there is an URL parameter address
    This props object is different from the props which gets passed in
    the render method */
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        console.log(summary);
        return { 
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props // This is known as destructuring

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The Manager Created this Campaign and can create Request to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much Wei to become an approver',
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requets must be approved by Approvers'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of People who have already donated to the campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campagin balance (Ether)',
                description: 'The balance is how much money this campaign has left to spend'
            }
        ];

        return <Card.Group items={items} />

    };
    
    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                {this.renderCards()}
            </Layout>
        );
    }
}

export default CampaignShow;

/* This what we get from the console.log(summary)
Result {
  '0': '100',
  '1': '0',
  '2': '0',
  '3': '0',
  '4': '0x3Ef45C2080871194f444840AD7239b4c31129A1D'
}
This looks like an array, but it is infact an object.
But we can still index it as summary[0]
*/