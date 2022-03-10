import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        recepient: ''
    };

    static async getIntialProps(props) {
        const { address } = props.query;

        return { address: address };
    }

    render() {
        return(
            <Layout>
                <h3>Create a Request</h3>
                <Form>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recepient</label>
                        <Input
                            value={this.state.recepient}
                            onChange={event => this.setState({ recepient: event.target.value })}
                        />
                    </Form.Field>
                    <Button primary>
                        Create!
                    </Button>
                </Form>


            </Layout>
        );
    }
}

export default RequestNew;