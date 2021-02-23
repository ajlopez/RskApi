pragma solidity >=0.5.0 <0.6.0;

import "./Counter.sol";

contract CallWithGas {
    function increment(Counter counter) public {
        counter.increment.gas(1000000)();
    }
}

