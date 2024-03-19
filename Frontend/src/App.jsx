import './App.css'
import React, { useEffect, useState } from "react";

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
  const [currentAccount, setCurrentAccount] = useState("");

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

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
  }, []);

  return (
    <>
    <div className='container'>
      <h1 className='title'>Feedback DApp</h1>
      {
        currentAccount ? 
          (<div>Welcome {currentAccount}</div>) 
          : 
          (<button className='connect-wallet-btn' onClick={connectWallet} >Connect Wallet</button>)
      }
      <form>
        <div>
          <label htmlFor="feedbackMessage">Feedback Message:</label>
          <textarea id="feedback" name="feedbackMessage" rows="4" required></textarea>
        </div>
        <button type="submit" className="submit-btn">Submit Feedback</button>
        <div className='feedbacks' id='feedbacks'></div>
      </form>
    </div>
    </>
  )
}

export default App
