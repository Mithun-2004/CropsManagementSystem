import './App.css';
import {Routes, Route} from 'react-router-dom';

import IndexPage from './Pages/Indexpage';
import FarmerPages from './Pages/FarmerPages';
import AdminPages from './Pages/AdminPages';
import Layout from './components/Layout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<IndexPage />} />
          <Route path="/admin/*" element={<Layout><AdminPages /></Layout>} />
          <Route path="/farmer/*" element={<Layout><FarmerPages /></Layout>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
