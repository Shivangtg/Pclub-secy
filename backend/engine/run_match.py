import sys
import subprocess
print("donkey nikla mai",sys.argv)
if len(sys.argv) != 4:
    print("Usage: python run_match.py /bot1/main.py /bot2/main.py")
    sys.exit(1)

player_bot_1 = sys.argv[1]
player_bot_2 = sys.argv[2]
team = sys.argv[3]

# Execute engine with given bots
subprocess.run(["python", "engine1.py", "--p1", player_bot_1 , "--p2", player_bot_2 , "--team" ,team])

