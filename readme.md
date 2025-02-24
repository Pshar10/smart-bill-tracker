# Bill Dekho

## Overview

**Bill Dekho** is a web application designed to help users analyze their electricity consumption and optimize costs. The application fetches smart meter readings from the **JPDCL website**, processes the data, and provides **daily energy usage insights and cost estimates**. 

By leveraging **web scraping**, the app automatically retrieves **electricity meter readings** based on a user's **consumer ID**, structures the data, and calculates **daily power consumption and costs** using **data processing techniques**.

## How It Works

1. **User Input**: Users enter their **consumer ID** on the web application.
2. **Data Retrieval**: The backend uses **Selenium** to scrape electricity meter readings from the official **JPDCL smart meter portal**.
3. **Data Processing**:
   - Extracts **date-wise readings** of **kWh (kilowatt-hours) and kVAh (kilovolt-ampere hours)**.
   - Sorts the data chronologically and calculates **daily power consumption (difference between consecutive readings)**.
   - Estimates **daily electricity costs** using a predefined rate (**₹4.37 per unit**).
4. **Data Visualization**: The results are **displayed as a graph**, showing daily power consumption trends and costs.

## Technology Stack

### **Frontend**
- **HTML, CSS, JavaScript** for the web interface
- **Bootstrap** for responsive design
- **Chart.js** for interactive data visualization

### **Backend**
- **Django (Python)** for handling requests and business logic
- **Selenium** for automated web scraping of electricity meter data
- **Pandas** for data processing and analysis

### **Infrastructure**
- **Docker** for containerization and easy deployment
- **Nginx** for serving the application and managing redirects

### **Database**
- **SQLite** (or a configurable database of choice)

---

## Features

✅ **Automated Data Fetching**: No need for manual data entry—just enter your **consumer ID**, and Bill Dekho fetches the latest smart meter readings.  
✅ **Daily Power Consumption Analysis**: Understand your energy usage over time.  
✅ **Cost Estimation**: Know how much you're spending daily on electricity.  
✅ **Intuitive Graphs**: Visualize energy trends in an easy-to-read format.  
✅ **Fast and Lightweight**: Built using **Django** and deployed with **Docker** for efficiency.

---

## Screenshot

![Web Application Screenshot](webapp.png)

---

## Installation and Setup

### **Prerequisites**
- **Docker** must be installed on your machine. If not, install it using:
  ```bash
  sudo apt update
  sudo apt install docker.io
  sudo usermod -aG docker $USER
  ```
  (Log out and log back in to apply changes.)

### **Cloning the Repository**
```bash
git clone https://github.com/Pshar10/smart-bill-tracker.git
cd smart-bill-tracker
```

### **Building the Docker Image**
```bash
docker buildx build --platform linux/amd64 -t pshar10/bill_dekho:v3 --output type=docker .
```

### **Pushing the Docker Image**
```bash
docker push pshar10/bill_dekho:v3
```

### **Running the Application**
```bash
docker run -d -p 8000:8000 --name bill_dekho pshar10/bill_dekho:v3
```

---

## Setting Up Nginx for Reverse Proxy

### **Installing Nginx**
```bash
sudo apt update
sudo apt install nginx
```

### **Configuring Nginx**
Edit the default configuration file:
```bash
sudo nano /etc/nginx/sites-available/default
```
Replace its contents with:

```nginx
server {
    listen 80;
    server_name $host app.myself-pranav-sharma.online;  # Replace with your domain or server IP

    location / {
        return 301 http://$host:8000$request_uri;  # Redirect to the Django application
    }
}
```

### **Applying Changes**
```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx  # Reload Nginx
```

---

## Usage

1. **Visit the website** (or server IP/domain).
2. **Enter your consumer ID** and submit.
3. **View your electricity usage trends and estimated daily costs** in an interactive chart.

---

## Contribution

Want to improve **Bill Dekho**?  
- Fork the repository  
- Submit a **Pull Request** with your improvements  
- Suggestions & feedback are always welcome!  

---

## License

This project is licensed under the **MIT License**.

---

Let me know if you need any modifications! 🚀