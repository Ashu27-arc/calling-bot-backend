const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
  },
  callSid: {
    type: String, // Twilio Call SID
    required: true,
    unique: true,
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true,
  },
  status: {
    type: String,
    enum: ['queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer', 'canceled'],
    default: 'queued',
  },
  duration: {
    type: Number, // In seconds
    default: 0,
  },
  recordingUrl: {
    type: String,
  },
  transcript: {
    type: String, // Full text transcript
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  cost: {
    type: Number,
  }
});

module.exports = mongoose.model('CallLog', callLogSchema);
