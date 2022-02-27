import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class CampaignIndex extends Component {
    /* Our methods would be async */
    static async getInitialProps() { // The usage of static is there so that this method gets tied to the class directly. This is for next.js
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns }; // We return it as 'Props'
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => { // This function would run thru each element. This is the map function of React
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true // This allows the cards to stretch its width to the entire container
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
        <Layout>
            <div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <h3>Open Campaigns</h3>
                {this.renderCampaigns()}
                <Button 
                    content="Create Campaign"
                    icon="add circle"
                    primary // this means primary={true}. Just adds blue colour button
                />
            </div>
        </Layout>
        );
    }

}
export default CampaignIndex;

/* To-do's for the Campaign List Page 

    1. Configure web3 with a provider from metamask => Create a new instance of web3
    2. Tell web3 that a deployed copy of the 'CampaignFactory' exists
    3. Use Factory instance to retrieve a list of deployed campaigns
    4. Use React to show something about each campaign

*/