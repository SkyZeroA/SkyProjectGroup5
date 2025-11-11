FROM python:3.11
WORKDIR /backend

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_APP=app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5005

EXPOSE 5005

CMD ["flask", "run"]
