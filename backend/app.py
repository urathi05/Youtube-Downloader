from fastapi import FastAPI
from pydantic import BaseModel
import yt_dlp

# Define a Pydantic model to validate the incoming data
class UrlInput(BaseModel):
    url: str  # Define the field to match the data sent from Electron
    path: str
    fileType: str

app = FastAPI()

# POST route to receive input from Electron frontend
@app.post("/download")
async def download(data: UrlInput):
    # Process the received data (in this case, just return it)
    url = data.url
    path = data.path
    fileType = data.fileType
    opts = {
        'outtmpl': path + "\\" + f'%(title)s.%(ext)s',
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]' if fileType == 'video' else 'bestaudio/best',
    }
    
    if fileType == 'audio':
        opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredquality': '320'
        }]
    
        
    download_video(url, opts)
    print(f"Downloading: {url} to {path} as {fileType}")
    return {"message": f"Downloading: {url} to {path} as {fileType}"}

def download_video(url, opts):
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])
        

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="debug")

