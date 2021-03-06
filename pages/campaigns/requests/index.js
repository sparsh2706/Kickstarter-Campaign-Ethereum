import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        
        /* Explanation below */
        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call()
                })
        )

        return { address: address, requests: requests, requestCount: requestCount, approversCount: approversCount };
    }

    renderRow() {
        /* This means that we are going to call a function inside the map with the
        argument being request and index */
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key={index} // React wants to always pass a KEY whenever we are rendering a List Component
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }

    render() {
        /* ES2015 Destructuring, since we are lazy to write TableHeader */
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>Request List</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated='right' style={{ marginBottom: '10px' }}>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} Requests</div>
            </Layout>
        );
    }
}

export default RequestIndex;

/*
Explanation of Fancy JS

So instead of looping over each index like a novice programmer, we do some fancy JS.
We get the list of all the requests in one go.

Array(4).fill() would return an empty array with 5 indices from 0 to 4.
Array(4).fill().map((element, index)) => {index} would return values from 0 upto the
number mentioned in Array(<number mentioned>) and make a list.
Therefore the output would be [0, 1, 2, 3, 4]

In our case, we would have the list of requests

*/