// assets/assistant.js
class RRAssistant {
  constructor() {
    this.chatContainer = null;
    this.chatTextarea = null;
    this.chatMessages = null;
    this.sendButton = null;
    this.closeButton = null;
    this.clearButton = null;
    this.assistantToggle = null;
    this.isOpen = false;
    this.conversationHistory = [];
    this.isGenerating = false;
    this.currentConversationId = null;
    this.savedConversations = [];
    
    this.init();
  }

  init() {
    this.createUI();
    this.setupEventListeners();
    this.loadConversationHistory();
    this.loadSavedConversations();
  }

  createUI() {
    // Create main container
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'rr-assistant-container';
    this.chatContainer.style.display = 'none';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'rr-assistant-header';
    header.innerHTML = `
      <h3><i class="fab fa-linux"></i> RR Assistant</h3>
      <div class="rr-assistant-header-actions">
        <button class="rr-assistant-new-chat" title="New Chat"><i class="fas fa-plus"></i></button>
        <button class="rr-assistant-clear-chat" title="Clear Chat"><i class="fas fa-eraser"></i></button>
        <button class="rr-assistant-save-chat" title="Saved Chats"><i class="fas fa-save"></i></button>
      </div>
    `;
    
    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'rr-assistant-close';
    this.closeButton.innerHTML = '<i class="fas fa-times"></i>';
    header.appendChild(this.closeButton);
    
    // Create messages container
    this.chatMessages = document.createElement('div');
    this.chatMessages.className = 'rr-assistant-messages';
    
    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'rr-assistant-input-container';
    
    // Create textarea field
    this.chatTextarea = document.createElement('textarea');
    this.chatTextarea.className = 'rr-assistant-textarea';
    this.chatTextarea.placeholder = 'Tanya Saya Apa saja...';
    this.chatTextarea.rows = 3;
    
    // Create send button container
    const sendButtonContainer = document.createElement('div');
    sendButtonContainer.className = 'rr-assistant-send-container';
    
    // Create send button
    this.sendButton = document.createElement('button');
    this.sendButton.className = 'rr-assistant-send';
    this.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
    this.sendButton.disabled = true;
    
    // Assemble send button container
    sendButtonContainer.appendChild(this.sendButton);
    
    // Assemble input container
    inputContainer.appendChild(this.chatTextarea);
    inputContainer.appendChild(sendButtonContainer);
    
    // Create toggle button
    this.assistantToggle = document.createElement('button');
    this.assistantToggle.className = 'ai-text-toggle rr-assistant-toggle';
    this.assistantToggle.innerHTML = '<i class="fab fa-linux"></i> RR Assistant Chatbot';
    
    // Add to button group container
    const buttonGroupContainer = document.querySelector('.button-group-container');
    if (buttonGroupContainer) {
      buttonGroupContainer.appendChild(this.assistantToggle);
    }
    
    // Assemble chat container
    this.chatContainer.appendChild(header);
    this.chatContainer.appendChild(this.chatMessages);
    this.chatContainer.appendChild(inputContainer);
    
    // Add to document
    document.body.appendChild(this.chatContainer);
    
    // Get buttons references
    this.clearButton = this.chatContainer.querySelector('.rr-assistant-clear-chat');
  }

  setupEventListeners() {
    // Toggle chat
    this.assistantToggle.addEventListener('click', () => this.toggleChat());
    this.closeButton.addEventListener('click', () => this.toggleChat());
    
    // Textarea events
    this.chatTextarea.addEventListener('input', () => {
      this.sendButton.disabled = this.chatTextarea.value.trim() === '';
      this.adjustTextareaHeight();
    });
    
    this.chatTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!this.sendButton.disabled) {
          this.sendMessage();
        }
      }
    });
    
    // Send button
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Clear button
    this.clearButton.addEventListener('click', () => this.clearCurrentConversation());
    
    // New chat button
    const newChatButton = this.chatContainer.querySelector('.rr-assistant-new-chat');
    newChatButton.addEventListener('click', () => this.startNewConversation());
    
    // Save chat button
    const saveChatButton = this.chatContainer.querySelector('.rr-assistant-save-chat');
    saveChatButton.addEventListener('click', () => {
      this.saveCurrentConversation();
      this.showSavedConversations();
    });
  }

  adjustTextareaHeight() {
    this.chatTextarea.style.height = 'auto';
    this.chatTextarea.style.height = `${Math.min(this.chatTextarea.scrollHeight, 150)}px`;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
    this.assistantToggle.classList.toggle('active', this.isOpen);
    
    if (this.isOpen) {
      this.chatTextarea.focus();
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  async sendMessage() {
    if (this.isGenerating) return;
    
    const message = this.chatTextarea.value.trim();
    if (!message) return;
    
    // Add user message to UI
    this.addMessage('user', message);
    this.chatTextarea.value = '';
    this.sendButton.disabled = true;
    this.adjustTextareaHeight();
    
    // Add assistant thinking message
    const thinkingId = this.addMessage('assistant', 'Thinking...', true);
    
    // Add to conversation history
    if (!this.currentConversationId) {
      this.currentConversationId = 'conv-' + Date.now();
    }
    
    this.conversationHistory.push({
      conversationId: this.currentConversationId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    this.isGenerating = true;
    
    try {
      // Stream the response
      await this.streamChatCompletion(
        this.getCurrentMessages(),
        (content) => {
          this.updateMessage(thinkingId, content);
        }
      );
      
      // Add assistant response to history
      const lastMessage = document.getElementById(thinkingId);
      if (lastMessage) {
        this.conversationHistory.push({
          conversationId: this.currentConversationId,
          role: 'assistant',
          content: lastMessage.textContent,
          timestamp: new Date().toISOString()
        });
      }
      
      this.saveConversationHistory();
    } catch (error) {
      console.error('Error:', error);
      this.updateMessage(thinkingId, 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.isGenerating = false;
    }
  }

  getCurrentMessages() {
    return this.conversationHistory
      .filter(msg => msg.conversationId === this.currentConversationId)
      .map(({ role, content }) => ({ role, content }));
  }

  async streamChatCompletion(messages, onChunkReceived) {
    const url = "https://text.pollinations.ai/openai";
    const payload = {
      model: "openai",
      messages: messages,
      stream: true,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") continue;
            
            try {
              const chunk = JSON.parse(dataStr);
              const content = chunk?.choices?.[0]?.delta?.content;
              if (content) {
                onChunkReceived(content);
                this.scrollToBottom();
              }
            } catch (e) {
              console.error("Failed to parse stream chunk:", dataStr, e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error during streaming chat completion:", error);
      throw error;
    }
  }

  addMessage(role, content, isThinking = false) {
    const messageId = 'msg-' + Date.now();
    const messageElement = document.createElement('div');
    messageElement.className = `rr-assistant-message ${role}-message`;
    messageElement.id = messageId;
    
    if (isThinking) {
      messageElement.classList.add('thinking');
    }
    
    // Add avatar
    const avatar = document.createElement('div');
    avatar.className = 'rr-assistant-avatar';
    avatar.innerHTML = role === 'user' 
      ? '<i class="fas fa-user"></i>' 
      : '<i class="fas fa-robot"></i>';
    
    // Add content
    const contentElement = document.createElement('div');
    contentElement.className = 'rr-assistant-content';
    contentElement.textContent = content;
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(contentElement);
    this.chatMessages.appendChild(messageElement);
    
    this.scrollToBottom();
    return messageId;
  }

  updateMessage(id, newContent) {
    const messageElement = document.getElementById(id);
    if (messageElement) {
      const contentElement = messageElement.querySelector('.rr-assistant-content');
      if (contentElement) {
        if (messageElement.classList.contains('thinking')) {
          messageElement.classList.remove('thinking');
          contentElement.textContent = newContent;
        } else {
          contentElement.textContent += newContent;
        }
      }
    }
  }

  saveConversationHistory() {
    localStorage.setItem('rrAssistantHistory', JSON.stringify(this.conversationHistory));
  }

  loadConversationHistory() {
    const savedHistory = localStorage.getItem('rrAssistantHistory');
    if (savedHistory) {
      try {
        this.conversationHistory = JSON.parse(savedHistory);
        this.startNewConversation();
      } catch (e) {
        console.error('Failed to load conversation history:', e);
      }
    }
  }

  loadSavedConversations() {
    const saved = localStorage.getItem('rrAssistantSavedConversations');
    if (saved) {
      try {
        this.savedConversations = JSON.parse(saved) || [];
      } catch (e) {
        console.error('Failed to load saved conversations:', e);
        this.savedConversations = [];
      }
    }
  }

  saveCurrentConversation() {
    const conversation = {
      id: this.currentConversationId,
      title: `Chat ${new Date().toLocaleString()}`,
      messages: this.conversationHistory.filter(
        msg => msg.conversationId === this.currentConversationId
      ),
      createdAt: new Date().toISOString()
    };

    if (conversation.messages.length === 0) {
      this.showNotification('No messages to save!');
      return;
    }

    // Remove if already exists
    this.savedConversations = this.savedConversations.filter(
      conv => conv.id !== conversation.id
    );
    
    // Add to beginning of array
    this.savedConversations.unshift(conversation);
    
    // Save to localStorage
    localStorage.setItem(
      'rrAssistantSavedConversations',
      JSON.stringify(this.savedConversations)
    );
    
    this.showNotification('Conversation saved!');
  }

  showSavedConversations() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'rr-assistant-modal';
    
    // Modal content
    modal.innerHTML = `
      <div class="rr-assistant-modal-content">
        <div class="rr-assistant-modal-header">
          <h3><i class="fas fa-save"></i> Saved Chats</h3>
          <button class="rr-assistant-modal-close">&times;</button>
        </div>
        <div class="rr-assistant-modal-body">
          ${this.savedConversations.length > 0 
            ? this.savedConversations.map(conv => `
              <div class="rr-assistant-saved-conv" data-id="${conv.id}">
                <div class="rr-assistant-saved-title">${conv.title}</div>
                <div class="rr-assistant-saved-preview">
                  ${conv.messages[0]?.content?.substring(0, 50) || 'No messages'}...
                </div>
                <div class="rr-assistant-saved-date">
                  ${new Date(conv.createdAt).toLocaleString()}
                </div>
                <button class="rr-assistant-delete-conv" data-id="${conv.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `).join('')
            : '<div class="rr-assistant-no-saved">No saved conversations yet</div>'
          }
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.rr-assistant-modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    // Load conversation when clicked
    modal.querySelectorAll('.rr-assistant-saved-conv').forEach(el => {
      el.addEventListener('click', (e) => {
        // Don't load if delete button was clicked
        if (!e.target.closest('.rr-assistant-delete-conv')) {
          const convId = el.getAttribute('data-id');
          this.loadConversation(convId);
          modal.remove();
        }
      });
    });
    
    // Delete conversation
    modal.querySelectorAll('.rr-assistant-delete-conv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const convId = btn.getAttribute('data-id');
        this.deleteConversation(convId);
        btn.closest('.rr-assistant-saved-conv').remove();
        
        // Update empty state
        if (this.savedConversations.length === 0) {
          const body = modal.querySelector('.rr-assistant-modal-body');
          body.innerHTML = '<div class="rr-assistant-no-saved">No saved conversations yet</div>';
        }
      });
    });
  }

  loadConversation(conversationId) {
    const conversation = this.savedConversations.find(
      conv => conv.id === conversationId
    );
    
    if (!conversation) {
      this.showNotification('Conversation not found');
      return;
    }
    
    // Set current conversation
    this.currentConversationId = conversation.id;
    
    // Clear current messages
    this.chatMessages.innerHTML = '';
    
    // Load messages
    conversation.messages.forEach(msg => {
      this.addMessage(msg.role, msg.content);
    });
    
    this.showNotification('Conversation loaded');
    this.scrollToBottom();
  }

  deleteConversation(conversationId) {
    this.savedConversations = this.savedConversations.filter(
      conv => conv.id !== conversationId
    );
    
    localStorage.setItem(
      'rrAssistantSavedConversations',
      JSON.stringify(this.savedConversations)
    );
    
    this.showNotification('Conversation deleted');
  }

  clearCurrentConversation() {
    if (this.chatMessages.children.length === 0 || 
        confirm('Are you sure you want to clear this conversation?')) {
      this.chatMessages.innerHTML = '';
      
      // Remove messages for current conversation from history
      this.conversationHistory = this.conversationHistory.filter(
        msg => msg.conversationId !== this.currentConversationId
      );
      
      this.saveConversationHistory();
    }
  }

  startNewConversation() {
    this.currentConversationId = 'conv-' + Date.now();
    this.chatMessages.innerHTML = '';
    this.showNotification('New conversation started');
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'rr-assistant-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i> ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RRAssistant();
});