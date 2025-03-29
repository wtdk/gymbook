import time
import random
import re

from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

time_slots = {
    "b0": "9:00-12:00",
    "b1": "13:00-17:00",
    "b2": "18:00-21:00"
}

def run(config):
    slots, mode = ["b1"], config["mode"]
    if mode == "weekend":
        slots.append("b2")

    service, chrome_options = Service(ChromeDriverManager().install()), Options()

    if config["headless"] == True:
        chrome_options.add_argument("--headless")  # Enable headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        user_id, password, date = config["user"]["id"], config["user"]["password"], config["date"]
        navigate_and_login(driver, user_id, password)
        process_facility_selection(driver)
        process_date_selection(driver, date, mode)
        dates = process_available_dates(driver)
        process_timeslots(driver, slots, mode, dates)
        process_booking_details(driver, config)

        if config["headless"] == False:
            # Keep the browser window open
            input("Press Enter to close the browser...")

    except Exception as e:
        print(f"Error during navigation: {str(e)}")
        raise
    finally:
        pass  # Removed driver.quit() to keep the window open

def navigate_and_login(driver, user_id, password):
    WebDriverWait(driver, 20)
    login(driver, user_id, password)

    if "Wg_ModeSelect.aspx" not in driver.current_url:
        print("Not on mode select page. Current URL:", driver.current_url)
        raise Exception("Navigation error: Not on mode select page")

def process_facility_selection(driver):
    wait = WebDriverWait(driver, 20)

    # Wait for page load and click sports facilities
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    time.sleep(random_delay())

    sports_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "dlSSCategory_ctl02_btnSSCategory")))
    time.sleep(random_delay())
    sports_button.click()

    # Wait and verify we're on facilities list page
    wait.until(lambda driver: "Wg_ShisetsuIchiran.aspx" in driver.current_url)
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("On facilities list page:", driver.current_url)
    time.sleep(random_delay())

    # Click Tanaka Sports Plaza
    tanaka_plaza = wait.until(EC.element_to_be_clickable(
        (By.ID, "dgShisetsuList_ctl06_chkSelectLeft")))
    time.sleep(random_delay())
    tanaka_plaza.click()

    # Verify we're still on the same page before clicking next
    if "Wg_ShisetsuIchiran.aspx" not in driver.current_url:
        raise Exception("Unexpected page after selecting facility")

    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    time.sleep(random_delay())

    # Click the Next button
    next_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "ucPCFooter_btnForward")))
    time.sleep(random_delay())
    next_button.click()

def process_date_selection(driver, date, mode):
    wait = WebDriverWait(driver, 20)

    # Wait for next page to load and verify we're on date selection page
    wait.until(lambda driver: "Wg_NichijiSentaku.aspx" in driver.current_url)
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("On date selection page:", driver.current_url)
    time.sleep(random_delay())

    # Input date fields
    year_field = wait.until(EC.presence_of_element_located((By.ID, "txtYear")))
    year_field.clear()
    year_field.send_keys(str(date.year))
    time.sleep(random_delay())

    month_field = driver.find_element(By.ID, "txtMonth")
    month_field.clear()
    month_field.send_keys(str(date.month))
    time.sleep(random_delay())

    day_field = driver.find_element(By.ID, "txtDay")
    day_field.clear()
    day_field.send_keys(str(date.day))
    time.sleep(random_delay())

    # Click 1ヶ月 button
    month_button = wait.until(EC.element_to_be_clickable((By.ID, "rbtnMonth")))
    month_button.click()
    time.sleep(random_delay())

    if mode == "weekend":
        month_button = wait.until(EC.element_to_be_clickable((By.ID, "chkSat")))
        month_button.click()
        time.sleep(random_delay())

        month_button = wait.until(EC.element_to_be_clickable((By.ID, "chkSun")))
        month_button.click()
        time.sleep(random_delay())

        month_button = wait.until(EC.element_to_be_clickable((By.ID, "chkHol")))
        month_button.click()

    # Click next button
    next_button = wait.until(EC.element_to_be_clickable((By.ID, "ucPCFooter_btnForward")))
    next_button.click()

def process_available_dates(driver):
    wait = WebDriverWait(driver, 20)

    # Wait for next page to load
    wait.until(lambda driver: "Wg_ShisetsubetsuAkiJoukyou.aspx" in driver.current_url)
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("On availability page:", driver.current_url)
    time.sleep(random_delay())

    # Find specifically the arena dates with ctl02 in their IDs
    available_dates = driver.find_elements(
        By.XPATH,
        "//a[contains(@id, 'dlRepeat_ctl00_tpItem_dgTable_ctl02') and contains(text(), '△')]"
    )

    dates_to_click_count, date_objects = 10, []
    if not available_dates:
        print("No available dates found in arena row")
    else:
        print(f"Found {len(available_dates)} available dates in arena row")
        # Click available dates
        dates_to_click, date_strings = available_dates[:dates_to_click_count], []

        print(f"Will click first {len(dates_to_click)} dates")

        for date in dates_to_click:
            try:
                if date.is_displayed() and date.is_enabled():
                    date_id = date.get_attribute('id')
                    if date_id is not None:
                        # regex to extract date from element ID
                        d = re.findall(r"\d{8}$", str(date_id))
                        if d:
                            date_strings.append(d[0])

                        print(f"Clicking date element -- ({date_id})")
                        date.click()
                        time.sleep(random_delay())
                        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
            except Exception as e:
                print(f"Failed to click date: {e}")

        # print dates in friendly format
        date_objects = [datetime.strptime(d, "%Y%m%d").date() for d in date_strings]

    # Click next button
    next_button = wait.until(EC.element_to_be_clickable((By.ID, "ucPCFooter_btnForward")))
    time.sleep(random_delay())
    next_button.click()
    return date_objects

def process_timeslots(driver, slots, mode, dates):
    wait = WebDriverWait(driver, 20)

    # Wait for timeslot page to load
    wait.until(lambda driver: "Wg_JikantaibetsuAkiJoukyou.aspx" in driver.current_url)
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("On timeslot selection page:", driver.current_url)
    time.sleep(random_delay())

    formatted_slots = []
    for s in slots:
        slot = f"contains(@id, '_tpItem_dgTable_ctl02_{s}')"
        formatted_slots.append(slot)

    available_slots = driver.find_elements(
        By.XPATH, f"//a[({' or '.join(formatted_slots)}) and contains(text(), '○')]"
    )

    dates_mapped_to_slots = []
    for x, do in enumerate(dates):
        dates_mapped_to_slots.append({"date": do, "slots": []})

    if not available_slots:
         print(f"No available {' or '.join(slots)} timeslots")
    else:
        print(f"Found {len(available_slots)} available {' or '.join(slots)} timeslots")

        for slot in available_slots:
            try:
                if slot.is_displayed() and slot.is_enabled():
                    slot_id = slot.get_attribute('id')

                    match = re.search(r'dlRepeat_ctl(\d{2})_tpItem_dgTable_ctl\d{2}_(b\d)', slot_id)
                    if match:
                        date_idx, slot_key = int(match.group(1)), match.group(2)
                        dates_mapped_to_slots[date_idx]["slots"].append(time_slots[slot_key])

                    print(f"Clicking timeslot: {slot_id}")
                    slot.click()
                    time.sleep(random_delay())
                    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")

                    # Handle potential alert for weekend mode
                    if mode == "weekend":
                        handle_weekend_alert(driver)

            except Exception as e:
                print(f"Failed to click timeslot: {e}")
                if mode == "weekend":
                    handle_weekend_alert(driver)

    print("Print slots friendly manner")
    for x in range(len(dates_mapped_to_slots)):
        ds = dates_mapped_to_slots[x]
        print(f"{x+1}. {ds['date'].strftime('%B %d, %Y')}: {' and '.join(ds['slots'])}")

    # Click next button after timeslot selection
    next_button = wait.until(EC.element_to_be_clickable((By.ID, "ucPCFooter_btnForward")))
    time.sleep(random_delay())
    next_button.click()

def process_booking_details(driver, config):
    wait = WebDriverWait(driver, 20)

    # Wait for details page to load
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("On details page:", driver.current_url)
    time.sleep(random_delay())

    # Input number of people (15)
    people_field = wait.until(EC.presence_of_element_located((By.ID, "txtNinzu")))
    people_field.clear()
    people_field.send_keys("15")
    time.sleep(random_delay())

    # Select basketball purpose
    basketball_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "dlPurpose_ctl11_orbPurpose")))
    basketball_button.click()
    time.sleep(random_delay())

    # Select 通常 (normal) option
    normal_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "dlRepeat_ctl00_tpItem_dgTable_ctl02_rbtnSelect")))
    normal_button.click()
    time.sleep(random_delay())

    # Select はい (yes) option
    yes_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "orbCopyYes")))
    yes_button.click()
    time.sleep(random_delay())

    # Click confirm button (確定)
    if config.get('stop_early', False):
        driver.quit()
        return
    else:
        confirm_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "ucPCFooter_btnForward")))
        time.sleep(random_delay())
        confirm_button.click()

    # Wait for next page to load
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("Completed details page. Current URL:", driver.current_url)

    # Wait for confirmation page to load
    wait.until(lambda driver: "Wg_YoyakuKakunin.aspx" in driver.current_url)
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("On final confirmation page:", driver.current_url)
    time.sleep(random_delay())

    # Click final submit button (申込)
    submit_button = wait.until(EC.element_to_be_clickable(
        (By.ID, "ucPCFooter_btnForward")))
    time.sleep(random_delay())
    submit_button.click()

    # Wait for completion
    wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
    print("Booking process completed. Current URL:", driver.current_url)

def random_delay():
    """Generate a random delay between 0.1 and 0.15 seconds"""
    return random.uniform(0.1, 0.15)

def handle_weekend_alert(driver):
    """
    Helper function to handle weekend alert popups.
    Returns True if alert was handled, False if no alert present.
    """
    try:
        alert = driver.switch_to.alert
        alert_text = alert.text
        print(f"Alert detected: {alert_text}")
        alert.accept()  # Click OK
        time.sleep(random_delay())
        return True
    except:
        return False # No alert present

def login(driver, user_id, password):
    """Handle the login process"""
    try:
        # Navigate to the main page first
        driver.get("https://shisetsu.city.taito.lg.jp/")

        # Wait for and click the login button
        wait = WebDriverWait(driver, 20)
        login_button = wait.until(EC.element_to_be_clickable((By.ID, "rbtnLogin")))
        time.sleep(random_delay())
        login_button.click()

        # Verify we're on the login page
        wait.until(lambda driver: "Wg_Login.aspx" in driver.current_url)
        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        print("On login page:", driver.current_url)

        # Now wait for login form elements and input credentials
        id_field = wait.until(EC.presence_of_element_located((By.ID, "txtID")))
        password_field = driver.find_element(By.ID, "txtPass")

        # Input credentials with small delays
        time.sleep(random_delay())
        id_field.send_keys(user_id)
        time.sleep(random_delay())
        password_field.send_keys(password)
        time.sleep(random_delay())

        # Click the login submit button
        submit_button = driver.find_element(By.ID, "ucPCFooter_btnForward")
        submit_button.click()

        # Wait for redirect to mode select page
        wait.until(lambda driver: "Wg_ModeSelect.aspx" in driver.current_url)
        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        print("Successfully reached mode select page:", driver.current_url)

    except Exception as e:
        print(f"Login failed: {str(e)}")
        raise
