pragma solidity >=0.5.0 <0.6.0;

import "./ContractC.sol";

contract ContractB {
    ContractC c;
    
    constructor() public {
        c = new ContractC();
    }
    
    function invoke() public {
        c.invoke();
    }
}


