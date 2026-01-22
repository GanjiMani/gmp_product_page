"""
FastAPI application for GMP Dashboard Backend
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import SessionLocal, engine, Base
from models import CountTable, AIandCountrywise, ObservationsAlongWith483
from typing import Optional
from datetime import datetime

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="GMP Dashboard API",
    description="API for FDA 483 Observations Dashboard",
    version="1.0.0"
)

# CORS middleware to allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "GMP Dashboard API",
        "version": "1.0.0",
        "endpoints": {
            "total_observations": "/api/total-observations",
            "total_citesinspected": "/api/total-citesinspected",
            "program_area_counts": "/api/program-area-counts",
            "all_counts": "/api/all-counts"
        }
    }

@app.get("/api/total-observations")
async def get_total_observations(db: Session = Depends(get_db)):
    """
    Get total observations count
    Returns: {"id": int, "name": str, "total": int}
    """
    try:
        # Query the CountTable for total_observations
        record = db.query(CountTable).filter(
            CountTable.name == "total_observations"
        ).first()
        
        if not record:
            raise HTTPException(
                status_code=404,
                detail="Total observations record not found"
            )
        
        return {
            "id": record.id,
            "name": record.name,
            "total": record.count
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching total observations: {str(e)}"
        )

@app.get("/api/total-citesinspected")
async def get_total_citesinspected(db: Session = Depends(get_db)):
    """
    Get total cites inspected count
    Returns: {"id": int, "name": str, "total": int}
    """
    try:
        # Query the CountTable for total_citesinspected
        record = db.query(CountTable).filter(
            CountTable.name == "total_citesinspected"
        ).first()
        
        if not record:
            raise HTTPException(
                status_code=404,
                detail="Total cites inspected record not found"
            )
        
        return {
            "id": record.id,
            "name": record.name,
            "total": record.count
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching total cites inspected: {str(e)}"
        )

@app.get("/api/all-counts")
async def get_all_counts(db: Session = Depends(get_db)):
    """
    Get all count records
    Returns: List of {"id": int, "name": str, "total": int}
    """
    try:
        records = db.query(CountTable).all()
        
        return [
            {
                "id": record.id,
                "name": record.name,
                "total": record.count
            }
            for record in records
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching all counts: {str(e)}"
        )

@app.get("/api/program-area-counts")
async def get_program_area_counts(db: Session = Depends(get_db)):
    """
    Get program area counts from CountTable
    Returns: Object with program area names as keys and counts as values
    """
    try:
        # Define the program area fields to fetch
        program_area_fields = [
            "drugs",
            "food",
            "cosmetics",
            "biologics",
            "devices",
            "bioresearch_monitoring",
            "humantissue_for_transplantation",
            "radiologic_health",
            "veterinary_medicine",
            "part11_compliance",
            "part1240andpart1250"
        ]
        
        # Query all program area counts
        program_area_counts = {}
        for field in program_area_fields:
            record = db.query(CountTable).filter(
                CountTable.name == field
            ).first()
            
            if record:
                program_area_counts[field] = record.count
            else:
                program_area_counts[field] = 0
        
        return program_area_counts
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching program area counts: {str(e)}"
        )

@app.get("/api/inspection-classifications")
async def get_inspection_classifications(db: Session = Depends(get_db)):
    """
    Get NAI, VAI, OAI counts from AIandCountrywise table
    Returns: {"NAI": int, "VAI": int, "OAI": int}
    """
    try:
        # Query the AIandCountrywise table for classification data
        # The name column contains "NAI", "VAI", "OAI" and count column has the values
        nai_record = db.query(AIandCountrywise).filter(
            AIandCountrywise.name == "NAI"
        ).first()
        
        vai_record = db.query(AIandCountrywise).filter(
            AIandCountrywise.name == "VAI"
        ).first()
        
        oai_record = db.query(AIandCountrywise).filter(
            AIandCountrywise.name == "OAI"
        ).first()
        
        return {
            "NAI": nai_record.count if nai_record and nai_record.count else 0,
            "VAI": vai_record.count if vai_record and vai_record.count else 0,
            "OAI": oai_record.count if oai_record and oai_record.count else 0
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching inspection classifications: {str(e)}"
        )

@app.get("/api/trend-483-available-filters")
async def get_available_filters(db: Session = Depends(get_db)):
    """
    Get available program areas, systems, and years from ObservationsAlongWith483 table
    Returns: {"program_areas": List[str], "systems": List[str], "years": List[int]}
    """
    try:
        # Get distinct program areas
        program_areas = db.query(ObservationsAlongWith483.ProgramArea).distinct().all()
        program_areas_list = [pa[0] for pa in program_areas if pa[0]]
        
        # Get distinct systems
        systems = db.query(ObservationsAlongWith483.System).distinct().all()
        systems_list = [s[0] for s in systems if s[0]]
        
        # Get distinct years
        years = db.query(
            extract('year', ObservationsAlongWith483.InspectionEndDate)
        ).distinct().all()
        years_list = sorted([int(y[0]) for y in years if y[0]], reverse=True)
        
        return {
            "program_areas": program_areas_list,
            "systems": systems_list,
            "years": years_list
        }
    except Exception as e:
        import traceback
        error_detail = f"Error fetching available filters: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(
            status_code=500,
            detail=error_detail
        )

@app.get("/api/countrywise-counts")
async def get_countrywise_counts(db: Session = Depends(get_db)):
    """
    Get country-wise observation counts from AIandCountrywise table
    Returns: List of {"name": str, "count": int}
    """
    try:
        # Query the AIandCountrywise table for country data
        # Get all records that have a count value
        classification_names = ['NAI', 'VAI', 'OAI']
        
        # Get all records with count value
        all_records = db.query(AIandCountrywise).filter(
            AIandCountrywise.count.isnot(None)
        ).all()
        
        # Filter out classification names and records with zero/null counts
        country_data = [
            {
                "name": record.name,
                "count": record.count or 0
            }
            for record in all_records
            if record.name not in classification_names and record.count and record.count > 0
        ]
        
        # Sort by count descending
        country_data.sort(key=lambda x: x["count"], reverse=True)
        
        return country_data
    except Exception as e:
        # Log the error for debugging
        import traceback
        error_detail = f"Error fetching country-wise counts: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(
            status_code=500,
            detail=error_detail
        )

@app.get("/api/trend-483-data")
async def get_trend_483_data(
    program_area: Optional[str] = None,
    system: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get year-wise 483 trend data from ObservationsAlongWith483 table
    Filters by program_area and system
    Returns: List of {"year": int, "observations": int, "fda483s": int}
    """
    try:
        # Build query - Apply filters in order: Program Area -> System -> Year
        query = db.query(ObservationsAlongWith483)
        
        # Step 1: Filter by Program Area first
        if program_area:
            # Case-insensitive matching for program area
            query = query.filter(
                func.lower(ObservationsAlongWith483.ProgramArea) == func.lower(program_area)
            )
            import logging
            logging.info(f"Step 1 - Applied Program Area filter: {program_area}")
            count_after_program = query.count()
            logging.info(f"Records after Program Area filter: {count_after_program}")
        
        # Step 2: Filter by System (for the selected program area only)
        if system:
            # Case-insensitive matching for system
            query = query.filter(
                func.lower(ObservationsAlongWith483.System) == func.lower(system)
            )
            import logging
            logging.info(f"Step 2 - Applied System filter: {system}")
            count_after_system = query.count()
            logging.info(f"Records after System filter: {count_after_system}")
        
        # Debug logging
        import logging
        logging.info(f"Final query filters - program_area: {program_area}, system: {system}")
        
        # Get all records matching the filters
        records = query.all()
        logging.info(f"Trend data - Retrieved {len(records)} records from database after all filters")
        
        # Aggregate by year (2022-2026)
        year_data = {}
        for year in range(2022, 2027):
            year_data[year] = {"observations": 0, "fda483s": 0}
        
        # Aggregate by year (2022-2026)
        records_by_year = {}
        for record in records:
            if record.InspectionEndDate:
                year = record.InspectionEndDate.year
                if 2022 <= year <= 2026:
                    year_data[year]["observations"] += 1
                    # Count 483s (records with DownloadURL or Matched_FEI_Number)
                    if record.DownloadURL or record.Matched_FEI_Number:
                        year_data[year]["fda483s"] += 1
                    
                    # Track for debugging
                    if year not in records_by_year:
                        records_by_year[year] = 0
                    records_by_year[year] += 1
        
        logging.info(f"Trend data aggregated by year: {records_by_year}")
        logging.info(f"Trend data summary - Total records processed: {len(records)}, Years with data: {list(records_by_year.keys())}")
        
        # Convert to list format
        trend_data = [
            {
                "year": year,
                "observations": year_data[year]["observations"],
                "fda483s": year_data[year]["fda483s"]
            }
            for year in sorted(year_data.keys())
        ]
        
        return trend_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching trend 483 data: {str(e)}"
        )

@app.get("/api/trend-483-observations")
async def get_trend_483_observations(
    program_area: Optional[str] = None,
    system: Optional[str] = None,
    year: Optional[int] = None,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get observations and 483 warning letters for selected filters with pagination
    Returns: {"data": List of observation records, "total": int, "page": int, "page_size": int, "total_pages": int}
    """
    try:
        # Build query - Apply filters in order: Program Area -> System -> Year
        query = db.query(ObservationsAlongWith483)
        
        # Step 1: Filter by Program Area first
        if program_area:
            # Case-insensitive matching for program area
            query = query.filter(
                func.lower(ObservationsAlongWith483.ProgramArea) == func.lower(program_area)
            )
            import logging
            logging.info(f"Step 1 - Applied Program Area filter: {program_area}")
            count_after_program = query.count()
            logging.info(f"Records after Program Area filter: {count_after_program}")
        
        # Step 2: Filter by System (for the selected program area only)
        if system:
            # Case-insensitive matching for system
            query = query.filter(
                func.lower(ObservationsAlongWith483.System) == func.lower(system)
            )
            import logging
            logging.info(f"Step 2 - Applied System filter: {system}")
            count_after_system = query.count()
            logging.info(f"Records after System filter: {count_after_system}")
        
        # Step 3: Filter by Year (for Inspection End Date)
        if year:
            query = query.filter(
                extract('year', ObservationsAlongWith483.InspectionEndDate) == year
            )
            import logging
            logging.info(f"Step 3 - Applied Year filter: {year}")
            count_after_year = query.count()
            logging.info(f"Records after Year filter: {count_after_year}")
        
        # Get total count after all filters
        total = query.count()
        
        # Debug logging
        import logging
        logging.info(f"Final query filters - program_area: {program_area}, system: {system}, year: {year}")
        logging.info(f"Total records found after all filters: {total}")
        
        # If no filters provided, show a message (but still return empty result)
        if not program_area and not system and not year:
            logging.warning("No filters provided - returning empty result. Please provide at least one filter.")
        
        # Calculate pagination
        total_pages = (total + page_size - 1) // page_size  # Ceiling division
        offset = (page - 1) * page_size
        
        # Get records with pagination
        records = query.offset(offset).limit(page_size).all()
        
        # Debug: Log number of records retrieved
        import logging
        logging.info(f"Retrieved {len(records)} records from database")
        
        # Convert to response format
        observations = []
        for record in records:
            obs = {
                "inspectionId": record.InspectionID if record.InspectionID else None,
                "feiNumber": record.FEINumber if record.FEINumber else None,
                "companyName": record.LegalName if record.LegalName else None,
                "inspectionEndDate": record.InspectionEndDate.isoformat() if record.InspectionEndDate else None,
                "programArea": record.ProgramArea if record.ProgramArea else None,
                "system": record.System if record.System else None,
                "cfrNumber": record.ActCFRNumber if record.ActCFRNumber else None,
                "shortDescription": record.ShortDescription if record.ShortDescription else None,
                "longDescription": record.LongDescription if record.LongDescription else None,
                "warningLetter": None
            }
            
            # Add warning letter data if available
            if record.DownloadURL or record.Matched_FEI_Number:
                obs["warningLetter"] = {
                    "recordId": f"WL-{record.InspectionID}" if record.InspectionID else "WL-Unknown",
                    "download": record.DownloadURL if record.DownloadURL else None,
                    "recordDate": record.Matched_Record_Date.isoformat() if record.Matched_Record_Date else None,
                    "publishDate": None  # Not available in current model
                }
            
            observations.append(obs)
        
        # Debug: Log first observation if available
        if observations:
            import logging
            logging.info(f"First observation sample: {observations[0]}")
        
        return {
            "data": observations,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    except Exception as e:
        import traceback
        error_detail = f"Error fetching trend 483 observations: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_detail)
        raise HTTPException(
            status_code=500,
            detail=error_detail
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
