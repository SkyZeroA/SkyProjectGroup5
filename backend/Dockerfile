FROM python:3.11
WORKDIR /backend

COPY requirements.txt .

ENV FLASK_APP="app.py"
ENV FLASK_RUN_PORT=3005
ENV FLASK_RUN_HOST=0.0.0.0

RUN pip install -r requirements.txt
COPY . .
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=3005"]
