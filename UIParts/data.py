from sys import version_info
from platform import platform
from orjson import loads as loadjson

f = open("config.json", "r")
configObj = loadjson(f.read())

python_version = f"{version_info.major}.{version_info.minor}.{version_info.micro}"
storyscript_version = "0.1.0a"
storytypewriter_version = "0.1.0a"
os_version = platform()