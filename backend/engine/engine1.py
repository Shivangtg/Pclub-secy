import argparse
import importlib.util
import time
import csv
import random
import os
import json
from datetime import datetime
import sys



# Constants
GRID_SIZE = 30
PADDLE_WIDTH = 2
MAX_SCORE = 10
LOG_DIR = "/logs/game_logs/"  # Docker bind mount target

# Create log directory
os.makedirs(LOG_DIR, exist_ok=True)



class Paddle:
    def __init__(self, y):
        self.y = y
        self.x = GRID_SIZE // 2 - 1

    def move(self, direction):
        if direction == "left" and self.x > 0:
            self.x -= 1
        elif direction == "right" and self.x + PADDLE_WIDTH < GRID_SIZE:
            self.x += 1

    def in_range(self, ball_x):
        return self.x <= ball_x < self.x + PADDLE_WIDTH

class Ball:
    def __init__(self):
        self.x = random.randint(0, GRID_SIZE - 1)
        self.y = GRID_SIZE // 2
        self.dx = random.choice([-1, 1])
        self.dy = random.choice([-1, 1])

    def move(self):
        self.x += self.dx
        self.y += self.dy
        if self.x <= 0 or self.x >= GRID_SIZE - 1:
            self.dx *= -1  # Bounce off side walls

class PlayerWrapper:
    def __init__(self, path):
        self.path = path
        spec = importlib.util.spec_from_file_location("bot", path)
        self.bot = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.bot)

    def get_move(self, game_state):
        return self.bot.next_move(game_state)

def get_game_state(ball, paddle1, paddle2, player):
    return {
        "ball": {"x": ball.x, "y": ball.y, "dx": ball.dx, "dy": ball.dy},
        "you": {"x": paddle1.x, "y": paddle1.y},
        "opponent": {"x": paddle2.x, "y": paddle2.y},
        "player": player
    }

def play_primary_game(bot1_path, bot2_path, team):

    print(bot1_path)
    print(bot2_path)

    bot1 = PlayerWrapper(bot1_path)
    bot2 = PlayerWrapper(bot2_path)

    total_wins=0
    for i in range(5):
        print(f"Round {i+1} started")
        scores = {"bot1": 0, "bot2": 0}
        round_num = 0
        step = 0
        os.makedirs(LOG_DIR+f"{team}/Match1/Round{i+1}", exist_ok=True)
        csv_file_path = os.path.join(LOG_DIR, f"{team}/Match1/Round{i+1}/game_log.csv")
        json_file_path = os.path.join(LOG_DIR, f"{team}/Match1/Round{i+1}/summary.json")
        txt_file_path = os.path.join(LOG_DIR, f"{team}/Match1/Round{i+1}/summary.txt")

        with open(csv_file_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow([
                "step", "ball_x", "ball_y",
                "paddle1_x", "paddle2_x",
                "bot1_action", "bot2_action",
                "score_bot1", "score_bot2"
            ])

            while scores["bot1"] < MAX_SCORE and scores["bot2"] < MAX_SCORE:
                round_num += 1
                ball = Ball()
                paddle1 = Paddle(GRID_SIZE - 1)
                paddle2 = Paddle(0)

                while True:
                    state1 = get_game_state(ball, paddle1, paddle2, "bot1")
                    move1 = bot1.get_move(state1)
                    paddle1.move(move1)

                    state2 = get_game_state(ball, paddle2, paddle1, "bot2")
                    move2 = bot2.get_move(state2)
                    paddle2.move(move2)

                    ball.move()

                    step += 1
                    writer.writerow([
                        step, ball.x, ball.y,
                        paddle1.x, paddle2.x,
                        move1, move2,
                        scores["bot1"], scores["bot2"]
                    ])

                    if ball.y <= 0:
                        if not paddle2.in_range(ball.x):
                            scores["bot1"] += 1
                            break
                        else:
                            ball.dy *= -1
                    elif ball.y >= GRID_SIZE - 1:
                        if not paddle1.in_range(ball.x):
                            scores["bot2"] += 1
                            break
                        else:
                            ball.dy *= -1

        # Save summary as JSON
        summary = {
            "bot1": os.path.basename(bot1_path),
            "bot2": os.path.basename(bot2_path),
            "score": scores,
            "winner": "bot1" if scores["bot1"] > scores["bot2"] else "bot2"
        }

        with open(json_file_path, "w") as jf:
            json.dump(summary, jf, indent=2)

        # Save summary as plain text
        with open(txt_file_path, "w") as tf:
            tf.write(f"Bot 1: {os.path.basename(bot1_path)}\n")
            tf.write(f"Bot 2: {os.path.basename(bot2_path)}\n")
            tf.write(f"Final Score: {scores}\n")
            tf.write(f"Winner: {summary['winner']}\n")
        if (summary['winner']=="bot1"):
            total_wins=total_wins+1
        
        print("✔ Match complete!")
        print(f"📄 Logs saved to:\n  - {csv_file_path}\n  - {json_file_path}\n  - {txt_file_path}")
        print(f"🏆 Winner: {summary['winner']}\n")
    print (f"final score:{total_wins}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--p1", required=True, help="Path to team's bot")
    parser.add_argument("--p2", required=True, help="Path to system's bot")
    parser.add_argument("--team", required=True, help="team name")
    args = parser.parse_args()
    print(sys.argv)
    print(parser)
    play_primary_game(args.p1, args.p2, args.team)


