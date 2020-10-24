pragma solidity >= 0.4.22 < 0.70;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract WOTFcoin is ERC20 {
    constructor() public ERC20("WOTFcoin","WTF") {
        
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
        _transfer(msg.sender, address(this), 5000 * (10 ** uint256(decimals())));
        
    }
    
    function reward(uint256 amt) public {
        uint256 contractBalance = balanceOf(address(this));
        require(amt > 0, "No reward??");
        require(amt <= contractBalance, "Not enough tokens in reserve");
        _transfer(address(this), msg.sender, amt);
        
    }
}