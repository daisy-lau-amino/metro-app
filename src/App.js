import React from 'react';
import Header from './components/Header';
import TrainList from './components/TrainList';

class App extends React.Component {
  render () {
    return (
      <div className="app">
        <Header />
        <TrainList />
      </div>
    );
  }
}

export default App;
