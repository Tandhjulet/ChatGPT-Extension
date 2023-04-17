chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const q = message.data;
    const params = message.params;
    const url = "https://api.openai.com/v1/chat/completions";

    console.log(q, params)

    const data = {
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", content: q}],
        temperature: 0.7,
        ...params,
    }

    console.log(data);

    chrome.storage.local.get(["token"]).then((OPENAI_KEY) => {

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_KEY.token,
            },
            body: JSON.stringify(data),
    
        }).then(async (res) => {
            const jsonifiedResponse = await res.json();
            sendResponse(jsonifiedResponse)
        })
    })

    return true;
});