import argparse
import sys

from datetime import datetime

import assistant

# enter dates as command line arguments or through an api call maybe a frontend
# send email of details
# put service on server
# view reservations
# save accounts to a db
# save reservation to a db
# make multiple attempts or do batch requests
# bonus cancel reservation

def parse_args():
    parser = argparse.ArgumentParser(description='Book your next gym session')
    parser.add_argument("--user_id", help="user id")
    parser.add_argument("--password", help="password")
    parser.add_argument("--mode", help="mode of the session", choices=["normal", "weekend"], default="normal")
    parser.add_argument("--headless", help="run in headless mode", default=False)
    parser.add_argument("--stop_early", help="stop early and don't book (useful for testing)", default=False)
    parser.add_argument("--date", help="date of the session", default="2023-01-01")
    args = parser.parse_args()

    try:
        date = datetime.strptime(args.date, '%Y-%m-%d')
    except ValueError:
        raise parser.error("Date must be in YYYY-MM-DD format")

    return {
        "mode": args.mode,
        "headless": args.headless,
        "stop_early": args.stop_early,
        "date": date,
        "user": {
            "id": args.user_id,
            "password": args.password
        }
    }

def main():
    try:
        config = parse_args()
        assistant.run(config)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
