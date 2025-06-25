
import React, { useState, useContext, useCallback, useRef } from 'react';
import { AppContext } from '../App';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAnswerForWhyQuestion } from '../services/geminiService';
import { Message, GroundingChunk, AgeGroup } from '../types';
import { QuestionMarkCircleIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  const handleSubmitQuestion = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: question, sender: 'user', timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setQuestion(''); // Clear input
    setIsLoading(true);
    setError(null);

    // Ensure scroll after user message and before bot response
    setTimeout(scrollToBottom, 0);

    try {
      const mappedAgeGroup = mapAgeGroupForGemini(kidProfile.ageGroup);
      const { answer, sources } = await getAnswerForWhyQuestion(userMessage.text, mappedAgeGroup);
      let botText = answer;
      if (sources && sources.length > 0) {
        botText += "\n\nSource(s):\n" + sources.map(s => `- ${s.web?.title || 'Unknown Source'}: ${s.web?.uri}`).join('\n');
      }
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: botText, sender: 'bot', timestamp: new Date() };
      setConversation(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Hmm, I'm pondering that... Try asking again in a moment!", sender: 'system', timestamp: new Date() };
      setConversation(prev => [...prev, errorMessage]);
      setError("Couldn't get an answer right now. Please check your connection or API key setup.");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 0); // Scroll after bot response
    }
  }, [question, kidProfile.ageGroup]);

  return (
    <div className="p-4 md:p-6 bg-yellow-50 min-h-full flex flex-col">
      <Card className="max-w-lg mx-auto flex-grow flex flex-col w-full">
        <div className="flex items-center text-yellow-600 mb-4">
          <QuestionMarkCircleIcon className="h-8 w-8 mr-2" />
          <h2 className="text-2xl font-bold font-display">The Why Zone!</h2>
        </div>
        <p className="text-gray-600 mb-4 text-sm">Got a curious question? Ask away! I'll try my best to answer.</p>

        <div ref={chatContainerRef} className="flex-grow space-y-3 overflow-y-auto p-3 bg-white rounded-md border border-gray-200 mb-4 max-h-96 min-h-[200px]">
          {conversation.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 py-10">
              <SparklesIcon className="h-12 w-12 mx-auto mb-2"/>
              <p>Ask anything like "Why is the sky blue?" or "How do birds fly?"</p>
            </div>
          )}
          {conversation.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-2.5 rounded-xl shadow ${
                msg.sender === 'user' ? 'bg-skyBlue text-white rounded-br-none' : 
                msg.sender === 'bot' ? 'bg-gray-200 text-gray-800 rounded-bl-none' :
                'bg-red-100 text-red-700' // System/Error
              }`}>
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-[80%] p-3 rounded-lg shadow bg-gray-200 text-gray-800 rounded-bl-none">
                    <LoadingSpinner size="sm" text="Thinking..." />
                 </div>
            </div>
           )}
        </div>
        
        {error && <p className="text-red-500 text-center text-sm my-2">{error}</p>}

        <form onSubmit={handleSubmitQuestion} className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here..."
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !question.trim()} className="bg-yellow-500 hover:bg-yellow-600 !p-3">
            <PaperAirplaneIcon className="h-5 w-5 text-white"/>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default WhyZoneScreen;
