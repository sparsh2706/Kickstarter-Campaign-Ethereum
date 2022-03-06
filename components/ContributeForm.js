import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {

    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' }); // If the User submitted correctly, then we reset the state of errorMessage to Empty

        try {
            /* Calling Contract Method to contribute in Wei */
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            /* We didnt use pushRoute since that would redirect to the page i.e would
            add the URL in the History of the browser, essentially which means is that the user clicks
            the Back button, but we only want to refresh the page.
            For that we use replaceRoute */
            Router.replaceRoute(`/campaigns/${this.props.address}`)

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false, value: '' })
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition='right'
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>
                    Contribute!
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;