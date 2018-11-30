
import asyncio
import datetime
import random
import websockets
import json
import shutil

async def servefile(websocket, path):
    f = open("noten.myjson","r")
    await websocket.send(f.read())
    async for message in websocket:
        if message:    
            f = open("noten.myjson","w")
            f.write(message)


now = datetime.datetime.utcnow().isoformat() + 'Z'
path="backup/noten"+now+".myjson"
shutil.copy("noten.myjson",path)
print("Backup done!")

start_server = websockets.serve(servefile, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
