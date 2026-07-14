async function saveMessage(sessionId, role, content) {}
async function createSession(sessionId) {}
async function getMessages(sessionId) { return []; }
async function getAllSessions() { return []; }

module.exports = {
  saveMessage,
  createSession,
  getMessages,
  getAllSessions
};