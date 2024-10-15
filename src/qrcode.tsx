import { QRCodeSVG } from "qrcode.react";

export default function QrCodePage({ qrCode }: { qrCode: string }) {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-black">
      <div className="m-auto border-collapse border-slate-400 border-2 p-8 rounded-2xl">
        <h3 className="mb-6">Escaneie o qr code para começar</h3>
        <QRCodeSVG value={qrCode} size={250} />
      </div>
    </div>
  );
}
