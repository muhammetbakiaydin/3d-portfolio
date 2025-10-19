// Comment Board JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  console.log('Comment board script loaded');

  // Elements
  const commentButton = document.getElementById('commentButton');
  const commentBoard = document.getElementById('commentBoard');
  const commentBoardOverlay = document.getElementById('commentBoardOverlay');
  const closeCommentBoard = document.getElementById('closeCommentBoard');
  const commentForm = document.getElementById('commentForm');
  const commentsList = document.getElementById('commentsList');
  const avatarButton = document.getElementById('avatarButton');
  const avatarDropdown = document.getElementById('avatarDropdown');
  const authorInput = document.getElementById('authorInput');
  const messageInput = document.getElementById('messageInput');
  const charCount = document.getElementById('charCount');

  console.log('Comment button element:', commentButton);

  if (!commentButton) {
    console.error('Comment button not found!');
    return;
  }

  let selectedAvatar = '👨‍💻';
  let isOpen = false;

  // Initialize - ensure board is closed on load
  function initializeBoard() {
    if (commentBoard) {
      commentBoard.style.display = 'none';
    }
    if (commentBoardOverlay) {
      commentBoardOverlay.style.display = 'none';
    }
    if (commentButton) {
      commentButton.textContent = '💬';
      commentButton.classList.remove('active');
    }
    console.log('Board initialized as closed');
  }

  // Call initialization
  initializeBoard();

  // Load comments from localStorage
  function loadComments() {
    const stored = localStorage.getItem('brainstorming-comments');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        return data.comments || [];
      } catch (e) {
        return getDefaultComments();
      }
    }
    return getDefaultComments();
  }

  // Get default comments
  function getDefaultComments() {
    return [
      {
        id: '1',
        author: 'Daniel',
        message: 'Welcome to the Brain Storming board! Share your thoughts here.',
        timestamp: new Date('2025-10-17T10:00:00').toISOString(),
        avatar: '👨‍💻'
      },
      {
        id: '2',
        author: 'Sarah',
        message: 'Amazing 3D grid animations! Love the scroll effects.',
        timestamp: new Date('2025-10-17T11:30:00').toISOString(),
        avatar: '🎨'
      }
    ];
  }

  // Save comments to localStorage
  function saveComments(comments) {
    localStorage.setItem('brainstorming-comments', JSON.stringify({ comments }));
  }

  // Format timestamp
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  // Render comments
  function renderComments() {
    const comments = loadComments();
    
    if (comments.length === 0) {
      commentsList.innerHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: rgba(255, 255, 255, 0.5); text-align: center; padding: 40px 20px;">
          <span style="font-size: 48px; opacity: 0.6;">💭</span>
          <p style="margin: 0; font-size: 14px;">Henüz yorum yok. İlk yorumu siz yapın!</p>
        </div>
      `;
      return;
    }

    commentsList.innerHTML = comments.map(comment => `
      <div class="comment-item">
        <div class="comment-item__avatar">${comment.avatar}</div>
        <div class="comment-item__content">
          <div class="comment-item__header">
            <span class="comment-item__author">${escapeHtml(comment.author)}</span>
            <span class="comment-item__time">${formatDate(comment.timestamp)}</span>
          </div>
          <p class="comment-item__message">${escapeHtml(comment.message)}</p>
        </div>
      </div>
    `).join('');

    // Scroll to bottom
    setTimeout(() => {
      commentsList.scrollTop = commentsList.scrollHeight;
    }, 100);
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Toggle comment board
  function toggleCommentBoard() {
    console.log('Toggle called, current isOpen:', isOpen);
    isOpen = !isOpen;
    console.log('New isOpen:', isOpen);
    
    if (isOpen) {
      if (commentBoard) {
        commentBoard.style.display = 'flex';
      }
      if (commentBoardOverlay) {
        commentBoardOverlay.style.display = 'block';
      }
      if (commentButton) {
        commentButton.textContent = '✕';
        commentButton.classList.add('active');
      }
      renderComments();
      console.log('Board opened');
    } else {
      if (commentBoard) {
        commentBoard.style.display = 'none';
      }
      if (commentBoardOverlay) {
        commentBoardOverlay.style.display = 'none';
      }
      if (commentButton) {
        commentButton.textContent = '💬';
        commentButton.classList.remove('active');
      }
      console.log('Board closed');
    }
  }

  // Toggle avatar dropdown
  function toggleAvatarDropdown(e) {
    e.stopPropagation();
    const isVisible = avatarDropdown.style.display === 'grid';
    avatarDropdown.style.display = isVisible ? 'none' : 'grid';
  }

  // Select avatar
  function selectAvatar(emoji) {
    selectedAvatar = emoji;
    avatarButton.textContent = emoji;
    avatarDropdown.style.display = 'none';
  }

  // Submit comment
  function handleSubmit(e) {
    e.preventDefault();
    
    const author = authorInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!author || !message) {
      alert('Lütfen isim ve mesaj alanlarını doldurun!');
      return;
    }

    const comment = {
      id: Date.now().toString(),
      author: author.substring(0, 30),
      message: message.substring(0, 500),
      timestamp: new Date().toISOString(),
      avatar: selectedAvatar
    };

    const comments = loadComments();
    comments.push(comment);
    saveComments(comments);
    renderComments();

    // Clear form
    authorInput.value = '';
    messageInput.value = '';
    charCount.textContent = '0';
    selectedAvatar = '👨‍💻';
    avatarButton.textContent = selectedAvatar;
  }

  // Update character count
  function updateCharCount() {
    charCount.textContent = messageInput.value.length;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(e) {
    if (!avatarButton.contains(e.target) && !avatarDropdown.contains(e.target)) {
      avatarDropdown.style.display = 'none';
    }
  }

  // Event Listeners
  if (commentButton) {
    commentButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCommentBoard();
    });
  }
  
  if (closeCommentBoard) {
    closeCommentBoard.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCommentBoard();
    });
  }
  
  if (commentBoardOverlay) {
    commentBoardOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleCommentBoard();
    });
  }
  
  if (avatarButton) {
    avatarButton.addEventListener('click', toggleAvatarDropdown);
  }
  
  if (commentForm) {
    commentForm.addEventListener('submit', handleSubmit);
  }
  
  if (messageInput) {
    messageInput.addEventListener('input', updateCharCount);
  }
  
  document.addEventListener('click', handleClickOutside);

  // Avatar picker options
  const avatarOptions = avatarDropdown.querySelectorAll('.avatar-picker__option');
  avatarOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      selectAvatar(option.dataset.avatar);
    });
  });

  // Initialize
  console.log('Comment board initialized successfully');
});
