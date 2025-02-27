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
docker buildx build --platform linux/amd64 -t pshar10/bill_dekho:v4 --output type=docker .
```

### **Pushing the Docker Image**
```bash
docker push pshar10/bill_dekho:v4
```

### **Running the Application**
```bash
docker run -d -p 8000:8000 --name bill_dekho pshar10/bill_dekho:v4
```

---

## Setting Up Nginx for Reverse Proxy and SSL

### **Installing Nginx**
```bash
sudo apt update
sudo apt install nginx
```

### **Installing Let's Encrypt SSL Certificate**
Install Certbot and obtain an SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.myself-pranav-sharma.online
```
Follow the prompts and Certbot will automatically configure SSL for Nginx.

### **Configuring Nginx**
Edit the Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/default
```
Replace its contents with:

```nginx
server {
    listen 80;
    server_name app.myself-pranav-sharma.online;
    return 301 https://$host$request_uri;  # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl;
    server_name app.myself-pranav-sharma.online;

    ssl_certificate /etc/letsencrypt/live/app.myself-pranav-sharma.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.myself-pranav-sharma.online/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /test {
        return 200 "HTTPS is working!";
        add_header Content-Type text/plain;
    }
}
```

### **Applying Changes**
```bash
sudo nginx -t  # Test configuration
sudo systemctl reload nginx  # Reload Nginx
```

### **Automatic SSL Renewal**
Set up a cron job to renew SSL certificates automatically:
```bash
sudo crontab -e
```
Add the following line:
```bash
0 0 * * * certbot renew --quiet
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

