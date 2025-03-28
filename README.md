# Taito City Sports Facility Booking Script

This Python script automates the process of booking sports facilities (specifically the arena) at Taito City Sports Plaza (台東スポーツプラザ) through their online reservation system.

## Features

- Automated login using credentials from a config file
- Selects specific dates (weekends and holidays)
- Books available time slots (b1: 13:00-17:00 and b2: 18:00-21:00)
- Handles Japanese error messages and alerts
- Configurable number of people (default: 15)
- Automated basketball purpose selection
- Random delays to simulate human-like behavior

```
selenium
webdriver-manager
configparser
```

## Configuration

Create a `weekend_config.txt` file in the same directory with the following format:

```
user_id=your_user_id
password=your_password
date=YYYY-MM-DD
```

Example:
```
user_id=123456
password=your_password
date=2024-03-01
```

## Time Slots

The script looks for the following time slots:
- b1: 13:00-17:00 (Afternoon)
- b2: 18:00-21:00 (Evening)

## Notes

- The script includes random delays between actions to simulate human-like behavior
- It will attempt to book up to 10 available dates
- The browser window will remain open until you press Enter
- The script handles various Japanese error messages and alerts automatically
- Make sure your credentials in `weekend_config.txt` are correct

## Error Handling

The script includes error handling for:
- Login failures
- Missing configuration file
- Invalid date format
- Japanese error messages and alerts
- Network issues
- Element not found errors

## Disclaimer

This script is for educational purposes only. Please ensure you comply with Taito City's terms of service and booking policies when using this script.

## Contributing

Feel free to submit issues and enhancement requests!
