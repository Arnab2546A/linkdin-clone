import React, { useState, useEffect, useRef } from 'react';
import { FadeLoader } from "react-spinners";
import styled from "styled-components";
import { LuEllipsis } from "react-icons/lu";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { BiRepost } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import PostModal from './PostModal';
import { connect } from 'react-redux';
import { postArticleAPI } from '../actions';
import { BiSolidLike } from "react-icons/bi";
import { getSupabasePosts, deleteSupabasePost, toggleLikePost } from '../api/supabasePosts'; // <-- import this

const Main = (props) => {
    const [showModal, setShowModal] = useState("close");
    const [posts, setPosts] = useState([]);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const videoRefs = useRef({});
    const fetchPosts = async () => {
        try {
            const data = await getSupabasePosts();
            setPosts(data || []);
            console.log("Fetched posts:", data);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
    };

    const handleClick = (e) => {
        if (e) e.preventDefault();
        setShowModal(showModal === "open" ? "close" : "open");
    };

    const handleDelete = async (id) => {
        if (!id) {
          console.error("No id provided for delete!");
          return;
        }
      
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteSupabasePost(id);
                fetchPosts();
            } catch (err) {
                alert("Failed to delete post!");
            }
        }
    };

    const handleLike = async (post) => {
        if (!props.user) return;
        try {
            await toggleLikePost(post, props.user.email);
            fetchPosts(); // Refresh posts to update like count and color
        } catch (err) {
            alert("Failed to like/unlike post!");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        return () => {
          videoRefs.current = {};
        };
      }, []);

  return (
    <Container>
      <SharedBox>
        <div>
          {props.user && props.user.photoURL ? (
            <img src={props.user.photoURL} alt="User Icon" />
          ) : (
            <img src="/images/user.svg" alt="User Icon" />
          )}
          <button onClick={handleClick}>Start a post</button>
        </div>

        <div>
          <button>
            <img src="/images/video.png" alt="Video Icon" />
            <span>Video</span>
          </button>
          <button>
            <img src="/images/photo-linkdin.png" alt="Photo Icon" />
            <span>Photo</span>
          </button>
          <button>
            <img src="/images/article.png" alt="Event Icon" />
            <span>Write Article</span>
          </button>
        </div>
      </SharedBox>
      <div>
        {posts.map((post) => (
          <Article key={post.id}>
            <SharedActor>
              <a>
                {post.user_photo ? (
                  <img src={post.user_photo} alt="User Icon" />
                ) : (
                  <img src="/images/user.svg" alt="User Icon" />
                )}
                <div>
                  <span>{post.username}</span>
                  <span>{post.email}</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </a>
              {/* Only show 3-dots and delete menu if this is the user's own post */}
              {props.user && post.email === props.user.email && (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <ThreeDots
                    onClick={() =>
                      setMenuOpenId(menuOpenId === post.id ? null : post.id)
                    }
                    style={{
                      
                    }}
                  >
                    <LuEllipsis />
                  </ThreeDots>
                  {menuOpenId === post.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: '0px',
                        top: "30px",
                        background: "#fff",
                        zIndex: 10,
                        minWidth: "100px",
                        
                      }}
                    >
                      <DeleteButton
                        className="delete"
                        onClick={() => {
                          setMenuOpenId(null);
                          handleDelete(post.id);
                        }}
                      >
                        Delete
                      </DeleteButton>
                    </div>
                  )}
                </div>
              )}
              {/* For other users' posts, show just the 3-dots without menu or nothing at all */}
              {props.user && post.email !== props.user.email && (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <ThreeDots
                    onClick={() =>
                      setMenuOpenId(menuOpenId === post.id ? null : post.id)
                    }
                  >
                    <LuEllipsis />
                  </ThreeDots>
                  {menuOpenId === post.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: '0px',
                        top: "30px",
                        background: "#fff",
                        zIndex: 10,
                        minWidth: "100px",
                      }}
                    >
                      <DeleteButton
                        className="delete"
                        onClick={() => {
                          setMenuOpenId(null);
                          // No action for now
                        }}
                      >
                        Report
                      </DeleteButton>
                    </div>
                  )}
                </div>
              )}
            </SharedActor>
            <Description>{post.description}</Description>
            {post.media_url && (
              <ShareImg>
                {post.media_url.endsWith(".mp4") ||
                post.media_url.endsWith(".webm") ? (
                  <video
                    controls
                    src={post.media_url}
                    ref={el => videoRefs.current[post.id] = el}
                    onPlay={() => {
                      Object.entries(videoRefs.current).forEach(([id, vid]) => {
                        if (id !== post.id.toString() && vid) {
                          vid.pause();
                          vid.currentTime = 0;
                        }
                      });
                      setPlayingVideoId(post.id);
                    }}
                  />
                ) : (
                  <img src={post.media_url} alt="Shared" />
                )}
              </ShareImg>
            )}
            <SocialCounts>
              <li>
                <button>
                  
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "15px",
                      }}
                    >
                      
                      <img src="/images/like-count-icon.svg" alt="Like Icon" />
                      {post.likes || 0}
                    </span>
                
                </button>
              </li>
              {/* ...other counts... */}
            </SocialCounts>
            <SocialActions>
              <button
                onClick={() => handleLike(post)}
                // style={{
                //   background:
                //     Array.isArray(post.liked_by) &&
                //     post.liked_by.includes(props.user?.email)
                //       ? "rgba(10,102,194,0.08)"
                //       : "transparent",
                //   borderRadius: "8px",
                // }}
              >
                {Array.isArray(post.liked_by) &&
                    post.liked_by.includes(props.user?.email)? <BiSolidLike/> : <BiLike />}
                <span>Like</span>
                <span style={{ marginLeft: 6 }}></span>
              </button>
              <button>
                <FaRegCommentDots />
                <span>Comments</span>
              </button>
              <button>
                <BiRepost />
                <span>Repost</span>
              </button>
              <button>
                <RiSendPlaneFill />
                <span>Send</span>
              </button>
            </SocialActions>
          </Article>
        ))}
      </div>
      <PostModal
        showModal={showModal}
        handleClick={handleClick}
        user={props.user}
        onPostSuccess={fetchPosts}
        setLoading={setLoading} // pass this
        closeModal={() => setShowModal("close")} // pass this
      />
      {loading && (
        <SpinnerOverlay>
          <FadeLoader color={"#123abc"} loading={loading} size={35} />
        </SpinnerOverlay>
      )}
    </Container>
  );
}
const Container=styled.div`
grid-area: main;
`
const CommonCard=styled.div`
    text-align: center;
    overflow: hidden;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 5px;
    position:relative;
    border:none;
    box-shadow: 0 0 0 1px rgb(0 0 0 /15%), 0 0 0 rgb(0 0 0 /20%);
`
const SharedBox=styled(CommonCard)`
    display: flex;
    flex-direction: column;
    color: #958b7b;
    margin: 0 0 8px;
    background: white;
    div{
        button{
            outline: none;
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
            line-height: 1.5;
            min-height: 48px;
            background: transparent;
            border: none;
            display: flex;
            align-items: center;
            font-weight: 600;
            img{
                width: 20px;
                height: 20px;
            }
        }
        &:first-child{
            display: flex;
            align-items: center;
            padding: 8px 16px 0px 16px;
            img{
                width: 48px;
                height: 48px;
                border-radius: 50%;
                margin-right: 8px;
            }
            button{
                margin:4px 0;
                flex-grow: 1;
                border-radius: 35px;
                padding-left: 16px;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 35px;
                background-color: white;
                text-align: left;
            }
        }
        &:nth-child(2){
            display:flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 4px 53px;
            button{
                img{
                    margin: 0 6px 0 -2px;
                }
            }
        }
    }
`
const Article=styled(CommonCard)`
padding: 0;
margin: 0 0 8px;
overflow: visible;
`
const SharedActor=styled.div`
padding-right: 40px;
flex-wrap:nowrap;
padding: 12px 16px 0;
margin-bottom: 8px;
align-items: center;
display: flex;
a{
    margin-right: 12px;
    flex-grow: 1;
    display: flex;
    overflow: hidden;
    text-decoration: none;
    img{
        width: 48px;
        height: 48px;
        border-radius: 50%;
    }
    &> div{
        display:flex;
        flex-direction: column;
        flex-grow: 1;
        flex-basis: 0;
        margin-left: 8px;
        overflow: hidden;
        span{
            text-align:left;
            &:first-child{
                font-size: 14px;
                font-weight: 700;
                color: rgba(0, 0, 0, 1);
            }
            &:nth-child(n+1){
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
            }
            
        }
    }
}
button{
    position:absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
}
.delete{
    padding: 8px 16px;
    width: 100%;
    text-align: left;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    background-color: #e8e3e3;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: red;
    &:hover{
        background-color: #f5f5f5;
    }
}
`
const Description=styled.div`
padding:0 16px;
overflow:hidden;
color:rgba(0,0,0,0.9);
font-size:14px;
text-align:left;
`
const ShareImg=styled.div`
margin-top: 8px;
width: 100%;
display:flex;
justify-content: center;
align-items: center;
position: relative;
background-color:#f9fafb;
img{
    object-fit: contain;
    width: 100%;
    height: 100%;
}
video{
   object-fit: contain;
    width: 100%;
    height: auto;
    max-height: 400px;
    max-width: 100%;
    background: #000;
       display: block;
}
@media (max-width: 600px) {
    img,
    video {
      /* max-height: 220px; */
      object-fit: contain;
    width: 100%;
    height: auto;
    /* max-height: 400px; */
    max-width: fit-content;
    max-height: fit-content;
    background: #000;
       display: block;
    }
  }
`
const SocialCounts=styled.ul`
line-height: 1.3;
display: flex;
align-items: flex-start;
margin: 0 16px;
padding: 8px 0;
border-bottom: 1px solid #e9e5df;
list-style: none;
justify-content: space-between;
align-items: center;
li{
    margin-right:5px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    button{
        display:flex;
        border: none;
        background: transparent;
        color: rgba(0, 0, 0, 0.6);
    }
    a{
        margin-right: 12px;
        color: rgba(0, 0, 0, 0.6);
        text-decoration: none;
    }
}
`
const SocialActions=styled.div`
align-items: center;
display: flex;
justify-content:  space-between;
width: 100%;
margin: 0;
min-height: 40px;
padding: 4px 0;
flex-wrap: wrap;

button{
    flex:1;
    justify-content: center;
    display:inline-flex;
    align-items: center;
    padding: 8px;
    font-size: 17px;
    border:none;
    background: transparent;
    span{
        margin-left: 2px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.6);
    }
    @media (min-width: 768px) {
        span{
        margin-left: 4.5px;
        }
    }
    &:active {
        background: #d8d4d4;
        border-radius: 8px;
    }
}
`
const ThreeDots = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex; 
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  &:active {
    background: #d8d4d4;
    border-radius: 50%;
  }
`;
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: red;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  border-radius: 20px;
  cursor: pointer;
`;
const ReportButton = styled.button`
  background: none;
  border: none;
  color: red;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  border-radius: 20px;
  cursor: pointer;
`;
const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  /* backdrop-filter: blur(2px); */
`;
const mapStateToProps = (state) => ({
  user: state.userState.user, // <-- Adjust according to your reducer
});
const mapDispatchToProps = (dispatch) => {
    return {}
} 
export default connect(mapStateToProps, mapDispatchToProps)(Main);
