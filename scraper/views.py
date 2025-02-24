from django.shortcuts import render
from django.http import JsonResponse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
def index(request):
    return render(request, 'bill_dekho/index.html')

def get_data(request):
    consumer_id = request.GET.get('consumer_id')

    if not consumer_id:
        return JsonResponse({"error": "Consumer ID is required"}, status=400)
    

        
    CHROMEDRIVER_PATH = "/usr/bin/chromedriver"
    CHROME_BINARY_PATH = "/usr/bin/chromium"
    service = Service(CHROMEDRIVER_PATH)
    options = webdriver.ChromeOptions()
    options.binary_location = CHROME_BINARY_PATH
    
    
    # service = Service(ChromeDriverManager().install()) #for local browser testing
    # options = webdriver.ChromeOptions()
    
    
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get("https://www.jpdcl.co.in/smartmeter/")

        input_field = WebDriverWait(driver, 1).until(
            EC.element_to_be_clickable((By.ID, "consumercode"))
        )
        submit_button = driver.find_element(By.ID, "cidsubmit")

        input_field.send_keys(consumer_id)
        submit_button.click()

        dropdown = WebDriverWait(driver, 1).until(
            EC.element_to_be_clickable((By.NAME, "readtable1_length"))
        )
        Select(dropdown).select_by_visible_text("100")

        WebDriverWait(driver, 2).until(
            EC.presence_of_element_located((By.TAG_NAME, "tbody"))
        )

        data = []
        table_body = driver.find_element(By.TAG_NAME, "tbody")
        rows = table_body.find_elements(By.TAG_NAME, "tr")

        for row in rows:
            columns = row.find_elements(By.TAG_NAME, "td")
            if len(columns) >= 3:
                try:
                    date = columns[0].text.strip()
                    reading_kWh = float(columns[1].text.strip())
                    reading_kVAh = float(columns[2].text.strip())
                    data.append((date, reading_kWh, reading_kVAh))
                except ValueError:
                    continue  # Skip rows with invalid data

        df = pd.DataFrame(data, columns=["Date", "kWh Reading", "kVAh Reading"])
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        df.dropna(subset=["Date"], inplace=True)
        df.sort_values("Date", inplace=True)
        df["Daily Units"] = df["kWh Reading"].diff().bfill()
        cost_per_unit = 4.37
        df["Daily Cost (₹)"] = df["Daily Units"] * cost_per_unit

        response_data = {
            "dates": df["Date"].dt.strftime('%Y-%m-%d').tolist(),
            "daily_cost": df["Daily Cost (₹)"].tolist()
        }

    except Exception as e:
        print("Error retrieving meter readings:", e)
        response_data = {"error": "Failed to retrieve data"}

    finally:
        driver.quit()

    return JsonResponse(response_data)
