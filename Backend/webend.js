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

// Tampilkan popup chat
document.getElementById("chatBtn").addEventListener("click", function() {
    const popup = document.getElementById("chatPopup");
    popup.style.display = (popup.style.display === "none") ? "block" : "none";
});

// Kirim pesan ke backend
document.getElementById("sendBtn").addEventListener("click", function() {
    const prompt = document.getElementById("chatInput").value;
    if (prompt.trim() === "") return;

    fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(res => res.json())
    .then(data => {
        const resDiv = document.getElementById("chatResponse");
        resDiv.innerHTML += `<div><b>Anda:</b> ${prompt}</div>`;
        resDiv.innerHTML += `<div><b>DentAI:</b> ${data.response}</div>`;
        resDiv.scrollTop = resDiv.scrollHeight;
        document.getElementById("chatInput").value = "";
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    });
});
