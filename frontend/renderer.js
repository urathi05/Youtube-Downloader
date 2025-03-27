// renderer.js
const { ipcRenderer } = require('electron');


document.getElementById('submit').addEventListener('click', async () => {
    const urlInput = document.getElementById('url').value;
    const pathInput = document.getElementById('path').textContent.replace('Download Path: ', '');  // Get the path without the label
    const typeInput = document.getElementById('fileType').value;

    if (urlInput.trim() === '' || pathInput.trim() === '' || typeInput.trim() === '') {
        alert("Please fill in all fields!");
        return;
    }

    // Send a POST request to FastAPI
    const response = await fetch('http://127.0.0.1:8000/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput, path: pathInput, fileType: typeInput})  // Send the input as JSON
    });

    const data = await response.json();
    console.log("Message: " + data.message);
    document.getElementById('response').innerText = data.message;  // Display response in <p>
});

document.getElementById('choosePathButton').addEventListener('click', async () => {
    const selectedPath = await ipcRenderer.invoke('dialog:openDirectory');
    
    if (selectedPath) {
        document.getElementById('path').innerHTML = "Download Path: " + selectedPath; // Populate the path input with the selected folder
    }
});
