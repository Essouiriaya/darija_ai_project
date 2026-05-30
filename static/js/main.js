// =====================
// TEXT TRANSLATION - FIXED ENDPOINT
// =====================
const translateBtn = document.getElementById("translateTextBtn");

translateBtn?.addEventListener("click", async () => {
    const text = document.getElementById("srcText").value;
    const resultBox = document.getElementById("resultText");

    if (!text.trim()) {
        resultBox.innerHTML = "⚠️ Please enter text first";
        return;
    }

    resultBox.innerHTML = '<div class="text-center"><i class="fa-solid fa-spinner fa-spin"></i> Translating...</div>';

    try {
        const response = await fetch("/api/translate-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                texte_source: text,
                langue_cible: "en"
            })
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
            // FIXED: Just the plain translation text
            resultBox.innerHTML = escapeHtml(data.output);
        } else {
            resultBox.innerHTML = `<div class="alert alert-danger">❌ ${data.error || "Translation failed"}</div>`;
        }

    } catch (error) {
        console.error("Text translation error:", error);
        resultBox.innerHTML = '<div class="alert alert-danger">🚨 Server not responding. Please try again.</div>';
    }
});

// =====================
// AUDIO FILE UPLOAD - FIXED ENDPOINT
// =====================
const uploadBtn = document.getElementById("uploadBtn");
const audioInput = document.getElementById("audioInput");
const audioResult = document.getElementById("audioResult");
const audioStatus = document.getElementById("audioStatus");

uploadBtn?.addEventListener("click", () => {
    audioInput.click();
});

audioInput?.addEventListener("change", () => {
    const file = audioInput.files[0];
    if (file) uploadAudio(file);
});

function uploadAudio(file) {
    console.log("Uploading audio file:", file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("langue_cible", "en");

    if (audioStatus) {
        audioStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing audio...';
        audioStatus.style.color = "#ffc375";
    }
    
    audioResult.innerHTML = '<div class="text-center"><i class="fa-solid fa-spinner fa-spin"></i> Processing...</div>';

    fetch("/api/translate-audio", {
        method: "POST",
        body: formData
    })
    .then(async res => {
        const text = await res.text();

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Server returned:", text);
            throw new Error("Server returned HTML instead of JSON (check Flask error)");
        }
    })
    .then(data => {
        console.log("Audio response:", data);
        
        const translation = data.translation || "";
        
        // FIXED: Just the plain translation text
        audioResult.innerHTML = escapeHtml(translation);
        
        if (audioStatus) {
            audioStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i> Translation completed!';
            audioStatus.style.color = "#198754";
            setTimeout(() => {
                audioStatus.innerHTML = '';
            }, 3000);
        }
    })
    .catch(err => {
        console.error("Upload error:", err);
        audioResult.innerHTML = `<div class="alert alert-danger">❌ Error: ${err.message}</div>`;
        if (audioStatus) {
            audioStatus.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Translation failed';
            audioStatus.style.color = "#dc3545";
        }
    });
}

// =====================
// AUDIO RECORDING (MICROPHONE FIXED)
// =====================
let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");

recordBtn?.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
            ? 'audio/webm' 
            : 'audio/mp4';
        
        mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            if (audioChunks.length === 0) {
                console.error("No audio recorded");
                if (audioStatus) {
                    audioStatus.innerHTML = "No audio recorded. Please try again.";
                    audioStatus.style.color = "#dc3545";
                }
                return;
            }
            
            const blob = new Blob(audioChunks, { type: mimeType });
            audioChunks = [];
            uploadRecordedAudio(blob);
            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start(1000);

        recordBtn.disabled = true;
        stopBtn.disabled = false;

        if (audioStatus) {
            audioStatus.innerHTML = '<i class="fa-solid fa-microphone"></i> Recording... Speak clearly';
            audioStatus.style.color = "#dc3545";
        }
        
        audioResult.innerHTML = '<div class="text-center text-muted"><i class="fa-solid fa-microphone"></i> Recording in progress...</div>';

    } catch (err) {
        console.error("Microphone error:", err);
        audioResult.innerHTML = '<div class="alert alert-danger">❌ Cannot access microphone. Please check permissions.</div>';
        if (audioStatus) {
            audioStatus.innerHTML = "Microphone access denied";
            audioStatus.style.color = "#dc3545";
        }
    }
});

stopBtn?.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        
        if (audioStatus) {
            audioStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing recording...';
            audioStatus.style.color = "#ffc375";
        }
    }
});

function uploadRecordedAudio(blob) {
    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");
    formData.append("langue_cible", "en");

    fetch("/api/translate-audio", {
        method: "POST",
        body: formData
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Processing failed");
        return data;
    })
    .then(data => {
        console.log("Recording response:", data);

        const translation = data.translation || "";

        // FIXED: Just the plain translation text
        audioResult.innerHTML = escapeHtml(translation);
        
        if (audioStatus) {
            audioStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i> Translation completed!';
            audioStatus.style.color = "#198754";
            setTimeout(() => {
                audioStatus.innerHTML = '';
            }, 3000);
        }
    })
    .catch(err => {
        console.error("Recording upload error:", err);
        audioResult.innerHTML = `<div class="alert alert-danger">❌ Error: ${err.message}</div>`;
        if (audioStatus) {
            audioStatus.innerHTML = "Processing failed";
            audioStatus.style.color = "#dc3545";
        }
    });
}

// =====================
// IMAGE UPLOAD - FIXED ENDPOINT
// =====================
const imageDrop = document.getElementById("imageDrop");
const imageInput = document.getElementById("imageInput");
const imageResult = document.getElementById("imageResult");

imageDrop.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) uploadImage(file);
});

imageDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageDrop.classList.add("dragging");
});

imageDrop.addEventListener("dragleave", () => {
    imageDrop.classList.remove("dragging");
});

imageDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    imageDrop.classList.remove("dragging");
    const file = e.dataTransfer.files[0];
    if (file) uploadImage(file);
});

function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("langue_cible", "en");

    imageResult.innerHTML = '<div class="text-center"><i class="fa-solid fa-spinner fa-spin"></i> Processing image...</div>';

    fetch("/api/translate-image", {
        method: "POST",
        body: formData
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image processing failed");
        return data;
    })
    .then(data => {
        console.log("Image response:", data);
        
        // FIXED: Just the plain translation text
        imageResult.innerHTML = escapeHtml(data.translation || "No translation");
    })
    .catch(err => {
        console.error("Image upload error:", err);
        imageResult.innerHTML = `<div class="alert alert-danger">❌ Error: ${err.message}</div>`;
    });
}

// =====================
// HELPER FUNCTIONS
// =====================
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    .dragging {
        border: 2px dashed #0d6efd !important;
        background-color: rgba(13, 110, 253, 0.1) !important;
        transform: scale(1.02);
        transition: all 0.2s ease;
    }
    
    .card {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log("✅ Translation interface ready!");