FROM python:3.11

# Set workdir to root of project
WORKDIR /

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy backend folder into container root
COPY backend ./backend

# Expose port (optional)
EXPOSE 3005

# Run the backend as a module
CMD ["python3", "-m", "backend.app"]
