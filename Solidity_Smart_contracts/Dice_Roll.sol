// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import "smartcontractkit/chainlink-brownie-contracts@1.0.2/contracts/src/v0.6/VRFConsumerBase.sol";

contract dice_roll is VRFConsumerBase {
    using SafeMathChainlink for uint256;

    uint256 private constant ROLL_IN_PROGRESS = 42;

    bytes32 private s_keyHash;
    uint256 private s_fee;
    mapping(bytes32 => address) private s_rollers;
    mapping(address => uint256) private s_results;

    event DiceRolled(bytes32 indexed requestId, address indexed roller);
    event DiceLanded(bytes32 indexed requestId, uint256 indexed result);

    constructor(address vrfCoordinator, address link, bytes32 keyHash, uint256 fee)
        public
        VRFConsumerBase(vrfCoordinator, link)
    {
        s_keyHash = keyHash;
        s_fee = fee;
        
    }

    function rollDice(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        address roller = msg.sender;
        require(LINK.balanceOf(address(this)) >= s_fee, "Not enough LINK to pay fee");
        require(s_results[roller] == 0, "Already rolled");
        requestId = requestRandomness(s_keyHash, s_fee, userProvidedSeed);
        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d10Value = randomness.mod(10).add(1);
        s_results[s_rollers[requestId]] = d10Value;
        emit DiceLanded(requestId, d10Value);
    }
    //  fighting
    function PokemonRace() public view returns (string memory) {
        address player = msg.sender;
        require(s_results[player] != 0, "Pokemon battle not in progress");
        require(s_results[player] != ROLL_IN_PROGRESS, "Pokemon battle in progress");
        return getPokemonRace(s_results[player]);
    }

    function getPokemonRace(uint256 id) private pure returns (string memory) {
        string[10] memory PokemonRaces = [
            "Fight",	
            "Bag",
            "Run",	
            "Evolve",
            "Use Item",	
            "Switch Pokemon",	
            "Restore HP",	
            "Withdrawl",	
            "Sleep", 	
            "Z-Move"
        ];
        return PokemonRaces[id.sub(1)];
    }
}
