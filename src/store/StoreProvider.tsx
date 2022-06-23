import React from 'react';
import AuthStore from './AuthStore';
import ResourceStore from './ResourceStore';

interface IStore {
  auth: AuthStore;
  resourceStore: ResourceStore;
}

export const store: IStore = {
  auth: new AuthStore(),
  resourceStore: new ResourceStore(),
};

const StoreContext = React.createContext<IStore>(store);

const StoreProvider: React.FC<{ store: IStore; children: React.ReactNode }> = ({ store, children }) => {
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     store.writeBlock();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [store]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  return React.useContext(StoreContext);
};

export default StoreProvider;
