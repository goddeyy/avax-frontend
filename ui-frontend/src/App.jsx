import { useContext, useEffect, useState } from 'react';
import './App.css';
import WalletContext from './context/WalletContext';
import { ethers } from 'ethers';
// import toast, { Toaster } from 'react-hot-toast';
import {toast} from "react-toastify";

function App() {
  const { account, connectWallet, eth, contract, contractAddr } = useContext(WalletContext);
  const [balance, setBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLimit, setWithdrawLimit] = useState('');
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const loadBalances = async () => {
      if (contract && account) {
        try {
          // Get user balance
          const userBalance = await contract.balances(account);
          setBalance(ethers.formatEther(userBalance));

          // Get contract balance
          const contractBal = await eth.getBalance(contractAddr);
          setContractBalance(ethers.formatEther(contractBal));
        } catch (error) {
          console.error('Error loading balances:', error);
        }
      }
    };
    loadBalances();
    setUpdate(false);
  }, [contract, account, contractAddr, update]);

  const deposit = async () => {
    try {
      const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) });
      await tx.wait();
      toast("Deposited successfully");
      setUpdate(true);
    } catch (error) {
      console.error('Deposit error:', error);
      toast(error.message)
    }
  };

  const withdraw = async () => {
    try {
      const tx = await contract.withdraw(ethers.parseEther(withdrawAmount));
      await tx.wait();
      toast("Deposited successfully");
      setUpdate(true);
    } catch (error) {
      console.error('Withdraw error:', error);
      toast(error.message);
    }
  };

  const setLimit = async () => {
    try {
      const tx = await contract.setWithdrawLimit(ethers.parseEther(withdrawLimit));
      await tx.wait();
      toast("Withdraw limit set to:", withdrawLimit)
    } catch (error) {
      console.error('Set limit error:', error);
      toast(error.message)
    }
  };

  const loadBalances = async () => {
    if (contract && account) {
      try {
        // Get user balance
        const userBalance = await contract.balances(account);
        setBalance(ethers.formatEther(userBalance));

        // Get contract balance
        const provider = contract.provider;
        const contractBal = await provider.getBalance(contractAddr);
        setContractBalance(ethers.formatEther(contractBal));
      } catch (error) {
        console.error('Error loading balances:', error);
      }
    }
  };

  return (
    <div>
      {account ? (
           <div>
           <h1>Wallet DApp</h1>
           <p>Account: {account}</p>
           <p>Balance Deposited: {balance} ETH</p>
           <p>Contract Balance: {contractBalance} ETH</p>
           <div>
             <h2>Deposit</h2>
             <input
               type="number"
               value={depositAmount}
               onChange={(e) => setDepositAmount(e.target.value)}
             />
             <button onClick={deposit}>Deposit</button>
           </div>
           <div>
             <h2>Withdraw</h2>
             <input
               type="number"
               value={withdrawAmount}
               onChange={(e) => setWithdrawAmount(e.target.value)}
             />
             <button onClick={withdraw}>Withdraw</button>
           </div>
           <div>
             <h2>Set Withdraw Limit</h2>
             <input
               type="number"
               value={withdrawLimit}
               onChange={(e) => setWithdrawLimit(e.target.value)}
             />
             <button onClick={setLimit}>Set Limit</button>
           </div>
         </div>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
      {/* <Toaster /> */}
    </div>
  );
}

export default App;
