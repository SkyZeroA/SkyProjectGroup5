FROM python:3.11
WORKDIR /backend

COPY requirements.txt .

ENV FLASK_APP=backend.app
ENV FLASK_RUN_PORT=3005

RUN pip install -r requirements.txt
COPY . .
CMD ["python3", "-m", "backend.app"]
