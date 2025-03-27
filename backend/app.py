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
        'format': 'best' if fileType in ['mp4', 'webm'] else 'bestaudio/best',
    }
    
    if fileType in ['mp3', 'aac', 'flac', 'm4a', 'opus', 'vorbis', 'wav']:
        opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': fileType,
            'preferredquality': '320',
        }]
    
    elif fileType in ['mp4', 'webm']:
        opts['postprocessors'] = [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': fileType,
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

