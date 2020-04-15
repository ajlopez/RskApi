pragma solidity >=0.5.0 <0.6.0;

import "./RecursiveInterface.sol";
import "./RecursiveChild.sol";

contract RecursiveParent is RecursiveInterface {
    uint public counter;
    RecursiveChild public recursive;
    
    constructor() public {
        recursive = new RecursiveChild(this);
    }
    
    function increment(uint level) public {
        if (level == 0)
            return;
            
        counter++;
        
        recursive.increment(level - 1);
    }
}

