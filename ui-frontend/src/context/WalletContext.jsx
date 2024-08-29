import { Contract, JsonRpcSigner } from "ethers";
import { BrowserProvider } from "ethers";
import { createContext, useEffect, useState } from "react";
import abi from "../abi.json";
import { Network } from "ethers";

const WalletContext = createContext({
  account: "",
  connectWallet: () => {},
  contract: undefined,
});

const contractAddr = "";

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [eth, setEth] = useState();
  const [contract, setContract] = useState();

  const initWallet = async () => {
    const provider = new BrowserProvider(window.ethereum);
    if (provider) {
      setEth(provider);
    }
  };

  const connectWallet = async () => {
    if (eth) {
      const signer = await eth.getSigner();

      const network = await eth.getNetwork();

      if (network.chainId !== Network.from("sepolia").chainId) {
        await eth.send("wallet_addEthereumChain", [
          {
            chainId: "0xaa36a7",
          },
        ]);
      }

      setAccount(signer.address);

      getContract(signer);
    }
  };

  const getContract = async (signer) => {
    const contract = new Contract(contractAddr, abi, signer);
    setContract(contract);
  };

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
        eth,
        contract,
        contractAddr
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;