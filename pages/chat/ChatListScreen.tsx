import React, { useContext, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, ChatConversation, ChatParticipant } from '../../types';
import Card from '../../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatListScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.appState.currentUserRole || 
      (context.appState.currentUserRole !== UserRole.Parent && 
       context.appState.currentUserRole !== UserRole.Teacher)) {
    context?.setViewWithPath(ViewType.RoleSelection, '/roleselection', { replace: true });
    return (
      <View style={styles.centeredContainer}>
        <Text>Access Denied. Please log in.</Text>
      </View>
    );
  }

  const { appState, setViewWithPath } = context;
  const currentUserId = appState.currentUserRole === UserRole.Parent 
    ? appState.currentParentProfileId 
    : appState.currentTeacherProfileId;

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
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  const handleCardPress = (convoId: string) => {
    setViewWithPath(ViewType.ChatRoomScreen, `/chatroomscreen/${convoId}`);
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="message-text" size={24} color="#0284c7" />
        <Text style={styles.headerText}>My Messages</Text>
      </View>

      {userConversations.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Icon name="message-text" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No conversations yet.</Text>
          {appState.currentUserRole === UserRole.Parent && (
            <Text style={styles.emptySubtext}>Start a chat by visiting a teacher's profile.</Text>
          )}
          {appState.currentUserRole === UserRole.Teacher && (
            <Text style={styles.emptySubtext}>Parents can initiate chats with you.</Text>
          )}
        </Card>
      ) : (
        <View style={styles.conversationList}>
          {userConversations.map(convo => {
            const otherParticipant = getOtherParticipant(convo);
            const unreadMessages = convo.unreadCount?.[currentUserId] || 0;

            return (
              <TouchableOpacity 
                key={convo.id}
                onPress={() => handleCardPress(convo.id)}
              >
                <Card style={[
                  styles.conversationCard,
                  unreadMessages > 0 && styles.unreadCard
                ]}>
                  <View style={styles.conversationContent}>
                    {otherParticipant?.avatarUrl ? (
                      <Image 
                        source={{ uri: otherParticipant.avatarUrl }} 
                        style={styles.avatar}
                      />
                    ) : (
                      <MaterialIcons name="account-circle" size={48} color="#d1d5db" />
                    )}
                    <View style={styles.messageInfo}>
                      <View style={styles.messageHeader}>
                        <Text style={styles.participantName} numberOfLines={1}>
                          {otherParticipant?.name || 'Unknown User'}
                        </Text>
                        {convo.lastMessageTimestamp && (
                          <Text style={styles.messageTime}>
                            {formatTime(convo.lastMessageTimestamp)}
                          </Text>
                        )}
                      </View>
                      <View style={styles.messagePreview}>
                        <Text style={styles.messageText} numberOfLines={1}>
                          {convo.lastMessageText || 'No messages yet...'}
                        </Text>
                        {unreadMessages > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>
                              {unreadMessages > 9 ? '9+' : unreadMessages}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369a1',
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#4b5563',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 4,
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
  conversationList: {
    gap: 12,
  },
  conversationCard: {
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unreadCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;