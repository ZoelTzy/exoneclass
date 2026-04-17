import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient"; 
import axios from "axios";
import Swal from "sweetalert2";

const MESSAGE_LIMIT = 20;
const BLACKLISTED_WORDS = ["Kontol", "K0ntol", "bawok"]; // Tambah kata kasarnya di sini

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userIp, setUserIp] = useState("");
  const [replyTo, setReplyTo] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const messagesEndRef = useRef(null);

// Load & Realtime Chat dari Supabase
  useEffect(() => {
    fetchMessages();

    // Menggunakan nama channel unik (Date.now) agar tidak bentrok saat React me-load ulang (Strict Mode)
    const channelName = 'chat-room-' + Date.now();
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
    if (error) console.error(error);
  };

  useEffect(() => {
    getUserIp();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserIp = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json");
      setUserIp(response.data.network);
    } catch (error) { console.error("Gagal get IP:", error); }
  };

  const handleAdminTrigger = async () => {
    if (isAdmin) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setClickCount(0);
      const { value: password } = await Swal.fire({
        title: "Admin Access",
        input: "password",
        background: "#18181b",
        color: "white"
      });
      if (password === "exone123") {
        setIsAdmin(true);
        Swal.fire({ icon: "success", title: "Admin Mode Aktif!", background: "#18181b", color: "white", timer: 1500 });
      }
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    // Filter Kata Kasar
    const lowerMsg = message.toLowerCase();
    if (BLACKLISTED_WORDS.some(word => lowerMsg.includes(word.toLowerCase())) && !isAdmin) {
      Swal.fire({ icon: "warning", title: "Kata dilarang!", background: "#18181b", color: "white" });
      return;
    }

    const senderImageURL = isAdmin ? "https://cdn-icons-png.flaticon.com/512/5138/5138230.png" : "/AnonimUser.png";

    // FIX: Typo pada reply_to_image sudah diperbaiki di sini
    const { error } = await supabase.from('chats').insert([
      { 
        message: message.substring(0, 60), 
        sender_image: senderImageURL,
        user_ip: userIp,
        is_admin_message: isAdmin,
        reply_to_message: replyTo ? replyTo.message : null,
        reply_to_image: replyTo ? replyTo.sender_image : null 
      }
    ]);

    if (error) {
      Swal.fire({ icon: "error", title: "Gagal Kirim", text: error.message });
    } else {
      setMessage("");
      setReplyTo(null);
    }
  };

  return (
    <div id="ChatAnonim">
      <div className="text-center text-3xl font-semibold mb-4 cursor-pointer select-none" onClick={handleAdminTrigger}>
        Text Anonim {isAdmin && "👑"}
      </div>

      <div className="h-[300px] overflow-y-auto pr-2" id="KotakPesan">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start py-2 border-b border-white/5 ${msg.is_admin_message ? 'bg-blue-900/10 rounded-lg px-2' : ''}`}>
            <img src={msg.sender_image} className={`h-8 w-8 mr-3 rounded-full flex-shrink-0 bg-gray-600 ${msg.is_admin_message ? 'border border-blue-400 p-0.5' : ''}`} alt="" />
            <div className="flex flex-col">
              {msg.reply_to_message && (
                <div className="text-xs opacity-50 border-l-2 pl-2 mb-1 truncate max-w-[200px]">
                  {msg.reply_to_message}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={msg.is_admin_message ? "text-blue-300 font-bold" : "text-gray-200"}>
                  {msg.message}
                </span>
                {isAdmin && (
                  <button onClick={() => setReplyTo(msg)} className="text-xs text-blue-400 opacity-0 group-hover:opacity-100">Reply</button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {replyTo && (
        <div className="flex items-center justify-between text-xs opacity-70 border-l-2 border-blue-400 pl-2 mt-4 mb-2 bg-white/5 p-2 rounded">
          <div className="flex items-center gap-2 truncate">
            <span className="text-blue-400">↩ Replying:</span>
            <span className="truncate">{replyTo.message}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="ml-2 hover:text-red-400 font-bold flex-shrink-0">
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center mt-4 bg-white/10 p-2 rounded-xl">
        <input 
          className="bg-transparent outline-none flex-grow text-white px-2 w-full"
          placeholder={isAdmin ? "Balas sebagai Admin..." : "Ketik pesan rahasia..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          maxLength={60}
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg ml-2 transition-colors">
           <img src="/paper-plane.png" alt="Kirim" className="h-4 w-4 filter invert" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
