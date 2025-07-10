import { GoogleGenerativeAI } from "@google/generative-ai";
import backendService from './backendService';

class GeminiService {
  constructor() {
    const apiKey = "AIzaSyATZl5ZwxlCCy6InTxKhTY0ehQEynu10qI";

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // System prompt to make the AI focused on Kenya travel
    this.systemPrompt = `You are Peer Ai, an expert AI travel assistant specializing in Kenya tourism. You help users plan trips, find destinations, book experiences, and discover the best of Kenya. 

Key expertise areas:
- Safari experiences in Kenya's national parks and reserves
- Beach destinations along the Kenyan coast
- Cultural experiences and heritage sites
- Adventure activities and mountain trekking
- Local cuisine and food experiences
- Accommodation recommendations
- Budget planning and cost estimates
- Best times to visit different regions
- Transportation and logistics

Always provide helpful, accurate, and enthusiastic responses about Kenya. If users ask about other countries, politely redirect them back to Kenya travel topics. Keep responses concise but informative, and always encourage users to explore Kenya's amazing offerings.`;
  }

  async sendMessage(message, chatHistory = [], user = null) {
    if (!this.genAI) {
      return {
        success: false,
        message: "AI service is not available. Please configure your Gemini API key.",
      };
    }

    try {
      // Get enhanced user context from backend if user is logged in
      let enhancedUserContext = "";
      if (user) {
        try {
          const contextResult = await backendService.getAIContext();
          if (contextResult.success) {
            const { userContext, recentBookings, chatHistory: pastChats } = contextResult.data;
            
            enhancedUserContext = `\n\nUser Profile:
- Name: ${userContext.name}
- Location: ${userContext.location || 'Not specified'}
- Member since: ${userContext.join_date?.split('T')[0] || 'Recently joined'}
- Travel Style: ${userContext.travel_style || 'Not specified'}
- Budget Range: ${userContext.budget_range || 'Not specified'}
- Preferred Activities: ${userContext.preferred_activities || 'Not specified'}
- Interests: ${userContext.interests || 'Not specified'}

Recent Bookings:
${recentBookings.length > 0 
  ? recentBookings.map(booking => `- ${booking.name} (${booking.category}) on ${booking.start_date}`).join('\n')
  : '- No recent bookings'}

Recent Chat Context:
${pastChats.length > 0 
  ? pastChats.slice(-3).map(chat => `User: ${chat.message}\nPeer AI: ${chat.response}`).join('\n')
  : '- No previous conversations'}

Provide personalized recommendations based on this context while keeping focus on Kenya travel.`;
          }
        } catch (error) {
          console.error('Failed to get AI context:', error);
          // Fallback to basic user context
          enhancedUserContext = `\n\nUser Information:\n- Name: ${user.name}\n- Location: ${user.location || 'Not specified'}\n- Member since: ${user.joinDate || 'Recently joined'}\n\nPersonalize your responses when appropriate, but keep them focused on Kenya travel.`;
        }
      }

      // Build conversation context
      const contextPrompt =
        this.systemPrompt +
        enhancedUserContext +
        "\n\nConversation history:\n" +
        chatHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n") +
        `\n\nUser: ${message}\n\nPeer Ai:`;

      const result = await this.model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      // Save chat interaction to backend for future context
      if (user) {
        try {
          await backendService.saveChatHistory(message, text);
        } catch (error) {
          console.error('Failed to save chat history:', error);
          // Don't fail the chat if saving fails
        }
      }

      return {
        success: true,
        message: text,
      };
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return {
        success: false,
        message: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      };
    }
  }

  // Quick responses for common Kenya travel queries
  getQuickResponses() {
    return [
      "Tell me about Maasai Mara safari",
      "Best beaches in Kenya",
      "When to visit Mount Kenya",
      "Cost of a 7-day Kenya trip",
      "Cultural experiences in Kenya",
    ];
  }
}

export default new GeminiService();
