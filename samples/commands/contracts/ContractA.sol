pragma solidity >=0.5.0 <0.6.0;

import "./ContractB.sol";
import "./ContractC.sol";

contract ContractA {
    ContractB b;
    ContractC c;
    
    constructor() public {
        b = new ContractB();
        c = new ContractC();
    }
    
    function() external payable { }
    
    function invoke() public {
        b.invoke();
        c.invoke();
    }
    
    function transfer(address payable receiver, uint amount) public {
        receiver.transfer(amount);
    }
}


