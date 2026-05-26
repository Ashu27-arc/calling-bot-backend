const mongoose = require('mongoose');

const agentSettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One setting per user for now
  },
  mode: {
    type: String,
    enum: ['interview', 'support', 'sales'],
    default: 'support',
  },
  language: {
    type: String,
    enum: ['en-US', 'hi-IN', 'multilingual'], // multilingual for combined Hindi + English
    default: 'multilingual',
  },
  voiceId: {
    type: String,
    default: 'default-voice-id', // Could be an ElevenLabs voice ID
  },
  systemPrompt: {
    type: String,
    default: 'You are a helpful AI assistant representing our company. Please assist the caller with their inquiries.',
  },
  autoRetryFailedCalls: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware to update the updatedAt timestamp
agentSettingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AgentSetting', agentSettingSchema);
