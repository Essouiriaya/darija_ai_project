// =====================
// TEXT TRANSLATION
// =====================
const translateBtn = document.getElementById("translateTextBtn");

translateBtn?.addEventListener("click", async () => {

    const text = document.getElementById("srcText").value;
    const targetLang = document.getElementById("tgtLang").value;
    const resultBox = document.getElementById("resultText");

    if (!text.trim()) {
        resultBox.innerHTML = "⚠️ Please enter text first";
        return;
    }

    resultBox.innerHTML = "⏳ Translating...";

    try {
        const response = await fetch("/api/translate-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                texte_source: text,
                langue_cible: targetLang
            })
        });

        const data = await response.json();

        resultBox.innerHTML = response.ok
            ? `<div>${data.output}</div>`
            : "❌ " + (data.error || "Error");

    } catch (error) {
        console.error(error);
        resultBox.innerHTML = "🚨 Server not responding";
    }
});


// =====================
// AUDIO UPLOAD
// =====================
const audioDrop = document.getElementById("audioDrop");
const audioInput = document.getElementById("audioInput");
const audioResult = document.getElementById("audioResult");

audioDrop?.addEventListener("click", () => audioInput.click());

audioInput?.addEventListener("change", () => {
    const file = audioInput.files[0];
    if (file) uploadAudio(file);
});

function uploadAudio(file) {

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("langue_cible", document.getElementById("tgtLang").value);

    audioResult.innerHTML = "⏳ Processing...";

    fetch("/api/translate-audio", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        audioResult.innerHTML = `
            <div class="glass p-3">
                <p><b>Extracted:</b> ${data.extracted_text}</p>
                <p><b>Translation:</b> ${data.translation}</p>
            </div>
        `;
    })
    .catch(err => {
        console.error(err);
        audioResult.innerHTML = "❌ Error occurred";
    });
}


// =====================
// IMAGE UPLOAD
// =====================
const imageInput = document.getElementById("imageInput");
const imageResult = document.getElementById("imageResult");

imageInput?.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) uploadImage(file);
});

function uploadImage(file) {

    const formData = new FormData();
    formData.append("image", file);
    formData.append("langue_cible", document.getElementById("tgtLang").value);

    imageResult.innerHTML = "⏳ Processing...";

    fetch("/api/translate-image", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        imageResult.innerHTML = `
            <div class="glass p-3">
                <p><b>Extracted:</b> ${data.extracted_text}</p>
                <p><b>Translation:</b> ${data.translation}</p>
            </div>
        `;
    })
    .catch(err => {
        console.error(err);
        imageResult.innerHTML = "❌ Error occurred";
    });
}


// =====================
// AUDIO RECORDING (MIC)
// =====================
let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startRec");
const stopBtn = document.getElementById("stopRec");

if (startBtn && stopBtn) {

startBtn.addEventListener("click", async () => {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunks, { type: "audio/webm" });
            audioChunks = [];
            uploadRecordedAudio(blob);
        };

        mediaRecorder.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;

        audioResult.innerHTML = "🎙️ Recording...";

    } catch (err) {
        console.error(err);
        audioResult.innerHTML = "❌ Microphone blocked";
    }
});

stopBtn.addEventListener("click", () => {

    if (!mediaRecorder) return;

    mediaRecorder.stop();

    startBtn.disabled = false;
    stopBtn.disabled = true;

    audioResult.innerHTML = "⏳ Processing...";
});

}

function uploadRecordedAudio(blob) {

    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("langue_cible", document.getElementById("tgtLang").value);

    fetch("/api/translate-audio", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        audioResult.innerHTML = `
            <div class="glass p-3">
                <p><b>Extracted:</b> ${data.extracted_text}</p>
                <p><b>Translation:</b> ${data.translation}</p>
            </div>
        `;
    })
    .catch(err => {
        console.error(err);
        audioResult.innerHTML = "❌ Error processing audio";
    });
}