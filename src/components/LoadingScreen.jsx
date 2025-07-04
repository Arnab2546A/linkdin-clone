import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingScreen = () => {
  return (
    <Container>
      <LogoContainer>
        <Logo src="/images/login-logo.svg" alt="LinkedIn Logo" />
        <LoadingBar>
          <Progress />
        </LoadingBar>
      </LogoContainer>
    </Container>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const loadingAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  animation: ${fadeIn} 0.3s ease-in;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 135px;
  margin-bottom: 24px;
`;

const LoadingBar = styled.div`
  width: 135px;
  height: 4px;
  background-color: #f3f2ef;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const Progress = styled.div`
  position: absolute;
  height: 100%;
  width: 50%;
  background-color: #0a66c2;
  border-radius: 2px;
  animation: ${loadingAnimation} 1.5s infinite ease-in-out;
`;

export default LoadingScreen;