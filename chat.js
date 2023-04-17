window.addEventListener('DOMContentLoaded', async (e) => {
    const token = document.getElementById("token")
    const savedToken = (await chrome.storage.local.get(["token"])).token;

    token.value = savedToken;

    const loader = document.getElementById("loader");
    loader.style.display = 'none';
})

const form = document.getElementById("form");
let done = true;
form.addEventListener('submit', (e) => {
    e.preventDefault()

    if(!done) {
        console.log('Not finished with previous request.')
        return;
    }
    done = false;
    const loader = document.getElementById("loader");
    loader.style.display = 'block';


    const input = document.getElementById("input");

    const output = document.getElementById("output");
    output.textContent = "Indlæser...";

    const params = {
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    }

    console.log(params, input.value)

    chrome.runtime.sendMessage({ data: input.value, params: params }, (res) => {
        let response;
        try {
            response = res.choices[0].message.content;
        } catch(e) {
            response = res.error.message;
            console.log('An error occured: ' + res.error.code);
        }

        const output = document.getElementById("output");
        output.textContent = response;

        loader.style.display = 'none';
        done = true;
    })
})

const copy = document.getElementById("copy");
copy.addEventListener('click', (e) => {
    const output = document.getElementById("output").textContent;
    if(output != "Output vil vises her." && output != "Indlæser...") {
        navigator.clipboard.writeText(output)
    }
})

const token = document.getElementById("token")
token.addEventListener('focusout', (e) => {
    chrome.storage.local.set({ "token": e.target.value })
})