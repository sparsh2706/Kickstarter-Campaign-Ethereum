# Kickstarter-Campaign-Ethereum
A version of the famous kickstarter.com built on the Ethereum blockchain.

Here is how the code was build up and thought about (a Notion doc):

# Kickstarter Smart Contract

Created: February 14, 2022 11:41 PM

Kickstarter is a platform where people aka contributors fund money to a project creator who has listed his or her product in the platform in hopes of uilding it. It is kind of like a fundraiser for creating a new project to life. The contributors donate some money to the building of the project which helps the project creator to create the project. 

### Problem

The problem is that some creators turn out to be scammers, who have no intention in creating the product but hoard all the campaign money for their personal benefits. As of now, after contributors donate their money, they dont have any say in how the campaign money is used by the creator since Kickstarter directly deposits these funds to the Private bank account of the creator. The money spent is in complete autonomy to the creator while the donators have no idea about it.

### Solution

One of the solution is that we can develop a Ethereum Smart contract in which the entire Kickstarter campaign money be sent. Now the contributors would send their money to the Eth smart contract. After this, the creator now has to create a **SPENDING REQUEST** which would be approved by all the contributors using a Majority Voting system. After having majority votes as **YES** then the spending request gets approved which and the money needed to buy any manufacturing materials can be directly send to the Address of the specific vendor who sells the materials. 

Although this is not a perfect solution since the creator can obviosuly give a fake address of the vendor or we dont know if all the contributors would vote for the project or not. But it is one of the steps to having a clean system of contribution.

# Design of the Contract

Created: February 14, 2022 11:41 PM

![Untitled](Docs/Design%20of%20%2024f2d/Untitled.png)

Notice ‘**approvers**’ is a mapping instead of an array.

# Campaign Contract

Created: February 14, 2022 11:41 PM

According to the design of the Contract, we would have to create a Request Struct for the spending requests.

### Initial Setup of Contract

```solidity
pragma solidity ^0.4.17;

/* Request Struct
        @description: Describes why the request is created
        @value: Amount of money that the manager wants to send to the vendor
        @recipient: Address that the money will be sent to
        @complete: True if the request has already been processed
				@approvalCount: Track of No. of people who approve the Spending request
				@approvals: Map keeps track if someone has voted or not for the request
*/

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; // Keeps a track of the number of people who approve the spending request
        mapping(address => bool) approvals; // Mapping keeps track whether someone has voted or not
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount; // No of people who have joined in to donate
		
		/* This makes sure only the manager is accessing the function */
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum) public {
        manager = msg.sender; // msg global variable and we refer to the sender property which defines who is attempting to create the contract
        minimumContribution = minimum; // This is an argument sent when the Contract is created
    }
}
```

### The Contribute Function

```solidity
function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
```

### Create a Spending Request

```solidity
/* We added restricted since we want the request
    to only be created by the manager */
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        /* Alternative Syntax for defining a struct object
        Request(description, value, recipient, false);
        */

        requests.push(newRequest);
    }
```

> **NOTE:**  We dont have to add any code to initialize a reference type like the mapping in Request Struct
> 

This Spending request needs the address of the vendor to which the manager i.e the project owner would be transferring the money to.

### Wrong Voting Mechanism

Let us assume we have the address of the contributors and an array which maintains all the contributor's address. Now to check if a new contributor is actually voting for the first time, we need to loop over the array to find that. Now this would be high gas consuming for one user, imagine 100s of contributors, the gas price would skyrocket.

That is why Array's arent preferred in Solidity as such since the looping design consumes a lot of gas if done for an array which grows unboundedly.

We would choose to use maps since it is a **Constant time search**.

### Voting Request Mechanism

In the Voting Request Mechanism, we need to ensure no one votes two times, two requirements are needed:

1. We need to track who has voted

2. We need to keep it resilient so that multiple contributors can join in.

Also, we dont need the number of "NO" votes, we just need the

Total Votes and the number of "YES" votes.

### Approve Request Mechanism

Each time a contributor calls in a Approve Request, he/she needs to pass in the index of the request they want to get approved. A contributor can decide which requests he/she wants to approve No worries about gas, since we have constant time search of Map data type.

### Approve Request Function

```solidity
function approveRequest(uint index) public {
        
        /* We used 'storage' since we dont want it to be in
        memory and not create a local copy. We want it to
        point it to the actual request in the array of
        requests */
        Request storage request = requests[index];
        
        require(approvers[msg.sender]); // We need to have the contributor in the list of the addresses
        
        /* We would check if the sender's address is added or not, this would
        tell us if the person has voted or not. If he has voted before
        then that would return TRUE and we want to exit the function
        so we reverse the require with a NOT operator */
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }
```

> We used '**storage**' since we dont want it to be in memory and not create a local copy. We want it to point it to the **actual request in the array of requests.**
> 

> We would check if the **sender's address is added or not,** this would tell us if the person has voted or not. If **he has voted before then that would return TRUE** and we want to **exit the function so we reverse the require with a NOT operator**
> 

### Finalize Request

Finalize request is meant to finalize the request after it has gotten **enough votes** and then **pay out to the vendor** with the value given in the spending request.

```solidity
function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount/2));
				// More than 50% agree to spending request
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;

    }
```

# Architechture of the Kickstarter Website using Blockchain

Created: February 17, 2022 10:47 PM

For now, we had created only one contract but that would mean nothing if we are not able to create more. We need to create more campaigns and each campaign will have a contract.

> Technically we need a **CREATE CAMPAIGN button**
> 

## 3 Ways to approach this:

### Approach 1

- User clicks ‘Create Campaign’
- We send user the contract source code ⇒ Source code to the user in the browser they are using
- User deploys contract, gets address back ⇒ Using a combination of Metamask and Web3, contract gets deployed.
- User sends us the address of newly deployed campaign ⇒ User’s browser sends the address to kind of a server which we control
- User sends us address, we publish new address on our site

> **Problem:** What if the User modifies the contract before deploying it and then do something malicious in it. Then the user deploys the malicious contract and they send the address of that faulty contract. This is a huge SECURITY HOLE
> 

### Approach 2

- User clicks ‘Create Campaign’
- We deploy a new campaign, get address back
- We publish new campaign on the site

> **Problem:** This approach would result in costing us Gas each time we deploy a contract.
> 

### Approach 3

- We create a ‘**Factory**’ Contract. It has a function to deploy a new instance of ‘Campaign’

.....Time passes.....

- User clicks ‘Create Campaign’
- We instruct web3/metamask to show user a transcation that invokes ‘Campaign Factory’ ⇒ User has to send a transcation to create the campaign from the factory
- User pays the deployment costs and the Facroty deploys a new copy of ‘Campaign’
- We tell ‘Campaign Factory’ to give us a list of all deployed campaigns.

This is a hybrid approach and is a better one since the deployment fees are paid by the User as well we dont give our contract directly to the user eliminating the security hole.

# Campaign Factory

Created: February 17, 2022 11:02 PM

![Untitled](Docs/Campaign%20F%2045ec1/Untitled.png)

```solidity
contract CampaignFactory {
    address[] public deployedCampaigns;
    /* We have to add the argument we need to deploy the campaign */
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }

}
```

> **NOTE:** We had to add another argument in the Campaign Constructor since in the Campaign Contract we have the manager set as `manager = msg.sender` which essentially means in the case of Campaign Factory that it would take in the address of the Factory which we dont want obviosly. We want the manager to be the person who invoked the Factory and not the factory
> 

```solidity
constructor(uint minimum, address creator) public {
        manager = creator; // msg global variable and we refer to the sender property which defines who is attempting to create the contract
        minimumContribution = minimum; // This would an argument sent when the Contract is created
    }
```

# UI/UX Design

Created: February 25, 2022 8:42 PM

![Untitled](Docs/UI%20UX%20Desi%20c86a0/Untitled.png)

> Campaigns Button ⇒ List of all the Campaigns
> 

Plus button also creates a Campaign

![Untitled](Docs/UI%20UX%20Desi%20c86a0/Untitled%201.png)

![Untitled](Docs/UI%20UX%20Desi%20c86a0/Untitled%202.png)

![Untitled](Docs/UI%20UX%20Desi%20c86a0/Untitled%203.png)

# Routing

![Untitled](Docs/UI%20UX%20Desi%20c86a0/Untitled%204.png)
