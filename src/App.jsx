import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { connect } from 'react-redux';
import LoadingScreen from './components/LoadingScreen';
import { getUserAuth } from './actions'; // Import your auth action

function App(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    props.getUserAuth();
    
    // Set a minimum loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={props.user ? <Navigate to="/home" /> : <Login />} />
          <Route 
            path="/home" 
            element={props.user ? <Home /> : <Navigate to="/" />} 
          />
        </Routes>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);