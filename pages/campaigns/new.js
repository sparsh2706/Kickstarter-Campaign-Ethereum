import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault() // Prevents auto submission of Form to the backend server

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                    .createCampaign(this.state.minimumContribution)
                    .send({
                       from: accounts[0]
            });
            /* We dont have to specifiy the Gas since Metamask takes care of it */
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> 
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

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>
                        Create!
                    </Button>
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

/* We had to add the 'error' prop in the Form tag as well
so that Semantic UI can display the message */

/* error={!!this.state.errorMessage}, when the string is empty
it is meant as error=False, so no error Message would be shown
with Oops.
The two exclamations is a little trick
!!"" => False
!!"Any String" => True
*/
