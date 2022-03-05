import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';

class CampaignShow extends Component {
    /* We pass in a seperate 'props' in the GetInitialProps since
    we in the routes there is an URL parameter address
    This props object is different from the props which gets passed in
    the render method */
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        console.log(summary);
        return {};
    }
    
    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
            </Layout>
        );
    }
}

export default CampaignShow;