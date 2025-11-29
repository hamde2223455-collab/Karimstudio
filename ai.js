const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let waitingForInfo = false;
let currentService = "";

const services = [
    { name: "تصميم شعار", price: 499, offer: 399 },
    { name: "تصميم بوستر", price: 299, offer: 199 },
    { name: "تصميم سوشيال", price: 199, offer: 149 },
    { name: "هوية بصرية", price: 1999, offer: 1490 },
];

function addMessage(text, sender="bot") {
    const msg = document.createElement("div");
    msg.className = "msg " + sender;
    msg.innerHTML = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botReply(text) {
    addMessage(text, "bot");
}

async function generateImage(prompt) {
    botReply("⏳ جاري إنشاء تصميم مبدئي…");

    const res = await fetch("/generate-image", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.error) {
        botReply("❌ حصل خطأ أثناء إنشاء التصميم.");
        return;
    }

    botReply(`
        <b>📸 تصميم مبدئي بناءً على طلبك:</b> <br><br>
        <img src="${data.url}" style="width:100%;border-radius:10px;">
    `);
}

function analyzeRequest(text) {
    text = text.toLowerCase();

    for (let s of services) {
        if (text.includes("لوجو") || text.includes("شعار")) return services[0];
        if (text.includes(s.name)) return s;
    }

    return services[0]; // fallback → يعرف إنه تصميم
}

function sendMsg() {
    let text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    if (waitingForInfo) {
        botReply("تمام… جاري إرسال بياناتك على الواتساب 📩");

        const msg = `اسم العميل: ${text}\nالخدمة: ${currentService}`;
        window.open(`https://wa.me/201033297509?text=${encodeURIComponent(msg)}`);

        waitingForInfo = false;
        return;
    }

    // 🔍 لو المستخدم طلب تصميم
    const service = analyzeRequest(text);
    currentService = service.name;

    // توليد الصورة المبدئية
    generateImage(text);

    botReply(`
        ✔ فهمت إنك محتاج: <b>${service.name}</b><br>
        السعر: ${service.price} جنيه<br>
        العرض: <b>${service.offer} جنيه</b> 🎉<br><br>
        📄 من فضلك اكتب اسمك لإتمام الطلب.
    `);

    waitingForInfo = true;
}

sendBtn.onclick = sendMsg;
input.addEventListener("keypress", e => e.key === "Enter" && sendMsg());