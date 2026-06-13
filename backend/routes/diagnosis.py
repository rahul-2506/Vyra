from fastapi import APIRouter, File, UploadFile, HTTPException
from schemas.response_schema import CropDiagnosisResponse
from services.vision_service import analyze_crop_image

router = APIRouter()

@router.post("/crop-diagnosis", response_model=CropDiagnosisResponse)
async def crop_diagnosis_endpoint(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
            
        image_bytes = await file.read()
        
        analysis_data = analyze_crop_image(image_bytes)
        
        return CropDiagnosisResponse(
            crop=analysis_data.get("crop", "Unknown"),
            disease=analysis_data.get("disease", "Unknown"),
            severity=analysis_data.get("severity", "Unknown"),
            recommendation=analysis_data.get("recommendation", "No recommendation available")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
