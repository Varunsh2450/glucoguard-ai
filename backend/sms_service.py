import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

# Load credentials from .env safely
load_dotenv()

# We pull our Twilio secrets from the .env memory
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")

def send_alert_sms(risk_level: str, alert_message: str, glucose_current: float, predicted_glucose: float):
    """
    Sends an SMS alert to all loved ones stored in the environment variables.
    Handles Twilio errors gracefully without crashing the FastAPI application.
    """
    # Safety Check: If we don't have Twilio credentials, we securely abort the SMS
    if not ACCOUNT_SID or not AUTH_TOKEN or not TWILIO_PHONE:
        print("Error: Missing Twilio credentials in the .env file. Skipping SMS.")
        return

    # Grab the loved ones string from .env and split it into a list based on commas
    raw_numbers = os.getenv("LOVED_ONES_NUMBERS", "")
    loved_ones_list = [num.strip() for num in raw_numbers.split(",") if num.strip()]

    if not loved_ones_list:
        print("No loved ones defined in LOVED_ONES_NUMBERS.")
        return

    # Initialize the secure Twilio client
    client = Client(ACCOUNT_SID, AUTH_TOKEN)

    # We change the emoji and the action wording depending on if the risk is High or Medium
    risk_emoji = "🚨" if risk_level.upper() == "HIGH" else "⚠️"
    action_needed = "Ask them to eat 15g of fast-acting carbs immediately and stay with them."
    
    if risk_level.upper() == "MEDIUM":
        action_needed = "Check in with them and suggest a small snack."

    # Construct the exact SMS body format requested
    sms_body = (
        f"{risk_emoji} HypoGuard Alert — [{risk_level.upper()}] Risk\n\n"
        f"What's happening: {alert_message}\n\n"
        f"Current Glucose: {glucose_current} mg/dL\n"
        f"Predicted in 60 min: {predicted_glucose} mg/dL\n\n"
        f"Action needed: {action_needed}\n\n"
        f"— HypoGuard AI"
    )

    # Loop through the list of phone numbers and ping them all
    for phone_number in loved_ones_list:
        try:
            message = client.messages.create(
                body=sms_body,
                from_=TWILIO_PHONE,
                to=phone_number
            )
            print(f"SMS perfectly sent to {phone_number} (Message SID: {message.sid})")
        except TwilioRestException as e:
            # We catch specific Twilio errors (like 'Unverified Number') and prevent them from crashing the backend
            print(f"Twilio failed to send an SMS to {phone_number}. Error: {e.msg}")
        except Exception as e:
            # Catching generic system networking errors
            print(f"An unexpected error occurred sending SMS to {phone_number}: {e}")
