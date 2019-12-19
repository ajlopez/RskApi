pragma solidity >=0.5.0 <0.6.0;

contract Extended {
    function extended() public {
        assembly {
            log1(42,0,1)
        }
    }
}