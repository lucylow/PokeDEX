

// Get this from moralis testnet BSC HECO 
Moralis.initialize("jcf85HkY4wpqeqdj06igwaZCLF29k9NMhedN8rqx"); // Application id from moralis.io
Moralis.serverURL = "https://ciznrccklreb.usemoralis.com:2053/server"; //Server url from moralis.io

const nft_contract_address = "0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431" 
/*
Available deployed contracts
BSC Testnet 0x88624DD1c725C6A95E223170fa99ddB22E1C6DDD
*/
initializeWeb3()
const web3 = new Web3(window.ethereum);


//Step 1 Initialize Web3
async function initializeWeb3(){ 
    Moralis.authenticate();
    activateControls();
}

function activateControls() {
    document.getElementById("characterName").removeAttribute("disabled");
    document.getElementById("getCharacter").removeAttribute("disabled");
}

//Step 2 Generate Pokemon
async function getCharacter(){
    const configArray = getRandomValues();
    const characterIndex = (configArray[0]%5)+1;
    const weaponIndex = (configArray[1]%5)+1;
    const character = await mapCharacter(characterIndex);
    const weapon = mapCharacterWeapon(weaponIndex);
    const characterName = document.getElementById("characterName").value
    const metadata = {
        "name":characterName,
        "role":character["Role"],
        "image":character["URI"],
        "weapon":weapon,
        "attack":(configArray[2]%100)+1,
        "defense":(configArray[3]%100)+1
    }
    const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    await metadataFile.saveIPFS();
    const metadataURI = metadataFile.ipfs();
    displayNFT(metadataURI);
    const txt = await mintToken(metadataURI).then(console.log)
}

function getRandomValues(){
    let array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    return array;
}

async function mapCharacter(characterIndex){
    const images = await fetch("static/ipfsCollection.json")
    const ipfsUris = await images.json()
    const role = {
        1:"BlazeBug",
        2:"ButterSaur",
        3:"LovelyPuff",
        4:"MimiSnail",
        5:"ScatterSage"
    }
    return {"Role":role[characterIndex],"URI":ipfsUris[characterIndex]}
}

function mapCharacterWeapon(weaponIndex){
    weapons = {
        1:"Thunderbolt",
        2:"AeroBlast",
        3:"CrabHammer",
        4:"IceVortex",
        5:"SuperSonic"
    }
    return weapons[weaponIndex];
}

async function displayNFT(metadataUri){
    const metadata = await fetch(metadataUri);
    nftData = await metadata.json();
    nftNameTag = `<h4>${nftData["name"]}</h4>`
    nftImageTag = `<div class="container">
                        <div class="col-sm-">                
                            <img src=${nftData["image"]} class="img-fluid" >
                        </div>
                    </div>`
    nftRoleTag = `<h5>Role: ${nftData["role"]}</h5>`
    nftWeaponTag = `<h5>Weapon of Choice: ${nftData["weapon"]}</h5>`
    nftAttackTag = ` <h5>Attack Skill</h5>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${nftData["attack"]}%"></div>
                    </div>`
    nftDefenseTag = `<h5>Defense Skill</h5>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${nftData["defense"]}%"></div>
                    </div>`              
    document.getElementById("displayNFT").innerHTML = ""
    document.getElementById("displayNFT").innerHTML += nftNameTag;
    document.getElementById("displayNFT").innerHTML += nftImageTag;
    document.getElementById("displayNFT").innerHTML += nftRoleTag;
    document.getElementById("displayNFT").innerHTML += nftWeaponTag;
    document.getElementById("displayNFT").innerHTML += nftAttackTag;
    document.getElementById("displayNFT").innerHTML += nftDefenseTag;
}


async function mintToken(_uri){
  const encodedFunction = web3.eth.abi.encodeFunctionCall({
    name: "mintToken",
    type: "function",
    inputs: [{
      type: 'string',
      name: 'tokenURI'
      }]
  }, [_uri]);

  const transactionParameters = {
    to: nft_contract_address,
    from: ethereum.selectedAddress,
    data: encodedFunction
  };
  const txt = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters]
  });
  return txt
}

