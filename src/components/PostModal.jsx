import React, { useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { VscChromeClose } from "react-icons/vsc";
import { FaImage } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TfiClose } from "react-icons/tfi";
import {connect} from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { supabase } from '../storage/supabaseClient';
import { uploadToSupabase, createSupabasePost } from '../api/supabasePosts';
const PostModal = (props) => {
    const [editorText, setEditorText] = useState("");
    const [shareImage, setShareImage] = useState("");
    const [droppedVideo, setDroppedVideo] = useState(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'video/*': [] },
        multiple: false,
        onDrop: (files) => {
            if (files && files.length > 0) {
                setDroppedVideo(files[0]);
                setShareImage(""); // Clear image if video is dropped
            }
        }
    });

    const handleChange = (e) => {
        const image = e.target.files[0];
        if (!image) return;
        setShareImage(image);
        setDroppedVideo(null); // Clear video if image is selected
    };
    const postArticle = async (e) => {
        e.preventDefault();
        if (e.target !== e.currentTarget) return;

        // Start spinner (modal stays open)
        if (props.setLoading) props.setLoading(true);

        let imageUrl = null;
        let videoUrl = null;

        // Upload image if present
        if (shareImage) {
            imageUrl = await uploadToSupabase(shareImage);
        }

        // Upload video if present
        if (droppedVideo) {
            videoUrl = await uploadToSupabase(droppedVideo);
        }

        try {
            let media_url = imageUrl || videoUrl || null;
            await createSupabasePost({
                email: props.user.email,
                username: props.user.displayName,
                user_photo: props.user.photoURL,
                description: editorText,
                media_url: media_url,
                title: "",
                likes: 0,
            });

            // After successful post, close modal and stop spinner
            if (props.onPostSuccess) props.onPostSuccess();
            if (props.closeModal) props.closeModal();
        } catch (error) {
            alert('Failed to create post!');
        } finally {
            if (props.setLoading) props.setLoading(false);
        }
        setEditorText("");
        setShareImage("");
        setDroppedVideo(null);
        props.handleClick();
    }
    const reset= () => {
        setEditorText("");
        setShareImage("");
        setDroppedVideo(null);
        props.handleClick();
    }

    return (
        <>
        { props.showModal==="open" &&
        <Container>
            <Content>
                <Header>
                    <h2>Create a post</h2>
                    <button onClick={(event)=>reset(event)}>
                        <VscChromeClose style={{ width: '24px', height: '24px', color: 'black'}} className='close'/>
                    </button>
                </Header>
                <SharedContent>
                    <UserInfo>
                        {props.user.photoURL ? <img src={props.user.photoURL} alt="User Icon" /> :
                        <img src="/images/user.svg" alt="User Icon" />}
                        <span>{props.user.displayName?props.user.displayName:"Name"}</span>
                    </UserInfo>

                    <Editor>
                        <textarea value={editorText} onChange={(e)=>setEditorText(e.target.value)}
                            placeholder='What do you want to talk about?'
                            autoFocus={true}/>
                        <UploadImage>
                            {/* Image Upload */}
                            {!droppedVideo && (
                              <>
                                <input
                                  ref={imageInputRef}
                                  type="file"
                                  accept="image/gif, image/jpeg, image/png"
                                  id="file"
                                  name="image"
                                  style={{ display: 'none' }}
                                  onChange={handleChange}
                                />
                                {/* Image Preview with Close Button */}
                                {shareImage && (
                                  <PreviewWrapper>
                                    <PreviewClose onClick={() => setShareImage("")} title="Remove photo"><TfiClose /></PreviewClose>
                                    <img src={URL.createObjectURL(shareImage)} alt="Selected" />
                                  </PreviewWrapper>
                                )}
                              </>
                            )}

                            {/* Video Dropzone */}
                            {!shareImage && (
                              <>
                                <input
                                  ref={videoInputRef}
                                  type="file"
                                  accept="video/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setDroppedVideo(e.target.files[0]);
                                      setShareImage("");
                                    }
                                  }}
                                />
                                {/* Video Preview with Close Button */}
                                {droppedVideo && !shareImage && (
                                  <PreviewWrapper>
                                    <PreviewClose onClick={() => setDroppedVideo(null)} title="Remove video"><TfiClose /></PreviewClose>
                                    <AnimatedVideo
                                      key={droppedVideo.name + droppedVideo.size + droppedVideo.lastModified}
                                      controls
                                      src={URL.createObjectURL(droppedVideo)}
                                    />
                                  </PreviewWrapper>
                                )}
                              </>
                            )}
                          </UploadImage>
                    </Editor>
                </SharedContent>
                <SharedCreation>
                    {/* Only show AssetButtons if no image or video is selected */}
                    {(!shareImage && !droppedVideo) && (
                      <AttachAssets>
                        <AssetButton onClick={() => imageInputRef.current && imageInputRef.current.click()}>
                          <FaImage style={{ width: '24px', height: '24px', color: 'grey' }} />
                        </AssetButton>
                        <AssetButton onClick={() => videoInputRef.current && videoInputRef.current.click()}>
                          <PiVideoFill style={{ width: '24px', height: '24px', color: 'grey' }} />
                        </AssetButton>
                      </AttachAssets>
                    )}
                    <ShareComment>
                        <AssetButton>
                            <BiMessageRoundedDetail style={{ width: '24px', height: '24px' ,color: 'grey'}} className='ShareMsg' />
                            Anyone
                        </AssetButton>
                    </ShareComment>
                    <PostButton disabled={!editorText ? true : false} onClick={(event)=>postArticle(event)}>
                        Post
                    </PostButton>
                </SharedCreation>
            </Content>
        </Container>
        }
        </>

    )
}
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96);}
  to { opacity: 1; transform: scale(1);}
`;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    color: black;
    background-color: rgba(0, 0, 0, 0.8);
    animation: fadeIn 0.3s ease-in-out;
    `;
const Content = styled.div`
width: 100%;
max-width: 552px;
background-color: white;
max-height: 90%;
border-radius: 5px;
position: relative;
display: flex;
flex-direction: column;
top: 32px;
margin: 0 auto;
overflow: initial;
`
const Header = styled.div`
display: block;
padding: 16px 24px;
border-bottom: 1px solid rgba(0, 0, 0, 0.15);
font-size: 16px;
line-height: 1.5;
color: rgba(0, 0, 0, 0.6);
font-weight: 400;
display: flex;
justify-content: space-between;
align-items: center;
button{
    height: 40px;
    width: 40px;
    min-width: auto;
    background: transparent;
    color: rgba(0, 0, 0, 0.15);
    display:flex;
    align-items: center;
    justify-content: center;
    border: none;
    .close{
       
        
        width: 24px;
        height: 24px;
    }
    &:hover{
        background: #c8c2c2;
        border-radius: 50%;
    }
}
`
const SharedContent = styled.div`
display: flex;
flex-direction: column;
flex-grow: 1;
overflow-y: auto;
vertical-align: baseline;
padding: 8px 12px;
background: transparent;
`
const UserInfo = styled.div`
display: flex;
align-items: center;
padding: 12px 24px;
svg,img{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-clip: content-box;
    border: 2px solid transparent;
}
span{
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 8px;
    color: rgba(0, 0, 0, 1);
}
`
const SharedCreation = styled.div`
display: flex;
justify-content: space-between;
padding: 12px 24px 12px 16px
`
const AssetButton = styled.button`
display: flex;
align-items: center;
height: 40px;
min-width: auto;
color:rgba(0, 0, 0, 0.5);
border: none;
background: transparent;
&:active {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    display:flex;
    align-items: center;
    justify-content: center;
}
`
const AttachAssets = styled.div`
display: flex;
align-items: center;
padding-right: 8px;
${AssetButton}{
    width: 40px;
}
`
const ShareComment = styled.div`
padding-left: 8px;
margin-right:auto;
border-left: 1px solid rgba(0, 0, 0, 0.15);
${AssetButton}{
    .ShareMsg{
        margin-right: 5px;
    }
}   
`
const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => props.disabled ? "#e6e9ec" : "#0a66c2"};
  color: ${(props)=>(props.disabled?"rgba(1,1,1,0.2)":"white")};
  border: none;
  ${(props) =>
    !props.disabled &&
    `&:hover {
      background-color: #004182;
      cursor: pointer;
    }`
  }
  &:hover {
    cursor: pointer;
  }
`
const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    border: none;
    /* border: 2px solid #ccc;           // Thin grey border */
    border-radius: 4px;
    transition: border-color 0.2s, border-width 0.2s;
    &:focus {
      outline: none;
      border:none;
      /* border-color: #0a66c2;          // Blue border on focus */
      border-width: 2px;              // Thicker border on focus
    }
  }

  input {
    width: 100%;
    height: 40px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`
const UploadImage = styled.div`
text-align: center;
img{
    width: 100%;
}
`
const AnimatedVideo = styled.video`
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 0.5s ease;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;
const PreviewClose = styled.button`
  margin-bottom: 4px;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  font-size: 30px;
  
  &:hover {
    background: #eee;
  }
`;
const PreviewWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  margin-bottom: 8px;
`;
export default PostModal;

