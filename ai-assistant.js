class PeerAI {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        
        // Enhanced Kenya knowledge base
        this.kenyaData = {
            destinations: {
                'maasai mara': {
                    name: 'Maasai Mara National Reserve',
                    price: 'KSH 25,000 - 45,000/day',
                    rating: '4.9/5',
                    bestTime: 'July-October (Great Migration)',
                    activities: ['Game drives', 'Hot air balloon safari', 'Cultural visits'],
                    description: 'World-famous for the Great Migration and Big Five wildlife viewing'
                },
                'diani beach': {
                    name: 'Diani Beach, Mombasa',
                    price: 'KSH 8,500 - 25,000/day',
                    rating: '4.7/5',
                    bestTime: 'December-March, July-October',
                    activities: ['Snorkeling', 'Diving', 'Dhow sailing', 'Beach relaxation'],
                    description: 'Pristine white sand beaches with crystal clear Indian Ocean waters'
                },
                'amboseli': {
                    name: 'Amboseli National Park',
                    price: 'KSH 18,500 - 35,000/day',
                    rating: '4.8/5',
                    bestTime: 'June-October, January-February',
                    activities: ['Elephant watching', 'Mount Kilimanjaro views', 'Photography'],
                    description: 'Famous for large elephant herds and iconic Mount Kilimanjaro backdrop'
                },
                'mount kenya': {
                    name: 'Mount Kenya National Park',
                    price: 'KSH 15,000 - 28,000/day',
                    rating: '4.6/5',
                    bestTime: 'January-February, June-September',
                    activities: ['Mountain climbing', 'Hiking', 'Wildlife viewing'],
                    description: "Africa's second-highest peak with diverse ecosystems and challenging climbs"
                }
            },
            experiences: {
                'safari': ['Maasai Mara', 'Amboseli', 'Tsavo', 'Samburu', 'Lake Nakuru'],
                'beach': ['Diani Beach', 'Watamu', 'Malindi', 'Lamu Island'],
                'culture': ['Nairobi museums', 'Maasai villages', 'Lamu Old Town', 'Bomas of Kenya'],
                'adventure': ['Mount Kenya climbing', 'Hell\'s Gate cycling', 'White water rafting'],
                'luxury': ['Private conservancies', 'Luxury lodges', 'Helicopter tours']
            },
            costs: {
                accommodation: {
                    budget: 'KSH 2,000 - 5,000/night',
                    midrange: 'KSH 8,000 - 15,000/night',
                    luxury: 'KSH 25,000 - 65,000/night'
                },
                transport: {
                    local: 'KSH 50 - 200/trip',
                    intercity: 'KSH 1,500 - 5,000/trip',
                    safari_vehicle: 'KSH 8,000 - 15,000/day'
                },
                food: {
                    street_food: 'KSH 100 - 300/meal',
                    restaurant: 'KSH 800 - 2,500/meal',
                    fine_dining: 'KSH 3,000 - 6,000/meal'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.addMessage('bot', "Jambo! I'm Peer AI, your AI travel companion. What Kenya adventure can I help you plan today?");
        
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.sendButton.addEventListener('click', () => this.sendMessage());
    }
    
    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        const bubble = document.createElement('div');
        bubble.className = 'message-content';
        bubble.innerHTML = content.replace(/\n/g, '<br>');
        messageDiv.appendChild(bubble);
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        this.messageInput.value = '';
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        const bubble = document.createElement('div');
        bubble.className = 'message-content';
        bubble.textContent = 'Typing...';
        typingDiv.appendChild(bubble);
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        setTimeout(() => {
            bubble.textContent = this.generateResponse(message);
        }, 1200);
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Enhanced destination-specific responses
        if (lowerMessage.includes('maasai mara') || lowerMessage.includes('masai mara')) {
            const dest = this.kenyaData.destinations['maasai mara'];
            return `🦁 **${dest.name}** (${dest.rating} rating)\n\n${dest.description}\n\n💰 **Cost:** ${dest.price}\n🗓️ **Best time:** ${dest.bestTime}\n🎯 **Activities:** ${dest.activities.join(', ')}\n\n**🤝 Travel Buddies Available:** Found 234 verified guides and travelers in this area!\n\n**📊 Reviews say:** "Incredible wildlife experience" - 89% recommend for first-time Kenya visitors.`;
        }
        
        if (lowerMessage.includes('diani') || lowerMessage.includes('beach')) {
            const dest = this.kenyaData.destinations['diani beach'];
            return `🏖️ **${dest.name}** (${dest.rating} rating)\n\n${dest.description}\n\n💰 **Cost:** ${dest.price}\n🗓️ **Best time:** ${dest.bestTime}\n🎯 **Activities:** ${dest.activities.join(', ')}\n\n**🤝 Travel Buddies Available:** 156 beach specialists and water sports experts ready to connect!\n\n**🌊 Insider tip:** Visit during low tide for the best coral viewing while snorkeling.`;
        }
        
        if (lowerMessage.includes('amboseli')) {
            const dest = this.kenyaData.destinations['amboseli'];
            return `🐘 **${dest.name}** (${dest.rating} rating)\n\n${dest.description}\n\n💰 **Cost:** ${dest.price}\n🗓️ **Best time:** ${dest.bestTime}\n🎯 **Activities:** ${dest.activities.join(', ')}\n\n**📸 Photo tip:** Best Kilimanjaro views are early morning (6-8 AM) when clouds haven't formed yet!\n\n**🤝 Local Guides:** 78 Maasai guides available for authentic cultural experiences.`;
        }
        
        // Budget and cost queries
        if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            return `💰 **Kenya Travel Budget Guide (in KSH)**\n\n**🏨 Accommodation:**\n• Budget: ${this.kenyaData.costs.accommodation.budget}\n• Mid-range: ${this.kenyaData.costs.accommodation.midrange}\n• Luxury: ${this.kenyaData.costs.accommodation.luxury}\n\n**🚗 Transport:**\n• Local transport: ${this.kenyaData.costs.transport.local}\n• Inter-city: ${this.kenyaData.costs.transport.intercity}\n• Safari vehicle: ${this.kenyaData.costs.transport.safari_vehicle}\n\n**🍽️ Food:**\n• Street food: ${this.kenyaData.costs.food.street_food}\n• Restaurant: ${this.kenyaData.costs.food.restaurant}\n• Fine dining: ${this.kenyaData.costs.food.fine_dining}\n\n**💡 Tip:** A 7-day mid-range Kenya trip typically costs KSH 120,000-180,000 per person.`;
        }
        
        // Safari planning
        if (lowerMessage.includes('safari')) {
            return `🦁 **Kenya Safari Planning Guide**\n\n**🏆 Top Safari Destinations:**\n• Maasai Mara - Great Migration (July-Oct)\n• Amboseli - Elephant herds & Kilimanjaro views\n• Tsavo - Largest park, red elephants\n• Lake Nakuru - Rhinos & flamingos\n• Samburu - Unique northern species\n\n**⏰ Best Times:**\n• Dry season: June-October\n• Migration: July-October (Mara)\n• Calving season: January-March (Serengeti)\n\n**🤝 Safari Buddies:** 342 experienced safari guides available!\n\n**💡 Pro tip:** Book accommodations 3-6 months ahead for peak season.`;
        }
        
        // Travel buddy matching
        if (lowerMessage.includes('buddy') || lowerMessage.includes('guide') || lowerMessage.includes('friend')) {
            return `🤝 **Travel Buddy Matching Service**\n\n**Available in your area:**\n• 👨‍🏫 James Mwangi - Safari expert (Nairobi) - 4.9★\n• 👩‍🎓 Sarah Wanjiku - Beach specialist (Mombasa) - 4.8★\n• 🧗‍♂️ David Kiprop - Adventure guide (Nakuru) - 4.7★\n• 👩‍🎨 Grace Akinyi - Cultural expert (Kisumu) - 4.9★\n\n**🔍 Filter by:**\n• Experience level\n• Languages spoken\n• Special interests\n• Budget range\n\n**✅ All buddies are verified** with background checks and traveler reviews!`;
        }
        
        // AI capabilities and team
        if (lowerMessage.includes('team') || lowerMessage.includes('who built') || lowerMessage.includes('developers')) {
            return `👥 **Meet Team Safari Innovators**\n\n**🚀 Built by 4 passionate Kenyan innovators:**\n• Alex Kimani - Lead Developer (AI & Full-stack)\n• Maria Wanjiru - Product Manager (Travel Industry Expert)\n• John Otieno - Data Scientist (ML & Recommendations)\n• Grace Muthoni - UX Designer (User Experience)\n\n**🎯 Our Mission:** Revolutionize Kenya's travel industry through technology, community, and authentic local experiences.\n\n**📊 Platform Stats:**\n• 2.3M+ experiences catalogued\n• 950K+ verified reviews\n• 450K+ active travel community\n• 24/7 AI assistance`;
        }
        
        // General help and capabilities
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return `🔧 **Here's how I can help you explore Kenya:**\n\n**📍 Destination Planning:**\n• Recommend places based on interests\n• Provide cost estimates in KSH\n• Share best travel times\n• Connect with local experts\n\n**🎯 Trip Planning:**\n• Create custom itineraries\n• Book accommodations & activities\n• Arrange airport transfers\n• Plan safari experiences\n\n**🤝 Community Features:**\n• Match with travel buddies\n• Connect with local guides\n• Join travel groups\n• Share experiences & reviews\n\n**💡 Smart Recommendations:**\n• AI-powered suggestions\n• Real-time travel updates\n• Weather & safety info\n• Local events & festivals`;
        }
        
        // Default enhanced response
        return `🇰🇪 I'd love to help you explore Kenya! I can assist with:\n\n• **Destination recommendations** - Safari, beach, cultural, adventure\n• **Budget planning** - Costs in Kenyan Shillings\n• **Travel buddy matching** - Connect with verified locals\n• **Trip itineraries** - Customized for your interests\n• **Real-time assistance** - 24/7 support\n\nTry asking about specific destinations like "Tell me about Maasai Mara" or "What's the cost of a Kenya safari?" \n\n**🌟 Popular right now:** Maasai Mara (Great Migration season), Diani Beach, Mount Kenya climbing!`;
    }
}

// Initialize the AI assistant when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PeerAI();
});
