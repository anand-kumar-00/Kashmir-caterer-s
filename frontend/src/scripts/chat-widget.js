/**
 * Kashmir Caterer's (BBS) — AI Chat Widget
 * Drop-in floating chat bubble powered by Groq (via /api/chat proxy).
 *
 * Usage: <script src="/scripts/chat-widget.js"></script>
 * No API key needed here — all calls go through the backend.
 */

(function () {
  'use strict';

  /* ── Config ── */
  const API_ENDPOINT = '/api/chat';
  const BOT_NAME     = 'Kashmiria';
  const BOT_SUBTITLE = 'Kashmir Caterer\'s AI Assistant';
  const WELCOME_MSG  = 'Salaam! 👋 I\'m Kashmiria, your catering assistant. Ask me about our packages, menu items, or how to book your event!';
  const CRIMSON      = '#8B1A1A';
  const CRIMSON_DK   = '#6b1212';
  const BG_PAGE      = '#f8f5e9';

  /* ── State ── */
  let history = []; // { role, content }
  let open    = false;
  let typing  = false;

  /* ══════════════════════════════════════════
     INJECT STYLES
  ══════════════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    /* ── Widget container ── */
    #kc-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* ── Bubble trigger button ── */
    #kc-chat-bubble {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: ${CRIMSON};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(139,26,26,0.40);
      transition: transform .2s, background .18s;
      margin-left: auto;
      position: relative;
    }
    #kc-chat-bubble:hover { background: ${CRIMSON_DK}; transform: scale(1.08); }
    #kc-chat-bubble svg { width: 26px; height: 26px; fill: #fff; }

    /* Unread badge */
    #kc-chat-unread {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #e53e3e;
      color: #fff;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      display: none;
    }

    /* ── Chat panel ── */
    #kc-chat-panel {
      width: 340px;
      max-width: calc(100vw - 32px);
      height: 480px;
      max-height: calc(100vh - 110px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(61,31,13,0.22);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 14px;
      transform-origin: bottom right;
      transition: opacity .22s, transform .22s;
    }
    #kc-chat-panel.hidden {
      opacity: 0;
      transform: scale(0.85) translateY(20px);
      pointer-events: none;
    }

    /* Header */
    #kc-chat-header {
      background: linear-gradient(135deg, ${CRIMSON} 0%, #3D1F0D 100%);
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    #kc-chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    #kc-chat-header-text { flex: 1; line-height: 1.3; }
    #kc-chat-header-name { font-weight: 700; font-size: 0.95rem; }
    #kc-chat-header-sub  { font-size: 0.72rem; opacity: 0.80; }
    #kc-chat-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.75);
      font-size: 1.3rem;
      cursor: pointer;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 4px;
      transition: color .15s;
    }
    #kc-chat-close:hover { color: #fff; }

    /* Messages area */
    #kc-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: ${BG_PAGE};
    }
    #kc-chat-messages::-webkit-scrollbar { width: 5px; }
    #kc-chat-messages::-webkit-scrollbar-thumb { background: #d4c9a8; border-radius: 3px; }

    /* Message bubbles */
    .kc-msg {
      display: flex;
      gap: 7px;
      align-items: flex-end;
      max-width: 90%;
    }
    .kc-msg.bot  { align-self: flex-start; }
    .kc-msg.user { align-self: flex-end; flex-direction: row-reverse; }

    .kc-msg-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: ${CRIMSON};
      color: #fff;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-bottom: 2px;
    }
    .kc-msg.user .kc-msg-icon {
      background: #3D1F0D;
    }

    .kc-bubble {
      padding: 9px 13px;
      border-radius: 14px;
      font-size: 0.85rem;
      line-height: 1.5;
      color: #1c1007;
    }
    .kc-msg.bot  .kc-bubble {
      background: #fff;
      border: 1px solid #e5dfc8;
      border-bottom-left-radius: 4px;
    }
    .kc-msg.user .kc-bubble {
      background: ${CRIMSON};
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    /* Typing dots */
    .kc-typing-dots {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
      align-items: center;
    }
    .kc-typing-dots span {
      width: 7px;
      height: 7px;
      background: #b5a07a;
      border-radius: 50%;
      animation: kc-dot-bounce 1.1s infinite ease-in-out;
    }
    .kc-typing-dots span:nth-child(2) { animation-delay: .18s; }
    .kc-typing-dots span:nth-child(3) { animation-delay: .36s; }
    @keyframes kc-dot-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40%            { transform: translateY(-7px); }
    }

    /* Input row */
    #kc-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 10px 12px;
      background: #fff;
      border-top: 1px solid #e5dfc8;
      flex-shrink: 0;
    }
    #kc-chat-input {
      flex: 1;
      border: 1.5px solid #d4c9a8;
      border-radius: 20px;
      padding: 8px 14px;
      font: inherit;
      font-size: 0.85rem;
      outline: none;
      background: ${BG_PAGE};
      color: #1c1007;
      transition: border-color .15s;
      resize: none;
      max-height: 80px;
      overflow-y: auto;
    }
    #kc-chat-input:focus { border-color: ${CRIMSON}; }
    #kc-chat-send {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: ${CRIMSON};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background .18s;
      align-self: flex-end;
    }
    #kc-chat-send:hover:not(:disabled) { background: ${CRIMSON_DK}; }
    #kc-chat-send:disabled { opacity: 0.45; cursor: not-allowed; }
    #kc-chat-send svg { width: 17px; height: 17px; fill: #fff; }

    /* Quick reply chips */
    #kc-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 12px 10px;
      background: ${BG_PAGE};
    }
    .kc-quick-chip {
      background: #fff;
      border: 1.5px solid #d4b896;
      color: ${CRIMSON};
      border-radius: 16px;
      padding: 4px 12px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .16s;
      white-space: nowrap;
    }
    .kc-quick-chip:hover {
      background: ${CRIMSON};
      color: #fff;
      border-color: ${CRIMSON};
    }

    /* Mobile — push above WhatsApp / phone FABs */
    @media (max-width: 600px) {
      #kc-chat-widget { bottom: 16px; right: 16px; }
      #kc-chat-panel  { width: calc(100vw - 32px); height: 70vh; }
    }
  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════
     BUILD DOM
  ══════════════════════════════════════════ */
  const widget = document.createElement('div');
  widget.id = 'kc-chat-widget';
  widget.innerHTML = `
    <div id="kc-chat-panel" class="hidden" role="dialog" aria-label="Kashmir Caterer's AI chat" aria-modal="false">

      <div id="kc-chat-header">
        <div id="kc-chat-avatar">🍽️</div>
        <div id="kc-chat-header-text">
          <div id="kc-chat-header-name">${BOT_NAME}</div>
          <div id="kc-chat-header-sub">${BOT_SUBTITLE}</div>
        </div>
        <button id="kc-chat-close" aria-label="Close chat">✕</button>
      </div>

      <div id="kc-chat-messages" aria-live="polite" aria-atomic="false"></div>

      <div id="kc-quick-replies"></div>

      <div id="kc-chat-input-row">
        <textarea id="kc-chat-input" rows="1"
          placeholder="Ask about menus, packages, booking…"
          aria-label="Type your message"
          maxlength="500"></textarea>
        <button id="kc-chat-send" aria-label="Send message" disabled>
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>

    </div>

    <button id="kc-chat-bubble" aria-label="Open AI chat assistant" aria-expanded="false">
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <span id="kc-chat-unread" aria-hidden="true">1</span>
    </button>
  `;
  document.body.appendChild(widget);

  /* ── DOM refs ── */
  const panel      = document.getElementById('kc-chat-panel');
  const bubble     = document.getElementById('kc-chat-bubble');
  const closeBtn   = document.getElementById('kc-chat-close');
  const messagesEl = document.getElementById('kc-chat-messages');
  const input      = document.getElementById('kc-chat-input');
  const sendBtn    = document.getElementById('kc-chat-send');
  const quickEl    = document.getElementById('kc-quick-replies');
  const unreadBadge= document.getElementById('kc-chat-unread');

  /* ══════════════════════════════════════════
     QUICK REPLY CHIPS
  ══════════════════════════════════════════ */
  const QUICK_REPLIES = [
    'What packages do you offer?',
    'Minimum guests for Mega Veg?',
    'Do you serve Wazwan?',
    'How do I book?',
    'High Tea options?',
  ];

  function renderQuickReplies() {
    if (history.length > 2) { quickEl.innerHTML = ''; return; }
    quickEl.innerHTML = QUICK_REPLIES.map(q =>
      `<button class="kc-quick-chip" data-q="${q}">${q}</button>`
    ).join('');
  }

  quickEl.addEventListener('click', e => {
    const chip = e.target.closest('.kc-quick-chip');
    if (chip) sendMessage(chip.dataset.q);
  });

  /* ══════════════════════════════════════════
     OPEN / CLOSE
  ══════════════════════════════════════════ */
  function openChat() {
    open = true;
    panel.classList.remove('hidden');
    bubble.setAttribute('aria-expanded', 'true');
    unreadBadge.style.display = 'none';
    if (history.length === 0) addBotMessage(WELCOME_MSG);
    renderQuickReplies();
    setTimeout(() => input.focus(), 120);
  }

  function closeChat() {
    open = false;
    panel.classList.add('hidden');
    bubble.setAttribute('aria-expanded', 'false');
  }

  bubble.addEventListener('click', () => open ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  /* Show unread badge after 3s on first load */
  setTimeout(() => {
    if (!open) unreadBadge.style.display = 'flex';
  }, 3000);

  /* ══════════════════════════════════════════
     MESSAGE RENDERING
  ══════════════════════════════════════════ */
  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function linkify(str) {
    // Make phone numbers and email clickable
    return str
      .replace(/\b(\d{10})\b/g, '<a href="tel:$1" style="color:inherit;text-decoration:underline">$1</a>')
      .replace(/([\w.-]+@[\w.-]+\.\w+)/g, '<a href="mailto:$1" style="color:inherit;text-decoration:underline">$1</a>');
  }

  function addMessage(role, text) {
    const isBot = role === 'bot';
    const div = document.createElement('div');
    div.className = `kc-msg ${isBot ? 'bot' : 'user'}`;
    div.innerHTML = `
      <div class="kc-msg-icon">${isBot ? '🍽️' : '👤'}</div>
      <div class="kc-bubble">${linkify(escapeHtml(text))}</div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function addBotMessage(text) {
    history.push({ role: 'assistant', content: text });
    addMessage('bot', text);
  }

  function addTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'kc-msg bot';
    div.id = 'kc-typing';
    div.innerHTML = `
      <div class="kc-msg-icon">🍽️</div>
      <div class="kc-bubble kc-typing-dots">
        <span></span><span></span><span></span>
      </div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('kc-typing');
    if (el) el.remove();
  }

  /* ══════════════════════════════════════════
     SEND MESSAGE
  ══════════════════════════════════════════ */
  async function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text || typing) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    history.push({ role: 'user', content: text });
    addMessage('user', text);
    quickEl.innerHTML = ''; // hide quick replies after first message

    typing = true;
    addTypingIndicator();

    try {
      const res = await fetch(API_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
      });

      removeTypingIndicator();

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        addBotMessage(err.error || 'Sorry, something went wrong. Please try again.');
        return;
      }

      const data = await res.json();
      addBotMessage(data.reply || 'No response received.');

    } catch (err) {
      removeTypingIndicator();
      addBotMessage('Unable to reach the assistant right now. Please WhatsApp us at 9419123005.');
    } finally {
      typing = false;
      sendBtn.disabled = input.value.trim().length === 0;
    }
  }

  /* ══════════════════════════════════════════
     INPUT HANDLING
  ══════════════════════════════════════════ */
  input.addEventListener('input', function () {
    // Auto-grow textarea
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
    sendBtn.disabled = this.value.trim().length === 0 || typing;
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', () => sendMessage());

})();
