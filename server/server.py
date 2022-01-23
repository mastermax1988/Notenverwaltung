
import asyncio
import datetime
import websockets
import json
import shutil

async def servefile(websocket, path):
    async for message in websocket:
        if message == "load":
            f = open("noten.myjson","r")
            await websocket.send(f.read())
            f.close()
        elif message[0] == "{":
            f = open("noten.myjson","r");
            if message != f.read():
                f.close()
                backup()
                f = open("noten.myjson","w")
                f.write(message)
                f.close()
                print("new data saved");
            else:
                print("data unchanged, not saving");
            f.close();

def backup():
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    path="backup/noten"+now+".myjson"
    shutil.copy("noten.myjson",path)
    print("Backup done!")


async def main():
  async with websockets.serve(servefile, '127.0.0.1', 5678):
    await asyncio.Future()

asyncio.run(main())
