import './App.css';
import { Container } from 'react-bootstrap'

import Header from './components/Header'
import Datatable from './components/Datatable'

function App() {
  return (
    <Container className="App" fluid="md">
      <Header />
      <Datatable />
    </Container>
  );
}

export default App;
