import os
import subprocess
import sys
import json


teams_in_finals=4

# Read from stdin
data = sys.stdin.read()
try:
    js_object = json.loads(data)
    print(f"Successfully received object: {js_object}" , js_object[2])
    for team in combination:
        log_file = f"match_logs/{team}_vs_bot1.log"
        print(f"Running match: {team} vs bot1")
        
        with open(log_file, "w") as outfile:
            subprocess.run([
                "docker", "run", "--rm",
                "--cpus=0.5", "--memory=256m",
                "--network", "none",

                # Read-only mounts
                "-v", f"{os.getcwd()}/engine:/app:ro",
                "-v", f"{os.getcwd()}/repos/{team}:/bot1:ro",
                "-v", f"{os.getcwd()}/engine:/systemBot:ro",

                # Writable mount moved outside /app
                "-v", f"{os.getcwd()}/match_logs:/logs",

                "bot-runner",

                # Provide logs directory as env var or argument
                "python", "/app/run_match.py", "/bot1/main.py", "/systemBot/bot1.py", f"{team}"
            ], stdout=outfile, stderr=subprocess.STDOUT)


        print(f"Match finished: logs saved to {log_file}")

except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")





