export interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
  recommendedProducts?: any[];
}
