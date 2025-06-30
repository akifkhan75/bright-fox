import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  View as RNView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AppContext } from '../../App';
import { View, UserRole, ChatMessage, ChatConversation, ChatParticipant } from '../../types';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from 'react-native-heroicons/solid';
import LoadingSpinner from '../../components/LoadingSpinner';

const ChatRoomScreen: React.FC = () => {
  const context = useContext(AppContext);
  const route = useRoute();
  const conversationId = route.params?.conversationId;
  
  const [newMessageText, setNewMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (context && conversationId) {
      context.markConversationAsRead(conversationId);
    }
  }, [context, conversationId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [context?.appState.chatMessages, conversationId]);

  if (!context || !context.appState.currentUserRole || !conversationId) {
    return <LoadingSpinner text="Loading chat..." />;
  }

  const { appState, sendChatMessage, teacherProfile, allTeacherProfiles } = context;
  const currentUserId = appState.currentUserRole === UserRole.Parent 
    ? appState.currentParentProfileId 
    : appState.currentTeacherProfileId;

  const conversation = appState.chatConversations.find(c => c.id === conversationId);
  const messages = appState.chatMessages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (!conversation || !currentUserId) {
    return (
      <RNView style={styles.notFoundContainer}>
        <Text>Chat not found or user not identified.</Text>
      </RNView>
    );
  }
  
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    sendChatMessage(conversationId, newMessageText.trim());
    setNewMessageText('');
  };

  const renderMessage = (msg: ChatMessage) => {
    const isSender = msg.senderId === currentUserId;
    const senderParticipant = conversation.participants.find(p => p.id === msg.senderId);
    const avatarToShow = isSender 
      ? (appState.currentUserRole === UserRole.Parent 
          ? 'https://picsum.photos/seed/currentparent/40/40' 
          : teacherProfile?.avatarUrl)
      : senderParticipant?.avatarUrl;
    
    return (
      <RNView 
        key={msg.id} 
        style={[
          styles.messageContainer, 
          isSender ? styles.senderContainer : styles.receiverContainer
        ]}
      >
        {!isSender && (
          <Image 
            source={{ uri: avatarToShow || 'https://picsum.photos/seed/defaultavatar/40/40' }} 
            style={styles.avatar}
          />
        )}
        
        <RNView style={[
          styles.messageBubble,
          isSender ? styles.senderBubble : styles.receiverBubble
        ]}>
          <Text style={isSender ? styles.senderText : styles.receiverText}>
            {msg.text}
          </Text>
          <Text style={[
            styles.timeText,
            isSender ? styles.senderTime : styles.receiverTime
          ]}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </RNView>
        
        {isSender && appState.currentUserRole === UserRole.Parent && ( 
          <Image 
            source={{ uri: avatarToShow || 'https://picsum.photos/seed/parentUser/40/40' }} 
            style={styles.avatar}
          />
        )}
        
        {isSender && appState.currentUserRole === UserRole.Teacher && teacherProfile && ( 
          <Image 
            source={{ uri: teacherProfile.avatarUrl || 'https://picsum.photos/seed/teacherUser/40/40' }} 
            style={styles.avatar}
          />
        )}
      </RNView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.length > 0 ? (
            messages.map(renderMessage)
          ) : (
            <RNView style={styles.emptyChatContainer}>
              <ChatBubbleLeftRightIcon size={48} color="#9ca3af" />
              <Text style={styles.emptyChatText}>
                This is the beginning of your conversation with {otherParticipant?.name || 'this user'}.
              </Text>
            </RNView>
          )}
        </ScrollView>

        <RNView style={styles.inputContainer}>
          <TextInput
            value={newMessageText}
            onChangeText={setNewMessageText}
            placeholder={`Message ${otherParticipant?.name || 'user'}...`}
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessageText.trim()}
            style={[
              styles.sendButton,
              !newMessageText.trim() && styles.disabledButton
            ]}
          >
            <PaperAirplaneIcon size={24} color="white" />
          </TouchableOpacity>
        </RNView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // slate-100 equivalent
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  senderContainer: {
    justifyContent: 'flex-end',
  },
  receiverContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  senderBubble: {
    backgroundColor: '#0ea5e9', // sky-500
    borderBottomRightRadius: 0,
  },
  receiverBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  senderText: {
    color: 'white',
    fontSize: 14,
  },
  receiverText: {
    color: '#1f2937', // gray-800
    fontSize: 14,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
  },
  senderTime: {
    color: '#bae6fd', // sky-200
    textAlign: 'right',
  },
  receiverTime: {
    color: '#9ca3af', // gray-400
    textAlign: 'left',
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    color: '#9ca3af', // gray-400
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 30 : 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // gray-200
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 14,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0ea5e9', // sky-500
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatRoomScreen;