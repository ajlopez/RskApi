pragma solidity >=0.5.0 <0.6.0;

contract CallWithValue {
    function () external payable { }

    function callWithValue() public payable {
        address(this).transfer(100);
    }
}

