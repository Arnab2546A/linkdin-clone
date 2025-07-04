import React from 'react'
import styled from 'styled-components'
import { IoSearchSharp } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { connect } from "react-redux";
import { signOutAPI } from "../actions/index.js";
const Header = (props) => {
    console.log(props.user);
  return (
    <>
      <Container>
        <Content>
            <Logo>
                <a href="/home">
                    <img src="/images/home-logo.svg" alt="LinkedIn Logo" />
                </a>
            </Logo>
            <Search>
                <div>
                    <input type="text" placeholder="Search" />
                </div>
                <SearchIcon>
                    <IoSearchSharp style={{ width: '37px', height: '22px' , marginTop: '2.5px'}}/>
                </SearchIcon>
            </Search>
            <Nav>
                <NavListWrap>
                    <NavList className='active'>
                     <a>
                       <IoHomeSharp />
                       <span>Home</span>
                        </a>   
                    </NavList>

                    <NavList>
                     <a>
                       <img src="/images/nav-network.svg" alt="LinkedIn Network" />
                       <span>My Network</span>
                        </a>   
                    </NavList>

                    <NavList>
                     <a>
                       <img src="/images/nav-jobs.svg" alt="LinkedIn Jobs" />
                       <span>Jobs</span>
                        </a>   
                    </NavList>

                    <NavList>
                     <a>
                       <img src="/images/nav-messaging.svg" alt="LinkedIn Messaging" />
                       <span>Messaging</span>
                        </a>   
                    </NavList>

                    <NavList>
                     <a>
                       <img src="/images/nav-notifications.svg" alt="LinkedIn Network" />
                       <span>Notifications</span>
                        </a>   
                    </NavList>
                    <User>
                        <a>
                            {props.user&& props.user.photoURL ?
                            <img src={props.user.photoURL} alt="User Profile" /> :
                                <img src="/images/user.svg" alt="User Profile" />}
                            <span>
                                Me
                                <img src="/images/down-icon.svg" alt="Dropdown Icon" />
                            </span>
                            
                        </a>
                        <SignOut onClick={() => props.signOutAPI()}>
                            <a style={{fontSize: '14px'}}>
                              Sign Out  
                            </a>
                        </SignOut>
                    </User>
                    <Work>
                        <a>
                            <img src="/images/nav-work.svg" alt="LinkedIn Work" />
                            <span>
                                Work
                                <img src="/images/down-icon.svg" alt="Dropdown Icon" />
                            </span>
                        </a>
                    </Work>
                </NavListWrap>
            </Nav>
        </Content>
      </Container>
      </>
  )
}
const Container=styled.div`
background-color: white;
border-bottom: 1px solid rgba(0,0,0,0.08);
left: 0;
padding: 0 24px;
position: fixed;
top: 0;
width: 100vw;
z-index: 100;
`
const Content=styled.div`
display: flex;
align-items: center;
margin: 0 auto;
max-width: 1128px;
min-height: 100%;
`
const Logo=styled.span`
margin-right: 8px;
font-size: 0px;
`
const Search=styled.div`
opacity: 1;
flex-grow: 1;
position: relative;
&> div {
    max-width: 280px;
    input{
        border: none;
        box-shadow: none;
        background-color: #eef3f8;
        border-radius: 20px;
        color: rgba(0,0,0,0.9);
        width: 281px;
        padding: 0 8px 0 40px;
        line-height: 1.75;
        font-weight: 400;
        font-size: 14px;
        height: 34px;
        vertical-align: text-top;
        outline: none; /* Removes default blue outline */
         box-sizing: border-box;  
    }
    input:focus {
        border: 2px solid #0a66c2; /* Blue border on focus */
        background-color: #fff;       
    }
}
`
const SearchIcon=styled.div`
width: 40px;
position: absolute;
z-index: 1;
top: 5px;
left: 2px;
border-radius: 0 2px 2px 0;
margin: 0;
pointer-events: none; 
display: flex;
justify-content: center;
align-items: center;
transition: background-color 0.15s;

`
const Nav=styled.nav`
margin-left: auto;
display: block;
@media (max-width: 768px){
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
}
`
const NavListWrap=styled.ul`
display: flex;
flex-wrap: nowrap;
list-style-type: none;
.active{
    span:after{
      content:"";
        transform: scaleX(1);
        display: block;
        width: 100%;
        border-bottom: 2px solid var(--white,#fff);
        bottom:0;
        left: 0;
        position: absolute;
        transition: transform 0.2s ease-in-out;
        border-color: rgba(0,0,0,0.9);
}
}
`
const NavList=styled.li`
list-style: none;
display: flex;
align-items: center;
position: relative;
a{
    display: flex;
    align-items: center;
    background: transparent;
    flex-direction: column;
    font-size: 19px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 52px;
    min-width: 80px;
    text-decoration: none;
    span{
        color: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 500px;
        position: relative;
        
    }
    @media(max-width: 768px){
        min-width: 70px;
    }
}
&:hover, &:active {
    a{
       span{
        color: rgba(0,0,0,0.9);
       } 
    }
}

`
const SignOut=styled.div`
position: absolute;
top: 45px;
background: white;
border-radius: 0 0 5px 5px;
width: 100px;
height: 40px;
font-size: 16px;
transition-duration: 167ms;
display: none;
  /* box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 6px 9px rgb(0 0 0 / 20%); */
   @media (max-width: 768px) {
    position: absolute;
    top: -45px;
    right: 15px;
    width: 100px;
    border-radius: 5px;
  }
  &:hover{
    cursor: pointer;
  }
`
const User=styled(NavList)`
/* a > svg{
    width: 24px;
    border-radius: 50%;
} */
a >img{
    width:24px;
    height: 24px;
    border-radius: 50%;
}
span{
    display: flex;
    align-items: center;
}
&:hover{
    ${SignOut}{
        align-items: center;
        display: flex;
        justify-content: center;
    }
}
/* @media (max-width: 768px) {
    position: relative;
  } */
`
const Work=styled(User)`
border-left: 1px solid rgba(0,0,0,0.08);
`
const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        signOutAPI: () => dispatch(signOutAPI()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
