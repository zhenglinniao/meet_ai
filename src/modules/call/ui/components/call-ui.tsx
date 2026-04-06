import { useRef, useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
  meetingName: string;
};

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const joiningRef = useRef(false);

  const handleJoin = async () => {
    if (!call) return;
    if (joiningRef.current || show !== "lobby") return;

    joiningRef.current = true;

    try {
      await call.join();
      setShow("call");
    } catch (error) {
      console.error("Failed to join call", error);
      // 失败时允许用户重试
    } finally {
      joiningRef.current = false;
    }
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  )
};
