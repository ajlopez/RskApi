pragma solidity >=0.5.0 <0.6.0;

contract Counter {
    uint public counter;
    
    function increment() public {
        counter++;
    }
    
    function add(uint value) public {
        require(value != 0, "value should not be zero");
        counter += value;
    }
    
    function incrementFail() public {
        counter++;
        require(false, "fail error");
    }
    
    function fail() public pure {
        require(false, "fail error");
    }
}


