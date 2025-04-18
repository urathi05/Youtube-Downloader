// renderer.js
const { ipcRenderer } = require('electron');

console.log("Renderer process started");


document.getElementById('submit').addEventListener('click', async () => {
    const urlInput = document.getElementById('url').value;
    const pathInput = document.getElementById('choosePathButton').textContent.replace('Download Path: ', '');  // Get the path without the label
    const typeInput = document.getElementById('fileType').value;

    if (urlInput.trim() === '' || pathInput.trim() === '' || typeInput.trim() === '') {
        alert("Please fill in all fields!");
        return;
    }

    // Send a POST request to FastAPI
    const response = await fetch('http://127.0.0.1:7001/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput, path: pathInput, fileType: typeInput})  // Send the input as JSON
    });

    const data = await response.json();
    console.log("Message: " + data.message);
    //document.getElementById('response').innerText = data.message;  // Display response in <p>
});

const pathButton = document.getElementById('choosePathButton');

pathButton.addEventListener('click', async () => {
    pathButton.style.boxShadow = "none";

    const selectedPath = await ipcRenderer.invoke('dialog:openDirectory');
    
    if (selectedPath) {
        pathButton.innerHTML = selectedPath; // Populate the path input with the selected folder
    }

    setTimeout(() => {pathButton.style.boxShadow = "0px 0px 6px -2px rgba(0, 0, 0, 0.7)";}, 100); // Add shadow back after a short delay
});

const typeButton = document.getElementById('fileType');
typeButton.addEventListener('mousedown', () => {
    typeButton.style.boxShadow = "none";
    setTimeout(() => {typeButton.style.boxShadow = "none";}, 100); // Add shadow back after a short delay
});
typeButton.addEventListener('mouseup', () => {
    typeButton.style.boxShadow = "none";
    setTimeout(() => {typeButton.style.boxShadow = "0px 0px 6px -2px rgba(0, 0, 0, 0.7)";}, 100); // Add shadow back after a short delay
});

const closeButton = document.getElementById('close-btn');
closeButton.addEventListener('click', () => {
    console.log("Close button clicked");
    ipcRenderer.send('window:close');  // Close the window
});
