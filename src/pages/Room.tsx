import { useSocket } from '@/context/socketContext';
import ReactPlayer from 'react-player';
import React, { useCallback, useEffect, useState } from 'react'
import {peerService} from "@/context/Peer";

const Room = () => {
  //@ts-ignore
  const {socket} = useSocket();

  const [roomId, setRoomId] = useState<String | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  const handleCallUser = useCallback(async ()=> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);

  },[]);
  useEffect( () => {
    handleCallUser();
  },[]);

  const handleNewUserJoined =  useCallback( async ({email}:{email: string}) => {
        console.log("New user joined : " + email);
        const offer = await peerService.createOffer();
        socket.emit("event:call-user", {email, offer});
  },[]);

  const handleIncommingCall = useCallback(async ({email, offer}:{email: string, offer: RTCSessionDescriptionInit}) => {
    console.log("Incomming call");
    console.log("call from: ", email);
    console.log("offer: ", offer);
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true,
    // });

    // setMyStream(stream);
    const ans = await peerService.getAnswer({offer});

    //call accepted
    socket.emit("event:call-accepted", {email, ans});
    //call declined


  },[]);

  const handleCallAccepted = useCallback(({email, ans}:{email: string, ans: RTCSessionDescription}) => {
    console.log("Call accepted from: ", email);
    console.log("anserwer from caller: ", ans);
  },[]); 


  useEffect(()=>{
    socket.on("event:user-joined", handleNewUserJoined);
    socket.on("event:incomming-call", handleIncommingCall);
    socket.on("event:accepted", handleCallAccepted);


    return () => {
      socket.off("event:user-joined", handleNewUserJoined);
      socket.off("event:incomming-call", handleIncommingCall);
      socket.off("event:accepted", handleCallAccepted);
    }
  },[socket, handleNewUserJoined, handleIncommingCall, handleCallAccepted]);

  return (
    <div>
      {myStream && 
      <ReactPlayer
        playing
        muted
        className = "h-[300px] w-[300px]"
        url={myStream}
      />}
    </div>
  )
}

export default Room;