import './App.css';
import { Switch, Route} from 'react-router-dom';
import Home from './customer/Admin';
import Create from './customer/Create';
import Edit from './customer/Edit'

function App() {
  return (
    <div className="App">
     
        <Switch>
          <Route path={'/'} exact component={Home} />
          <Route path={'/create'} exact component={Create} />
         <Route path={'/edit/:id'} exact component={Edit} /> 
        </Switch>
      
    </div>
  );
}

export default App;
