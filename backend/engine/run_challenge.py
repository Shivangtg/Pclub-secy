import sys
import subprocess
# print("donkey nikla mai",sys.argv)
if len(sys.argv) != 3:
    print("Usage: python run_match.py /bot1/main.py /bot2/main.py")
    sys.exit(1)

challenger_bot = sys.argv[1]
bot_to_be_challenged = sys.argv[2]

# Execute engine with given bots
subprocess.run(["python", "engine3.py", "--p1", challenger_bot , "--p2", bot_to_be_challenged ])

