import './App.css'
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

function App() {
  const contractAddress = "0xBc41B49b314154cb74B502a2d76B7b8B378C8daa";
  const contractABI = abi.abi;
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  const getAllWavess = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, provider);
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            // timestamp: new Date(Number(wave.timestamp) * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }


  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async (message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", Number(count));

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", Number(count));

        await getAllWavess() 
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const account = findMetaMaskAccount()
    findMetaMaskAccount().then(async (account) => {
      if (account !== null) {
        setCurrentAccount(account);
        await getAllWavess();
      }
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedbackMessage = document.getElementById('feedback').value;
    await wave(feedbackMessage);
    document.getElementById('feedback').value = '';
  };

  return (
    <>
    <div className='container'>
      <h1 className='title'>Feedback DApp</h1>
      {
        currentAccount ? 
          (<div className='welcome'>Welcome {currentAccount}</div>) 
          :
          (<button className='connect-wallet-btn' onClick={connectWallet} >Connect Wallet</button>)
      }
      <form onSubmit={handleSubmit}>
        <div className='feed'>
          <label className='feedback' htmlFor="feedbackMessage"><b>Feedback Message:</b></label>
          <textarea id="feedback" name="feedbackMessage" rows="4" required></textarea>
        </div>
        <button type="submit" className="submit-btn">Submit Feedback</button>
      </form>
      {allWaves.map((wave, index) => {
        return (
          <div key={index} style={{color: "#000814", backgroundColor: "#9a8c98", marginTop: "16px", padding: "8px 15%" }}>
            <div className='message'> <b>Message: </b> {wave.message}</div>
            <div className='address'><b>Address: </b> {wave.address}</div>
            {/* <div className='time'><b>Time: </b> {wave.timestamp.toString()}</div> */}
          </div>)
      })}
      </div>
    </>
  )
}

export default App
