import React, { Component } from 'react';
import Layout from '../../components/Layout';

class CampaignShow extends Component {
    /* We pass in a seperate 'props' in the GetInitialProps since
    we in the routes there is an URL parameter address
    This props object is different from the props which gets passed in
    the render method */
    static async getInitialProps(props) {
        console.log(props.query.address);
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