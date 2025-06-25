
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, ChatConversation, ChatParticipant } from '../../types';
import Card from '../../components/Card';
import { ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const ChatListScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.appState.currentUserRole || (context.appState.currentUserRole !== UserRole.Parent && context.appState.currentUserRole !== UserRole.Teacher) ) {
    // Redirect or show error if not logged in as parent or teacher
    context?.setViewWithPath(View.RoleSelection, '/roleselection', { replace: true });
    return <div className="p-4 text-center">Access Denied. Please log in.</div>;
  }

  const { appState, setViewWithPath } = context;
  const currentUserId = appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId;

  const userConversations = useMemo(() => {
    if (!currentUserId) return [];
    return appState.chatConversations
      .filter(convo => convo.participantIds.includes(currentUserId))
      .sort((a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0));
  }, [appState.chatConversations, currentUserId]);

  const getOtherParticipant = (convo: ChatConversation): ChatParticipant | undefined => {
    if (!currentUserId) return undefined;
    return convo.participants.find(p => p.id !== currentUserId);
  };

  if (!currentUserId) {
     return <div className="p-4 text-center">Loading user data...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full">
      <div className="flex items-center mb-6">
        <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3 text-sky-600" />
        <h1 className="text-2xl font-bold text-sky-700 font-display">My Messages</h1>
      </div>

      {userConversations.length === 0 ? (
        <Card className="text-center py-10">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No conversations yet.</p>
          {appState.currentUserRole === UserRole.Parent && (
            <p className="text-gray-500 text-sm mt-1">Start a chat by visiting a teacher's profile.</p>
          )}
           {appState.currentUserRole === UserRole.Teacher && (
            <p className="text-gray-500 text-sm mt-1">Parents can initiate chats with you.</p>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {userConversations.map(convo => {
            const otherParticipant = getOtherParticipant(convo);
            const unreadMessages = convo.unreadCount?.[currentUserId] || 0;

            return (
              <Card 
                key={convo.id} 
                onClick={() => setViewWithPath(View.ChatRoomScreen, `/chatroomscreen/${convo.id}`)}
                className={`!p-3 sm:!p-4 hover:!shadow-md transition-shadow ${unreadMessages > 0 ? '!bg-sky-50 border-sky-300' : '!bg-white'}`}
              >
                <div className="flex items-center space-x-3">
                  {otherParticipant?.avatarUrl ? (
                    <img src={otherParticipant.avatarUrl} alt={otherParticipant.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"/>
                  ) : (
                    <UserCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300"/>
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">{otherParticipant?.name || 'Unknown User'}</h3>
                        {convo.lastMessageTimestamp && (
                            <p className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0 ml-2">
                                {new Date(convo.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{convo.lastMessageText || 'No messages yet...'}</p>
                        {unreadMessages > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                                {unreadMessages > 9 ? '9+' : unreadMessages}
                            </span>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatListScreen;
