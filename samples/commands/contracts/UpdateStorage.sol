pragma solidity >=0.5.0 <0.6.0;

contract UpdateStorage {
    uint[100] public values;
    
    function setValue(uint position, uint value) public {
        values[position] = value;
    }
}