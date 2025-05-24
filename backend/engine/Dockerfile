# engine/Dockerfile
FROM python:3.11-slim

WORKDIR /app
RUN mkdir -p /app/game_logs \
    && mkdir -p /app/systemBot \
    && mkdir -p /app/bot1 \
    && mkdir -p /app/bot2 \
    && mkdir -p /app/botToChallenge \
    && mkdir -p /app/challengerBot \
    && mkdir -p /logs

COPY engine1.py bot1.py run_match.py ./

CMD ["python", "run_match.py"]


# # Dockerfile
# FROM python:3.9-slim

# WORKDIR /app

# # Copy only necessary files
# COPY engine/ /app/
# COPY bot1.py /systemBot/

# # Install minimal dependencies
# RUN pip install --no-cache-dir numpy

# # Create a non-root user
# RUN useradd -m botrunner
# USER botrunner

# # Set up read-only filesystem
# RUN mkdir -p /tmp/logs && chmod 777 /tmp/logs
# VOLUME /tmp/logs

# CMD ["sleep", "infinity"]
