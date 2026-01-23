import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0); // 0: greeting, 1: await email, 2: completed
    const location = useLocation();

    useEffect(() => {
        // Automatically open and show greeting after login or on landing page
        const token = localStorage.getItem('token');
        // Only trigger if we have a token and we are NOT on login/register pages, OR if we are on the landing page
        const publicPaths = ['/login', '/register', '/activate-account', '/account-activated'];
        const isPublicPath = publicPaths.includes(location.pathname);
        const isLandingPage = location.pathname === '/';

        if (isLandingPage || (token && !isPublicPath)) {
            const hasGreeted = sessionStorage.getItem('chatbot_greeted');
            if (!hasGreeted) {
                setTimeout(() => {
                    setIsOpen(true);
                    setMessages([{
                        text: "Hello ! How may i help you today?",
                        sender: 'bot',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                    sessionStorage.setItem('chatbot_greeted', 'true');
                }, 1000);
            }
        }
    }, [location.pathname]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = {
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInput('');

        // Simple bot response simulation based on step
        setTimeout(() => {
            if (step === 0) {
                setMessages(prev => [...prev, {
                    text: "Kindly assist us with your email address for more details.",
                    sender: 'bot',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setStep(1);
            } else if (step === 1) {
                setMessages(prev => [...prev, {
                    text: "Thank you. Our team will reach us to you in a few.",
                    sender: 'bot',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setStep(2);
            } else {
                setMessages(prev => [...prev, {
                    text: "Thank you for your message. Our team will get back to you soon.",
                    sender: 'bot',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-80 md:w-96 flex flex-col mb-4 overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-[#00D9FF] text-white p-4 flex justify-between items-center transition-all">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faCommentDots} className="text-[#00D9FF]" />
                            </div>
                            <span className="font-bold">DialiCare Support</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'bot'
                                    ? 'bg-white text-gray-800 self-start rounded-tl-none border border-gray-100'
                                    : 'bg-[#00D9FF] text-white self-end rounded-tr-none'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <span className={`text-[10px] mt-1 block ${msg.sender === 'bot' ? 'text-gray-400' : 'text-blue-100'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-[#00D9FF] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#00b8d9] transition-colors"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </div>
            )}

            {/* FAB (Floating Action Button) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 ${isOpen ? 'bg-gray-500 rotate-90' : 'bg-[#00D9FF]'
                    }`}
            >
                <FontAwesomeIcon
                    icon={isOpen ? faTimes : faCommentDots}
                    className="text-white text-2xl"
                />
            </button>
        </div>
    );
};

export default Chatbot;
