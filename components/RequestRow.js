import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
    
    onApprove = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods
            .approveRequest(this.props.id)
            .send({
                from: accounts[0]
            });
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods
            .finalizeRequest(this.props.id)
            .send({
                from: accounts[0]
            });
    };
    
    render() {

        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;  

        return(
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>
                    {id}
                </Cell>
                <Cell>
                    {request.description}
                </Cell>
                <Cell>
                    {web3.utils.fromWei(request.value, 'ether')}
                </Cell>
                <Cell>
                    {request.recipient}
                </Cell>
                <Cell>
                    {request.approvalCount}/{approversCount}
                </Cell>
                <Cell>
                    {request.complete ? null : (
                            <Button color='green' basic onClick={this.onApprove}>
                                Approve
                            </Button>
                        )
                    }
                </Cell>
                <Cell>
                    {
                        request.complete ? null : (
                            <Button color='teal' basic onClick={this.onFinalize}>
                                Finalize
                            </Button>
                        )
                    }
                </Cell>
            </Row>
        )
    }
}

export default RequestRow;

/* This would be used to render out one individual row in the Requests Lists */

/*
Metamask shows 'gas Limit too high'

So whenever Metamask shows this, in our case if we click on Finalize at approval
Count of 1/3 then Metamask would show this. This means that Metamask runs a simulation
of the function invoked ahead of time and if anything fails, it shows that
Gas prices are very high. This is an indication that there is somehting which is cauing
failure to our function.

*/