Moralis.Cloud.define("getSVG", async (request) => {

    let web3 = Moralis.web3ByChain("0x89"); // matic
    const CONTRACT_ADDRESS = "0xb301cB9DE0D9803b8EBbc6174Fb5b8B9B4268bCF";

    
    let CONTRACT_ABI = []

    const contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS);

    const hauntId = 2;
    const collateralAddress = "0x9719d867a500ef117cc201206b8ab51e794d3f82"; //maUSDC
      
});