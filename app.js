ethereum.autoRefreshOnNetworkChange = false;
ethereum.enable();
const provider = new ethers.providers.Web3Provider(window.ethereum);
console.log(provider);
const signer = provider.getSigner();
const contractAddress = "0xd7ea705d009157326f31890fce0b47739d3225ce";
const contractABI = [
    "function reward(uint256 amt) public"
];
const contractAddress721 = "0x722eE1576Aa33aC8FE71EC45f32DdF4c3b56571E";
const contractABI721 = [
  "function awardItem(address player, string memory tokenURI) public",
  "function balanceOf(address account) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function tokenByIndex(uint256 index) public view returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

const contract =  new ethers.Contract(contractAddress, contractABI, provider);
const tokenWithSigner = contract.connect(signer);

const contract721 = new ethers.Contract(contractAddress721, contractABI721, provider);
const tokenWithSigner721 = contract721.connect(signer);
// tokenWithSigner.reward(10);

const secretWord = "cool";
let address;
const badgeURI = `{"imageURL": "https://linktothepng.com/badge.png"}`


main();


async function main() {
  address = await signer.getAddress();
  let balance = await contract721.balanceOf(address);
  balance = +balance;


  $('.secret-word-button').click(function(){

    if(balance > 0) {
      $('.secret-word-output').text("You are already a member");
    } else {
      let inputWord = $('.secret-word-input').val().toLowerCase();

      if(inputWord == secretWord){
        $('.secret-word-output').text("");
        tokenWithSigner721.awardItem(address, badgeURI);
      } else {
        $('.secret-word-output').text("Incorrect word");
      }
    }
  })
}


///////////p5 code ///////////
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'models/tm-my-image-model/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confidence = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  let cnv = createCanvas(640, 500);
  cnv.parent("#sketch");

  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  push();
  scale(2, 2);
  image(flippedVideo, 0, 0);
  pop();

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label + " , " + confidence, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

let shouldReward = true;
// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  confidence = results[0].confidence;


  //what I need to initiate a transaction

  if(results[0].label == "religious" && results[0].confidence > 0.95 && shouldReward){
    shouldReward = false;
    tokenWithSigner.reward(10);

    }
  // Classifiy again!
  classifyVideo();
}