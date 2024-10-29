import { useEffect, useState } from "react";

export default function ChatPage({
  onSubmit,
  allChats,
  isLoading,
}: {
  onSubmit: (message: any) => void;
  allChats: any[];
  isLoading: boolean;
}) {
  const [messageText, setTextMessage] = useState<string>("");
  const [selectedChats, setSelectedChats] = useState<any[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string>("");
  const [file, setFile] = useState(null);
  const [chats, setChats] = useState<any[]>([]);
  const [extraChats, setExtraChats] = useState<any[]>([]);

  useEffect(() => {
    setChats(allChats);
    setExtraChats(allChats);
  }, [allChats]);

  const handleSearch = (query: string) => {
    const filteredChats = chats.filter((chat) =>
      chat.subject.toLowerCase().includes(query.toLowerCase())
    );

    if (query === "") {
      setChats(extraChats);
    } else {
      setChats(filteredChats);
    }
  };

  const onFormSubmit = () => {
    if (!selectedChats.length) {
      alert("Selecione pelo menos um chat");
      return;
    }
    if (file && !selectedFileType) {
      alert("Selecione um tipo de arquivo");
      return;
    }

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    formData.append("text", messageText);
    selectedChats.forEach((item) => {
      formData.append(`chats[]`, item);
    });

    formData.append("fileType", selectedFileType);
    // const message: {
    //   text: string;
    //   chats: any[];
    //   fileType: string;
    //   file: string | ArrayBuffer | null;
    // } = {
    //   text: messageText,
    //   chats: selectedChats,
    //   fileType: selectedFileType,
    //   file,
    // };
    // if (file) {
    //   const reader = new FileReader();

    //   reader.readAsArrayBuffer(file);

    //   reader.onload = () => {
    //     if (reader.result) {
    //       message.file = reader.result;
    //     }

    //     onSubmit(message);
    //   };

    //   reader.onerror = (error) => {
    //     console.error("Error reading file:", error);
    //   };
    // } else {
    // }
    onSubmit(formData);
  };

  const handleSelectChat = (chatId: any) => {
    setSelectedChats((prevSelectedChats) =>
      prevSelectedChats.includes(chatId)
        ? prevSelectedChats.filter((id) => id !== chatId)
        : [...prevSelectedChats, chatId]
    );
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white text-black">
      <div className="m-auto max-w-7xl border-collapse border-slate-400 border-2 p-5 rounded-2xl">
        <div className="flex space-x-10 mb-4">
          <div>
            <SearchComponent onChange={handleSearch} />
            <div className="max-h-80 overflow-y-auto px-1 py-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex hover:scale-105 transition-all items-center ps-4 border border-gray-200 rounded"
                >
                  <input
                    id={`bordered-checkbox-${chat.id}`}
                    type="checkbox"
                    value={chat.id}
                    name="bordered-checkbox"
                    onChange={() => handleSelectChat(chat.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                  />

                  <label
                    htmlFor={`bordered-checkbox-${chat.id}`}
                    className="w-full py-2 ms-2 text-sm font-medium text-gray-900"
                  >
                    {chat.subject}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Sua mensagem
            </label>
            <textarea
              id="message"
              rows={4}
              onChange={(e) => setTextMessage(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your thoughts here..."
            ></textarea>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900  mt-2"
            >
              Arquivo
            </label>

            <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
              <li className="w-full border-b border-gray-200 rounded-t-lg ">
                <div className="flex items-center ps-3">
                  <input
                    id="list-radio-license"
                    type="radio"
                    value="audio"
                    name="list-radio"
                    onChange={() => setSelectedFileType("audio")}
                    className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="list-radio-license"
                    className="w-full py-2 ms-2 text-sm font-medium text-gray-900 "
                  >
                    Audio
                  </label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 rounded-t-lg ">
                <div className="flex items-center ps-3">
                  <input
                    id="list-radio-id"
                    type="radio"
                    value="document"
                    name="list-radio"
                    onChange={() => setSelectedFileType("document")}
                    className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                  />
                  <label
                    htmlFor="list-radio-id"
                    className="w-full py-2 ms-2 text-sm font-medium text-gray-900 "
                  >
                    Documento
                  </label>
                </div>
              </li>
            </ul>

            <input
              className="mt-4 block max-w-xs p-1 text-sm border border-gray-300 rounded-lg cursor-pointer text-white focus:outline-none bg-black"
              id="file_input"
              onChange={handleFileChange}
              type="file"
            />
          </div>
        </div>
        <div className="flex justify-end">
          {isLoading ? (
            <p>Enviando...</p>
          ) : (
            <button
              type="button"
              onClick={onFormSubmit}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
            >
              Enviar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const SearchComponent = ({
  onChange,
}: {
  onChange: (value: string) => void;
}) => {
  return (
    <div className="min-w-7xl mx-auto mb-4">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Pesquise um grupo"
          onChange={(e) => onChange(e.target.value)}
        />
        {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
      </div>
    </div>
  );
};
