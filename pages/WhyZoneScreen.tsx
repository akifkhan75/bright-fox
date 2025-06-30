import React, { useState, useContext, useCallback, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../App';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAnswerForWhyQuestion } from '../services/geminiService';
import { Message, AgeGroup } from '../types';
// import { QuestionMarkCircleIcon, PaperAirplaneIcon, SparklesIcon } from './icons'; // You'll need to create or import these icons

const mapAgeGroupForGemini = (ageGroup: AgeGroup | null): '3-5' | '6-8' | null => {
  if (!ageGroup) return null;
  switch (ageGroup) {
    case '2-4':
      return '3-5';
    case '5-7':
      return '6-8'; 
    case '8-10':
      return '6-8';
    default:
      return null;
  }
};

const WhyZoneScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { kidProfile } = context;

  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSubmitQuestion = useCallback(async () => {
    if (!question.trim()) return;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      text: question, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setError(null);

    setTimeout(scrollToBottom, 100);

    try {
      const mappedAgeGroup = mapAgeGroupForGemini(kidProfile.ageGroup);
      const { answer, sources } = await getAnswerForWhyQuestion(userMessage.text, mappedAgeGroup);
      let botText = answer;
      if (sources && sources.length > 0) {
        botText += "\n\nSource(s):\n" + sources.map(s => `- ${s.web?.title || 'Unknown Source'}: ${s.web?.uri}`).join('\n');
      }
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: botText, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Hmm, I'm pondering that... Try asking again in a moment!", 
        sender: 'system', 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, errorMessage]);
      setError("Couldn't get an answer right now. Please check your connection or API key setup.");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [question, kidProfile.ageGroup]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          {/* <QuestionMarkCircleIcon style={styles.headerIcon} /> */}
          <Text style={styles.title}>The Why Zone!</Text>
        </View>
        <Text style={styles.subtitle}>Got a curious question? Ask away! I'll try my best to answer.</Text>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollToBottom()}
        >
          {conversation.length === 0 && !isLoading && (
            <View style={styles.emptyChat}>
              {/* <SparklesIcon style={styles.sparklesIcon} /> */}
              <Text style={styles.emptyChatText}>Ask anything like "Why is the sky blue?" or "How do birds fly?"</Text>
            </View>
          )}
          {conversation.map(msg => (
            <View 
              key={msg.id} 
              style={[
                styles.messageContainer,
                msg.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
              ]}
            >
              <View 
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userMessageBubble : 
                  msg.sender === 'bot' ? styles.botMessageBubble :
                  styles.systemMessageBubble
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={styles.botMessageContainer}>
              <View style={styles.botMessageBubble}>
                <LoadingSpinner size="sm" text="Thinking..." />
              </View>
            </View>
          )}
        </ScrollView>
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Ask your question here..."
            style={styles.input}
            editable={!isLoading}
            onSubmitEditing={handleSubmitQuestion}
          />
          <Button 
            onPress={handleSubmitQuestion} 
            disabled={isLoading || !question.trim()} 
            style={styles.sendButton}
          >
            {/* <PaperAirplaneIcon style={styles.sendIcon} /> */}
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefce8', // yellow-50
  },
  card: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    color: '#d97706', // yellow-600
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d97706', // yellow-600
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563', // gray-600
    marginBottom: 16,
  },
  chatContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
    marginBottom: 16,
    maxHeight: 400,
    minHeight: 200,
  },
  chatContent: {
    padding: 12,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  sparklesIcon: {
    width: 48,
    height: 48,
    color: '#9ca3af', // gray-400
    marginBottom: 8,
  },
  emptyChatText: {
    color: '#9ca3af', // gray-400
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 8,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageBubble: {
    backgroundColor: '#0284c7', // skyBlue
    borderBottomRightRadius: 0,
  },
  botMessageBubble: {
    backgroundColor: '#e5e7eb', // gray-200
    borderBottomLeftRadius: 0,
  },
  systemMessageBubble: {
    backgroundColor: '#fee2e2', // red-100
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#1f2937', // gray-800
  },
  systemMessageText: {
    color: '#b91c1c', // red-700
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  errorText: {
    color: '#dc2626', // red-600
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 12,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#d97706', // yellow-600
    padding: 12,
  },
  sendIcon: {
    width: 20,
    height: 20,
    color: 'white',
  },
});

export default WhyZoneScreen;