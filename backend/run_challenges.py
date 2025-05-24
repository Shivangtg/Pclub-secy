import os
import subprocess
import sys
import json


data = sys.stdin.read()
js_object = json.loads(data)


match=subprocess.run([
    "docker", "run", "--rm",
    "--cpus=0.5", "--memory=256m",
    "--network", "none",
    # Read-only mounts
    "-v", f"{os.getcwd()}/engine:/app:ro",
    "-v", f"{os.getcwd()}/repos/{js_object["challengerBot"]}:/challengerBot:ro",
    "-v", f"{os.getcwd()}/repos/{js_object["botToChallenge"]}:/botToChallenge:ro",
    # Mount logs directory
    "-v", f"{os.getcwd()}/match_logs:/logs",



    "bot-runner",

    # Provide logs directory as env var or argument
    "python", "/app/run_challenge.py", "/challengerBot/main.py", "/botToChallenge/main.py"
], capture_output=True,text=True)

try:
    print(match.stdout)
except json.JSONDecodeError:
    print("Error parsing output:", match.stderr)

