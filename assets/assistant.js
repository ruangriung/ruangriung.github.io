// a// assets/assistant.js
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
    this.uploadedFiles = [];
    this.availableModels = [];
    this.currentModel = "openai";
    
    this.init();
  }

  init() {
    this.createUI();
    this.setupEventListeners();
    this.loadConversationHistory();
    this.loadSavedConversations();
    this.fetchAvailableModels();
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

    // Create model selector container
    const modelSelectorContainer = document.createElement('div');
    modelSelectorContainer.className = 'rr-assistant-model-selector-container';
    
    // Create model selector label
    const modelLabel = document.createElement('span');
    modelLabel.className = 'rr-assistant-model-label';
    modelLabel.textContent = 'AI Model:';
    
    // Create model selector dropdown
    this.modelSelect = document.createElement('select');
    this.modelSelect.className = 'rr-assistant-model-select';
    this.modelSelect.title = 'Select AI Model';
    
    const loadingOption = document.createElement('option');
    loadingOption.value = 'loading';
    loadingOption.textContent = 'Loading models...';
    this.modelSelect.appendChild(loadingOption);
    
    modelSelectorContainer.appendChild(modelLabel);
    modelSelectorContainer.appendChild(this.modelSelect);

    // Create file input container
    const fileInputContainer = document.createElement('div');
    fileInputContainer.className = 'rr-assistant-file-input-container';
    
    // Create upload button
    const uploadButton = document.createElement('button');
    uploadButton.className = 'rr-assistant-upload';
    uploadButton.innerHTML = '<i class="fas fa-paperclip"></i>';
    uploadButton.title = 'Attach file';
    
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,.pdf,.txt,.doc,.docx';
    fileInput.style.display = 'none';
    
    // Create image preview container
    const imagePreview = document.createElement('div');
    imagePreview.className = 'rr-assistant-image-preview';
    
    // Create textarea field
    this.chatTextarea = document.createElement('textarea');
    this.chatTextarea.className = 'rr-assistant-textarea';
    this.chatTextarea.placeholder = 'Ask me anything or upload a file...';
    this.chatTextarea.rows = 3;
    
    // Create send button container
    const sendButtonContainer = document.createElement('div');
    sendButtonContainer.className = 'rr-assistant-send-container';
    
    // Create send button
    this.sendButton = document.createElement('button');
    this.sendButton.className = 'rr-assistant-send';
    this.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
    this.sendButton.disabled = true;
    
    // Assemble file input container
    fileInputContainer.appendChild(uploadButton);
    fileInputContainer.appendChild(fileInput);
    fileInputContainer.appendChild(imagePreview);
    
    // Assemble send button container
    sendButtonContainer.appendChild(this.sendButton);
    
    // Assemble input container
    inputContainer.appendChild(modelSelectorContainer);
    inputContainer.appendChild(fileInputContainer);
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
    this.fileInput = fileInput;
    this.imagePreview = imagePreview;
  }

  async fetchAvailableModels() {
    try {
      const response = await fetch('https://text.pollinations.ai/models');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      this.availableModels = await response.json();
      this.updateModelSelector();
    } catch (error) {
      console.error('Error fetching models:', error);
      this.showNotification('Failed to load models. Using default.');
      this.availableModels = [{ id: 'openai', name: 'OpenAI (Default)' }];
      this.updateModelSelector();
    }
  }

  updateModelSelector() {
    if (!this.modelSelect) return;
    
    this.modelSelect.innerHTML = '';
    
    if (this.availableModels.length === 0) {
      const option = document.createElement('option');
      option.value = 'openai';
      option.textContent = 'Default (OpenAI)';
      this.modelSelect.appendChild(option);
      return;
    }
    
    this.availableModels.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name || model.id;
      option.selected = model.id === this.currentModel;
      this.modelSelect.appendChild(option);
    });
  }

  setupEventListeners() {
    // Toggle chat
    this.assistantToggle.addEventListener('click', () => this.toggleChat());
    this.closeButton.addEventListener('click', () => this.toggleChat());
    
    // Textarea events
    this.chatTextarea.addEventListener('input', () => {
      this.sendButton.disabled = this.chatTextarea.value.trim() === '' && this.uploadedFiles.length === 0;
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
    
    // File upload events
    const uploadButton = this.chatContainer.querySelector('.rr-assistant-upload');
    uploadButton.addEventListener('click', () => this.fileInput.click());
    
    this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    
    // Model selection change
    if (this.modelSelect) {
      this.modelSelect.addEventListener('change', (e) => {
        this.currentModel = e.target.value;
        const modelName = e.target.selectedOptions[0].textContent;
        this.showNotification(`Model changed to: ${modelName}`);
      });
    }
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

  async handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    // Clear previous files
    this.uploadedFiles = [];
    this.imagePreview.innerHTML = '';
    this.imagePreview.style.display = 'none';
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showNotification('File too large (max 5MB)');
        continue;
      }
      
      this.uploadedFiles.push(file);
      
      if (file.type.startsWith('image/')) {
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgContainer = document.createElement('div');
          imgContainer.style.position = 'relative';
          imgContainer.style.marginRight = '8px';
          
          const img = document.createElement('img');
          img.className = 'rr-assistant-preview-img';
          img.src = e.target.result;
          
          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'rr-assistant-cancel-image';
          cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
          cancelBtn.onclick = () => this.removeUploadedFile(file);
          
          imgContainer.appendChild(img);
          imgContainer.appendChild(cancelBtn);
          this.imagePreview.appendChild(imgContainer);
          this.imagePreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    }
    
    if (this.uploadedFiles.length > 0) {
      this.sendButton.disabled = false;
      this.showNotification(`${this.uploadedFiles.length} file(s) ready for analysis`);
    }
    
    // Reset file input
    this.fileInput.value = '';
  }

  removeUploadedFile(file) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
    
    // Update preview
    this.imagePreview.innerHTML = '';
    if (this.uploadedFiles.length === 0) {
      this.imagePreview.style.display = 'none';
      this.sendButton.disabled = this.chatTextarea.value.trim() === '';
    } else {
      this.uploadedFiles.forEach(f => {
        if (f.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.marginRight = '8px';
            
            const img = document.createElement('img');
            img.className = 'rr-assistant-preview-img';
            img.src = e.target.result;
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'rr-assistant-cancel-image';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
            cancelBtn.onclick = () => this.removeUploadedFile(f);
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(cancelBtn);
            this.imagePreview.appendChild(imgContainer);
          };
          reader.readAsDataURL(f);
        }
      });
      this.imagePreview.style.display = 'flex';
    }
  }

  async sendMessage() {
    if (this.isGenerating) return;
    
    const message = this.chatTextarea.value.trim();
    const hasFiles = this.uploadedFiles.length > 0;
    
    if (!message && !hasFiles) return;
    
    // Add user message to UI
    if (message) {
      this.addMessage('user', message);
    }
    
    // Add file preview to UI
    if (hasFiles) {
      const fileMessage = `Uploaded ${this.uploadedFiles.length} file(s): ${this.uploadedFiles.map(f => f.name).join(', ')}`;
      this.addMessage('user', fileMessage);
      
      // Show thumbnails for images
      this.uploadedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement('img');
            img.className = 'rr-assistant-message-image';
            img.src = e.target.result;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'rr-assistant-message user-message';
            messageDiv.style.maxWidth = '100%';
            messageDiv.style.padding = '5px';
            messageDiv.appendChild(img);
            
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    this.chatTextarea.value = '';
    this.sendButton.disabled = true;
    this.adjustTextareaHeight();
    
    // Add assistant thinking message
    const thinkingId = this.addMessage('assistant', 'Thinking...', true);
    
    // Add to conversation history
    if (!this.currentConversationId) {
      this.currentConversationId = 'conv-' + Date.now();
    }
    
    if (message) {
      this.conversationHistory.push({
        conversationId: this.currentConversationId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });
    }
    
    this.isGenerating = true;
    
    try {
      if (hasFiles) {
        // Handle file analysis
        await this.analyzeFiles(thinkingId);
      } else {
        // Handle text message
        await this.streamChatCompletion(
          this.getCurrentMessages(),
          (content) => {
            this.updateMessage(thinkingId, content);
          }
        );
      }
      
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
      this.uploadedFiles = [];
      this.imagePreview.innerHTML = '';
      this.imagePreview.style.display = 'none';
    }
  }

  async analyzeFiles(thinkingId) {
    try {
      let responseContent = '';
      
      for (const file of this.uploadedFiles) {
        if (file.type.startsWith('image/')) {
          // Analyze image
          const base64Image = await this.fileToBase64(file);
          const question = this.chatTextarea.value.trim() || "What's in this image?";
          
          const imageResponse = await this.analyzeImage(file, question);
          responseContent += `Analysis of ${file.name}:\n${imageResponse}\n\n`;
        } else {
          // Handle other file types (PDF, text, etc.)
          const textContent = await this.extractTextFromFile(file);
          responseContent += `Contents of ${file.name}:\n${textContent}\n\n`;
        }
        
        this.updateMessage(thinkingId, responseContent);
        this.scrollToBottom();
      }
      
      if (responseContent.trim() === '') {
        responseContent = "I couldn't extract any meaningful content from the files.";
      }
      
      this.updateMessage(thinkingId, responseContent);
    } catch (error) {
      console.error('Error analyzing files:', error);
      this.updateMessage(thinkingId, "Sorry, I couldn't analyze the files. Please try again.");
    }
  }

  async analyzeImage(file, question) {
    const base64Image = await this.fileToBase64(file);
    
    const payload = {
      model: this.currentModel,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: question },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    };

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  }

  async extractTextFromFile(file) {
    // Simple implementation - for production you'd want proper text extraction
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return await file.text();
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // Note: PDF extraction would require a PDF.js library or backend service
      return "PDF content extraction would require additional libraries. For now, please upload text files or images.";
    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      // Note: DOCX extraction would require a library like mammoth.js
      return "Word document content extraction would require additional libraries. For now, please upload text files or images.";
    } else {
      return "I can't process this file type. Please upload images, text files, or PDFs.";
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // result includes 'data:mime/type;base64,' prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'rr-assistant-content-container';
    
    // Add content
    const contentElement = document.createElement('div');
    contentElement.className = 'rr-assistant-content';
    contentElement.textContent = content;
    
    // Add copy button (only for assistant messages)
    if (role === 'assistant') {
      const copyButton = document.createElement('button');
      copyButton.className = 'rr-assistant-copy-btn';
      copyButton.title = 'Copy to clipboard';
      copyButton.innerHTML = '<i class="far fa-copy"></i>';
      copyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const finalContent = contentContainer.querySelector('.rr-assistant-content').textContent;
        this.copyToClipboard(finalContent);
      });
      contentContainer.appendChild(copyButton);
    }
    
    contentContainer.appendChild(contentElement);
    messageElement.appendChild(avatar);
    messageElement.appendChild(contentContainer);
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
          
          // Add copy button if this is an assistant message
          if (messageElement.classList.contains('assistant-message')) {
            const copyButton = document.createElement('button');
            copyButton.className = 'rr-assistant-copy-btn';
            copyButton.title = 'Copy to clipboard';
            copyButton.innerHTML = '<i class="far fa-copy"></i>';
            copyButton.addEventListener('click', (e) => {
              e.stopPropagation();
              const finalContent = messageElement.querySelector('.rr-assistant-content').textContent;
              this.copyToClipboard(finalContent);
            });
            
            const contentContainer = messageElement.querySelector('.rr-assistant-content-container');
            if (contentContainer) {
              // Remove existing copy button if any
              const existingBtn = contentContainer.querySelector('.rr-assistant-copy-btn');
              if (existingBtn) existingBtn.remove();
              
              contentContainer.appendChild(copyButton);
            }
          }
        } else {
          contentElement.textContent += newContent;
        }
      }
    }
  }

  copyToClipboard(text) {
    // First try the modern Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification('Copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy with Clipboard API:', err);
        this.fallbackCopyToClipboard(text);
      });
    } else {
      // Fallback for browsers without Clipboard API support
      this.fallbackCopyToClipboard(text);
    }
  }

  fallbackCopyToClipboard(text) {
    try {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      
      // Try the deprecated execCommand method
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        this.showNotification('Copied to clipboard!');
      } else {
        throw new Error('execCommand copy failed');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.showNotification('Failed to copy text. Please copy manually.');
      
      // As a last resort, show the text in an alert so they can copy manually
      prompt('Please copy this text:', text);
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
      model: this.currentModel,
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