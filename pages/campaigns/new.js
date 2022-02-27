import React, { Component } from "react";
import { Button, Form, Input } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
    state = {
        minimumContribution: ''
    };

    onSubmit = async (event) => {
        event.preventDefault() // Prevents auto submission of Form to the backend server

        const accounts = await web3.eth.getAccounts();
        await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                   from: accounts[0]
                });
        /* We dont have to specifiy the Gas since Metamask takes care of it */
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                
                <Form onSubmit={this.onSubmit}> 
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label='Wei'
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>
                    <Button primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;

/* We didnt pass parentheses in this.onSubmit since doing that
would mean that the function would get executed at that
same moment. We just pass a reference to the function
that it should get executed when we need it to */