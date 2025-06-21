// DOM Elements
const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const addProductForm = document.getElementById('addProductForm');
const cancelAddProduct = document.getElementById('cancelAddProduct');
const productsGrid = document.getElementById('productsGrid');

// Check if user is logged in and show/hide add product button
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        addProductBtn.style.display = 'flex';
    } else {
        addProductBtn.style.display = 'none';
    }
}

// Show add product modal
addProductBtn.addEventListener('click', () => {
    addProductModal.style.display = 'block';
});

// Hide add product modal
cancelAddProduct.addEventListener('click', () => {
    addProductModal.style.display = 'none';
    addProductForm.reset();
});

// Handle form submission
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('condition', document.getElementById('condition').value);
    
    const imageFiles = document.getElementById('images').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }

    try {
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            const product = await response.json();
            addProductModal.style.display = 'none';
            addProductForm.reset();
            loadProducts(); // Reload products
        } else {
            const error = await response.json();
            alert(error.message || 'Error adding product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product');
    }
});

// Load products
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Get the first image URL, or use a placeholder if no images
    const imageUrl = product.images && product.images.length > 0 
        ? `http://localhost:5000/${product.images[0]}` 
        : 'placeholder.jpg';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.title}" class="product-image" onerror="this.src='placeholder.jpg'">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
                <span class="product-status ${product.status}">${product.status}</span>
                <button class="chat-button" onclick="startChat('${product._id}')">
                    <i class="fas fa-comments"></i> Chat
                </button>
            </div>
        </div>
    `;
    return card;
}

// Start chat with seller
async function startChat(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}/chat/start`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const chat = await response.json();
            openChat(chat);
        } else {
            const error = await response.json();
            alert(error.message || 'Error starting chat');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error starting chat');
    }
}

// Open chat modal
function openChat(chat) {
    const chatModal = document.getElementById('chatModal');
    const chatContainer = chatModal.querySelector('.chat-container');
    chatContainer.dataset.chatId = chat._id;
    
    // Load chat messages
    loadChatMessages(chat._id);
    
    chatModal.style.display = 'block';
}

// Load chat messages
async function loadChatMessages(chatId) {
    try {
        const response = await fetch(`http://localhost:5000/api/products/chat/${chatId}/messages`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const messages = await response.json();
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.innerHTML = '';
            
            messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.className = `message ${message.sender === currentUserId ? 'sent' : 'received'}`;
                messageElement.textContent = message.content;
                messagesContainer.appendChild(messageElement);
            });
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Send message
document.getElementById('sendMessage').addEventListener('click', async () => {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();
    const chatContainer = document.querySelector('.chat-container');
    const chatId = chatContainer.dataset.chatId;

    if (content && chatId) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/chat/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                messageInput.value = '';
            } else {
                const error = await response.json();
                alert(error.message || 'Error sending message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message');
        }
    }
});

// Close chat
document.getElementById('closeChat').addEventListener('click', () => {
    document.getElementById('chatModal').style.display = 'none';
});

// Initialize
checkAuth();
loadProducts(); 