import { useEffect, useState } from "react";
import QrCodePage from "./qrcode";
import ChatPage from "./chat";
import { io } from "socket.io-client";

import { v4 as uuidv4 } from "uuid";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;

const AppStream = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [qr, setQR] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const generateAndStoreUUID = () => {
    let storedUUID = localStorage.getItem("wpp_auth_uuid");
    // let logged = false;
    if (!storedUUID) {
      const newUUID = uuidv4();
      localStorage.setItem("wpp_auth_uuid", newUUID);
      storedUUID = newUUID;
    } else {
      // console.log("UUID existente encontrado:", storedUUID);
    }

    return { uuid: storedUUID };
  };

  const data = generateAndStoreUUID();

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      query: { authId: data.uuid },
      withCredentials: true,
    });

    socket.on("qr", (payload: any) => {
      const { to, qr } = payload;
      if (to == data.uuid) {
        setQR(qr);
        setLoading(false);
      }
    });

    socket.on("chats", (data) => {
      setLoading(false);
      setQR(null);
      if (data != null) {
        setChats(data);
      }
    });
  }, [data.uuid]);

  const sendGroupData = async (message: FormData) => {
    message.append("authId", data.uuid);

    setSending(true);

    const res = await fetch(`${SOCKET_SERVER_URL}/sendMessages`, {
      method: "POST",
      body: message,
    });

    setSending(false);
    if (res.ok) {
      alert("Mensagens enviadas com sucesso");
    } else {
      alert("Falha ao enviar as mensagens.");
    }
  };

  return (
    <div className="bg-white min-h-screen text-black w-full">
      {loading ? (
        <>
          <div>Loading...</div>
          {/* <div>{loadingReason}</div> */}
        </>
      ) : qr ? (
        <QrCodePage qrCode={qr} />
      ) : (
        <ChatPage
          isLoading={sending}
          allChats={chats}
          onSubmit={sendGroupData}
        />
      )}
    </div>
  );
};

export default AppStream;
