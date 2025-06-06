# Taito City Sports Facility Booking Scripts

This repository contains two Python scripts for automating court bookings at Taito City Sports Plaza (台東スポーツプラザ). Both scripts use Selenium WebDriver to automate the booking process, but they're designed for different booking scenarios.

## Scripts Overview

### 1. `main.py` - Weekday Evening Court Booking
- Designed for booking evening time slots (b2: 18:00-21:00)
- Books up to 10 available dates
- Uses `config.txt` for configuration
- Simpler date selection (no specific day filtering)

### 2. `weekend.py` - Weekend Court Booking
- Designed specifically for weekend and holiday bookings
- Books both afternoon (b1: 13:00-17:00) and evening (b2: 18:00-21:00) slots
- Uses `weekend_config.txt` for configuration
- Includes weekend/holiday date filtering
- Enhanced error handling for Japanese alert messages

## Prerequisites

- Python 3.x
- Chrome browser installed
- Required Python packages:
  ```
  selenium
  webdriver-manager
  ```

## Configuration

### For `main.py`:
Create a `config.txt` file with:
```
user_id=your_user_id
password=your_password
date=YYYY-MM-DD
```

### For `weekend.py`:
Create a `weekend_config.txt` file with:
```
user_id=your_user_id
password=your_password
date=YYYY-MM-DD
```

## Time Slots

The scripts handle different time slots:
- b0: 9:00-12:00 (Morning)
- b1: 13:00-17:00 (Afternoon)
- b2: 18:00-21:00 (Evening)

## Usage

1. Clone the repository
2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Create the appropriate config file based on which script you want to use
4. Run the desired script:
   ```bash
   # For evening bookings
   python main.py
   
   # For weekend bookings
   python weekend.py
   ```

## Common Features

Both scripts share these features:
- Automated login
- Random delays to simulate human behavior
- Chrome browser automation
- Error handling
- Browser window remains open for manual inspection
- Automatic basketball purpose selection
- 15-person group size setting

## Differences

### `main.py`
- Focused on evening slots only (b2)
- Books up to 10 dates
- No specific day filtering
- Simpler configuration

### `weekend.py`
- Handles both afternoon (b1) and evening (b2) slots
- Specifically filters for weekends and holidays
- Enhanced alert handling for Japanese error messages
- Separate configuration file

## Error Handling

Both scripts include error handling for:
- Login failures
- Missing configuration files
- Invalid date formats
- Network issues
- Element not found errors

`weekend.py` additionally handles:
- Japanese alert messages
- Weekend/holiday specific errors
- Multiple time slot selection errors

## Notes

- The scripts include random delays between actions to simulate human-like behavior
- Browser windows remain open until you press Enter
- Make sure your credentials in the config files are correct
- The scripts are designed to work with the Taito City Sports Plaza website

## Disclaimer

These scripts are for educational purposes only. Please ensure you comply with Taito City's terms of service and booking policies when using these scripts.

## Contributing

Feel free to submit issues and enhancement requests!
