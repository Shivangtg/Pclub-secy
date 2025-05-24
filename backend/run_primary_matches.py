import os
import subprocess

teams = [d for d in os.listdir("repos") if os.path.isdir(os.path.join("repos", d))]
os.makedirs("match_logs/Match1", exist_ok=True)  # Make sure the log folder exists

for team in teams:
    log_file = f"match_logs/Match1/{team}_vs_bot1.log"
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
