const Groq = require('groq-sdk');

class WebAIPipeline {
  constructor(socket, agentSettings) {
    this.socket = socket;
    this.agentSettings = agentSettings;
    
    // Conversation history for LLM
    this.messages = [
      { role: 'system', content: agentSettings?.systemPrompt || 'You are a helpful assistant. Keep your answers brief, 1 or 2 sentences max.' }
    ];

    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    this.setupSocketEvents();
  }

  setupSocketEvents() {
    this.socket.on('web_audio_stream', (audioData) => {
      // audioData is the raw chunk from the browser's MediaRecorder
      // In a real app, you stream this to Deepgram/Whisper
      // For this free demo setup, we will listen for text from the frontend's built-in Web Speech API 
      // or mock STT to keep it 100% free without requiring paid STT APIs immediately.
      console.log('Received audio chunk of size:', audioData.byteLength || audioData.length);
    });

    this.socket.on('web_speech_text', async (text) => {
      // The browser's SpeechRecognition API can send us text directly for a 100% free STT alternative!
      console.log(`User (Web): ${text}`);
      this.socket.emit('transcript', { role: 'user', text });
      
      this.messages.push({ role: 'user', content: text });
      
      try {
        const completion = await this.groq.chat.completions.create({
          model: 'llama-3.1-8b-instant', // using supported fast free llama model
          messages: this.messages,
        });
        
        const aiResponse = completion.choices[0].message.content;
        console.log(`AI (Web): ${aiResponse}`);
        
        this.messages.push({ role: 'assistant', content: aiResponse });
        this.socket.emit('transcript', { role: 'ai', text: aiResponse });
        
        // Convert AI text to Audio using a free/mock TTS, or OpenAI TTS
        // Since we want a working free demo, we can just send the text back 
        // and let the browser's SpeechSynthesis API read it!
        // This makes the entire pipeline 100% FREE.
        this.socket.emit('ai_audio_response_text', aiResponse);

        // If you had ElevenLabs:
        // const audioBuffer = await getElevenLabsAudio(aiResponse);
        // this.socket.emit('ai_audio_response', audioBuffer);
        
      } catch (error) {
        console.error('LLM Error:', error);
      }
    });

    this.socket.on('start_web_call', () => {
      console.log(`Web call started for socket: ${this.socket.id}`);
      this.sendInitialGreeting();
    });
  }

  async sendInitialGreeting() {
    const greeting = "Hello, this is your AI agent. I am ready to help you directly from your browser.";
    this.messages.push({ role: 'assistant', content: greeting });
    this.socket.emit('transcript', { role: 'ai', text: greeting });
    this.socket.emit('ai_audio_response_text', greeting);
  }
}

module.exports = WebAIPipeline;
