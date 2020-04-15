pragma solidity >=0.5.0 <0.6.0;

import "./RecursiveInterface.sol";

contract RecursiveChild is RecursiveInterface {
    uint public counter;
    RecursiveInterface public recursive;
    
    constructor (RecursiveInterface parent) public {
        recursive = parent;
    }
    
    function increment(uint level) public {
        if (level == 0)
            return;
            
        counter++;
        
        recursive.increment(level - 1);
    }
}

