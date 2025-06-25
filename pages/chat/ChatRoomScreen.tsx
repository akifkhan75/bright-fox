
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { View, UserRole, ChatMessage, ChatConversation, ChatParticipant } from '../../types';
import Button from '../../components/Button';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'; // Using solid for send icon
import LoadingSpinner from '../../components/LoadingSpinner';

const ChatRoomScreen: React.FC = () => {
  const context = useContext(AppContext);
  const { conversationId } = useParams<{ conversationId: string }>();
  
  const [newMessageText, setNewMessageText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context && conversationId) {
      context.markConversationAsRead(conversationId);
    }
  }, [context, conversationId]);

  useEffect(() => { // Auto-scroll to bottom
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [context?.appState.chatMessages, conversationId]);


  if (!context || !context.appState.currentUserRole || !conversationId) {
    return <LoadingSpinner text="Loading chat..." />;
  }
  const { appState, sendChatMessage, teacherProfile, allTeacherProfiles } = context;
  const currentUserId = appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId;

  const conversation = appState.chatConversations.find(c => c.id === conversationId);
  const messages = appState.chatMessages.filter(m => m.conversationId === conversationId).sort((a,b) => a.timestamp - b.timestamp);

  if (!conversation || !currentUserId) {
    return <div className="p-4 text-center">Chat not found or user not identified.</div>;
  }
  
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    sendChatMessage(conversationId, newMessageText.trim());
    setNewMessageText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100"> 
      {/* Header is part of the main App.tsx layout */}
      <div ref={chatContainerRef} className="flex-grow p-3 sm:p-4 space-y-3 overflow-y-auto custom-scrollbar">
        {messages.map(msg => {
          const isSender = msg.senderId === currentUserId;
          const senderParticipant = conversation.participants.find(p => p.id === msg.senderId);
          const avatarToShow = isSender ? 
            (appState.currentUserRole === UserRole.Parent ? 'https://picsum.photos/seed/currentparent/40/40' : teacherProfile?.avatarUrl)
            : senderParticipant?.avatarUrl;
          
          return (
            <div key={msg.id} className={`flex items-end space-x-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
              {!isSender && (
                <img 
                    src={avatarToShow || 'https://picsum.photos/seed/defaultavatar/40/40'} 
                    alt={senderParticipant?.name || 'User'} 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className={`max-w-[70%] sm:max-w-[65%] p-2.5 sm:p-3 rounded-xl shadow ${
                isSender ? 'bg-sky-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                <p className={`text-[10px] sm:text-xs opacity-70 mt-1 ${isSender ? 'text-sky-100 text-right' : 'text-gray-400 text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
               {isSender && appState.currentUserRole === UserRole.Parent && ( 
                 <img 
                    src={avatarToShow || 'https://picsum.photos/seed/parentUser/40/40'} 
                    alt="You" 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
               {isSender && appState.currentUserRole === UserRole.Teacher && teacherProfile && ( 
                 <img 
                    src={teacherProfile.avatarUrl || 'https://picsum.photos/seed/teacherUser/40/40'} 
                    alt={teacherProfile.name} 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
            </div>
          );
        })}
         {messages.length === 0 && (
            <div className="text-center text-gray-400 py-10">
                <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2"/>
                <p>This is the beginning of your conversation with {otherParticipant?.name || 'this user'}.</p>
            </div>
          )}
      </div>

      <form onSubmit={handleSendMessage} className="p-2 sm:p-3 border-t border-gray-200 bg-white flex items-center space-x-2 sticky bottom-0 left-0 right-0 max-w-[420px] mx-auto">
        <input
          type="text"
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder={`Message ${otherParticipant?.name || 'user'}...`}
          className="flex-grow p-2.5 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm"
        />
        <Button type="submit" disabled={!newMessageText.trim()} className="!p-2.5 sm:!p-3 !rounded-lg">
          <PaperAirplaneIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>
        </Button>
      </form>
    </div>
  );
};

export default ChatRoomScreen;
