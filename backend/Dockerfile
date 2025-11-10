FROM python:3.11
WORKDIR /backend

COPY requirements.txt .
RUN pip install -r requirements.txt

# Environment configuration
ENV FLASK_APP=backend.app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5005

COPY . .

CMD ["flask", "run"]
