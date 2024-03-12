
import asyncio
import datetime
import websockets
import json
import shutil

TOKEN = "secrettoken"

async def servefile(websocket):
    auth=False
    async for message in websocket:
        if message == TOKEN:
            print("token recieved")
            auth=True
        elif message == "load" and auth:
            f = open("noten.myjson","r")
            await websocket.send(f.read())
            f.close()
        elif message[0] == "{" and auth:
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
            f.close()
        else:
            if(auth):
                print("auth  " + message)
            else:
                print("not auth " + message)

def backup():
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    path="backup/noten"+now+".myjson"
    shutil.copy("noten.myjson",path)
    print("Backup done!")


async def main():
  async with websockets.serve(servefile, '127.0.0.1', 5678):
    await asyncio.Future()

asyncio.run(main())
