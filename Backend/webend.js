// Pilih semua tautan navigasi
const navLinks = document.querySelectorAll("nav a");

// Tambahkan event listener ke setiap tautan navigasi
navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        // Scroll ke bagian target dengan halus
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// Tampilkan atau sembunyikan popup chat
document.getElementById("chatBtn").addEventListener("click", function() {
    const popup = document.getElementById("chatPopup");
    const isHidden = window.getComputedStyle(popup).display === "none";
    popup.style.display = isHidden ? "block" : "none";
});

// Kirim pesan ke backend
document.getElementById("sendBtn").addEventListener("click", function() {
    const prompt = document.getElementById("chatInput").value;
    if (prompt.trim() === "") {
        alert("Pesan tidak boleh kosong!");
        return;
    }

    fetch("https://dent-ai-backend.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(res => res.json())
    .then(data => {
        const resDiv = document.getElementById("chatResponse");
        resDiv.innerHTML += `<div><b>Anda:</b> ${prompt}</div>`;
        
        if (data.response) {
            resDiv.innerHTML += `<div><b>DentAI:</b> ${data.response}</div>`;
        } else {
            resDiv.innerHTML += `<div><b>DentAI:</b> Error: Respons tidak valid.</div>`;
        }
        
        resDiv.scrollTop = resDiv.scrollHeight;
        document.getElementById("chatInput").value = "";
    })
    .catch(err => {
        console.error("Error:", err);
        const resDiv = document.getElementById("chatResponse");
        resDiv.innerHTML += `<div><b>Error:</b> Tidak dapat mengirim pesan. Silakan coba lagi.</div>`;
    });
});
