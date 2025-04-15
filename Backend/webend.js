// Pilih semua tautan navigasi
const navLinks = document.querySelectorAll("nav a");

// Tambahkan event listener ke setiap tautan navigasi
navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault(); // Mencegah perilaku default tautan
        const targetId = this.getAttribute("href").substring(1); // Ambil ID target dari atribut href
        const targetSection = document.getElementById(targetId); // Temukan elemen dengan ID target

        // Scroll ke bagian target dengan halus
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const chatContent = document.getElementById('chat-content');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const userMessage = userInput.value.trim();
            if (userMessage) {
                // Tampilkan pesan pengguna
                const userMessageElement = document.createElement('p');
                userMessageElement.textContent = `Anda: ${userMessage}`;
                chatContent.appendChild(userMessageElement);

                // Respons chatbot sederhana
                const botMessageElement = document.createElement('p');
                botMessageElement.textContent = `DentAI: Terima kasih atas pesan Anda. Kami akan segera membantu Anda.`;
                chatContent.appendChild(botMessageElement);

                // Bersihkan input
                userInput.value = '';
                chatContent.scrollTop = chatContent.scrollHeight; // Scroll ke bawah
            }
        });
    }
});