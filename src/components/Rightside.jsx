import React from 'react'
import styled from 'styled-components'
const Rightside = () => {
  return (
      <Container>
        <FollowCard>
            <Title>
               <h2>Add to your feed</h2> 
                <img src="/images/feed-icon.svg" alt="Feed Icon" />
            </Title>
            <FeedList>
                <li>
                    <a>
                        <Avatar/>
                        </a>
                        <div>
                            <span>#Linkedin</span>
                            <button>Follow</button>
                        </div>
                </li>
                <li>
                    <a>
                       <Avatar/>
                    </a>
                    <div>
                        <span>#Video</span>
                        <button>Follow</button>
                    </div>
                </li>
            </FeedList>
            <Recommendattion>
                View all recommendations
                <img src=" /images/right-icon.svg" alt="Right Icon" />
            </Recommendattion>
        </FollowCard>
        <BannerCard>
                <img  src="/images/jobs_linkdin.jpg" alt="Banner Image" />
            </BannerCard>
      </Container>
  )
}
const Container = styled.div`
grid-area: rightside;
`
const FollowCard = styled.div`
text-align: center;
overflow: hidden;
background-color: #fff;
margin-bottom: 8px;
border-radius: 5px;
position:relative;
border:none;
box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
padding: 12px;
`
const Title = styled.div`
display: inline-flex;
align-items: center;
justify-content: space-between;
font-size: 16px;
width: 100%;
color: rgba(0, 0, 0, 0.6);
`
const FeedList = styled.ul`
margin-top: 16px;
li {
    display: flex;
    align-items:center;
    margin: 12px 0;
    position: relative;
    font-size: 14px;
    & > div{
        display: flex;
        flex-direction: column;
        justify-content: center;

        button{
        background-color: transparent;
        color: rgba(0, 0, 0, 0.6);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.6);
        padding:16px;
        align-items: center;
        border-radius: 15px;
        box-sizing: border-box;
        font-weight: 600;
        display: inline-flex;
        justify-content: center;
        max-height: 32px;
        max-width: 480px;
        text-align: center;
        outline: none;
        border:none;
    }
    }
    
}
`
const Avatar = styled.div`
background-image: url("https://static-exp1.licdn.com/sc/h/1b4vl1r54ijmrmcyxzoidwmxs");
background-size: contain;
background-repeat: no-repeat;
background-position: center;
width: 48px;
height: 48px;  
margin-right: 8px;
`
const Recommendattion = styled.a`
color: #0a66c2;
display:flex;
align-items:center;
font-size: 14px;
`
const BannerCard = styled(FollowCard)`
img{
    width:100%;
    height: 100%;
}
`
export default Rightside
