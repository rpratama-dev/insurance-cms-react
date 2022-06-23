import { useRoutes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from './store/StoreProvider';
import routes from './routes';
import './App.css';
import 'antd/dist/antd.css';

function App() {
  const store = useStore();
  const routing = useRoutes(routes(store.auth.session.isLogedIn));

  return <>{routing}</>;
}

export default observer(App);
