pragma solidity ^0.4.25;

/* Request Struct
        @description: Describes why the request is created
        @value: Amount of money that the manager wants to send to the vendor
        @recipient: Address that the money will be sent to
        @complete: True if the request has already been processed
*/

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

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public {
        manager = creator; // msg global variable and we refer to the sender property which defines who is attempting to create the contract
        minimumContribution = minimum; // This would an argument sent when the Contract is created
    }

    /* Someone wnats to send money to our contract */
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    /* We added restricted since we want the request
    to only be created by the manager */
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0 // We dont have to add any code to initialize a reference type like the mapping in Request Struct
        });

        /* Alternative Syntax for defining a struct object
        Request(description, value, recipient, false);
        */

        requests.push(newRequest);
    }

    /* In the Voting Request Mechanism, we need to ensure
    no one votes two times, two requirements are needed:
    1. We need to track who has voted
    2. We need to keep it resilient so that multiple contributors
        can join in.

    Also, we dont need the number of "NO" votes, we just need the
    Total Votes and the number of "YES" votes.
    */

    /* Approve Request Mechanism
    Each time a contributor calls in a Approve Request, he/she
    needs to pass in the index of the request they want to get
    approved. A contributor can decide which requests he/she
    wants to approve

    No worries about gas, since we have constant time search of
    Map data type
    */

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

    /* Finalize request is meant to finalize the request
    after it has gotten enough votes and then pay out to the
    vendor with the value given in the spending request */
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount/2)); // More than 50% agree to spending request
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;

    }

}

/* Data Holding Places

Storage: Holds data b/w function calls (like a Computer Hard Drive)
Memory: Temporary place to store data (Computer RAM)

Function arguments can be called as Memory type data holding
place since the arguments get lost once the function exits
and is lost in the void

int[] storage new_array = old_array => In this, "storage"
points to the head of the old_array and any change made in
the new_array is reflected in the old_array

int[] memory new_array = old_array => In this, "memory"
makes a new copy of the old_array and the head of new_array
points to this local copy which gets dumped after the function
exits

*/

/* Wrong Voting System

Let us assume we have the address of the contributors and an
array which maintains all the contributor's address. Now to check
if a new contributor is actually voting for the first time,
we need to loop over the array to find that. Now this would be
higly gas consuming for one user, imagine 100s of contributors,
the gas price would skyrocket.

That is why Array's arent preferred in Solidity as such since the
looping design consumes a lot of gas if done for an array which
grows unboundedly.

We would choose to use maps since it is a Constant time search

*/

/* Mapping

In Solidity Mapping:

1. Keys are not stored
One cannot retrive the list of all the keys present in the map
in Solidity. Inside here, if we provide a key, it goes into a
hash function and points to a certain index based on the output of
the hash function

2. Values are not iterable
One cannot iterate over all the values present in the map since
we cannot store the keys

3. There is nothing as undefined
Even if we provde a wrong key it would point towards a Null value
which is present in the map unanimously

*/