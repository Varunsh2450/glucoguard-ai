from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from sms_service import send_alert_sms

app = FastAPI(title="HypoGuard AI Backend")

# Define our expected JSON payload format coming from the React Frontend
class PredictionRequest(BaseModel):
    patient_id: str
    glucose_current: float
    predicted_glucose: float
    risk_level: str
    alert_message: str

@app.post("/predict")
async def predict_risk(data: PredictionRequest, background_tasks: BackgroundTasks):
    """
    Analyzes patient data and calculates risk.
    If the risk is Medium or High, we trigger Twilio SMS in the background
    so the FastAPI server response is completely instantaneous!
    """
    
    # Normally, your Deep Learning model would calculate the risk level here
    # For now, we use the risk_level provided directly from the payload request
    risk = data.risk_level.capitalize()  # Format to "High" or "Medium"

    # Connect to the Twilio /predict endpoint SMS routing system exactly as requested
    if risk == "Medium" or risk == "High":
        # By passing this to background_tasks.add, FastAPI fires the Twilio SMS 
        # behind the scenes *after* returning the "success" JSON response instantly!
        background_tasks.add(
            send_alert_sms,
            risk_level=risk,
            alert_message=data.alert_message,
            glucose_current=data.glucose_current,
            predicted_glucose=data.predicted_glucose
        )

    return {
        "success": True,
        "message": f"Analysis complete. Risk level is {risk}.",
        "dispatched_sms": True if (risk in ["Medium", "High"]) else False
    }

@app.get("/")
def home():
    return {"status": "HypoGuard API Online"}
