const audioDrop = document.getElementById("audioDrop");
const audioInput = document.getElementById("audioInput");
const audioResult = document.getElementById("audioResult");

audioDrop.addEventListener("click", () => audioInput.click());

audioInput.addEventListener("change", () => {
    const file = audioInput.files[0];
    if (!file) return;

    uploadAudio(file);
});

function uploadAudio(file) {

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("Login first");
        return;
    }

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("user_id", user_id);
    formData.append("langue_cible", document.getElementById("tgtLang").value);

    audioResult.innerHTML = "⏳ Processing...";

    fetch("/translate-audio", {
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

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    uploadImage(file);
});

function uploadImage(file) {

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("Login first");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", user_id);
    formData.append("langue_cible", document.getElementById("tgtLang").value);

    imageResult.innerHTML = "⏳ Processing...";

    fetch("/translate-image", {
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