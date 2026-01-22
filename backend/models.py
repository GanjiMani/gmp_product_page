from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Observation(Base):
    __tablename__ = "Observations"
    
    InspectionID = Column(Integer, primary_key=True, index=True)
    FEINumber = Column(String(50), nullable=False, index=True)
    LegalName = Column(String(500), nullable=True)
    InspectionEndDate = Column(Date, nullable=True, index=True)
    ProgramArea = Column(String(200), nullable=True, index=True)
    ActCFRNumber = Column(String(100), nullable=True)
    ShortDescription = Column(String(500), nullable=True)
    LongDescription = Column(Text, nullable=True)
    CreatedAt = Column(DateTime, server_default=func.getdate(), nullable=False)
    UpdatedAt = Column(DateTime, server_default=func.getdate(), onupdate=func.getdate(), nullable=False)

class CountTable(Base):
    __tablename__ = "CountTable"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    count = Column(Integer, nullable=False)

class SystemwiseByProgramarea(Base):
    __tablename__ = "SystemwiseByProgramarea"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Programarea = Column(String(255), nullable=False)
    Laboratorysystem = Column(String(255), nullable=False)
    FacilityEquipmentsystem = Column(String(255), nullable=False)
    Qualitysystem = Column(String(255), nullable=False)
    Materialsystem = Column(String(255), nullable=False)
    Productionsystem = Column(String(255), nullable=False)
    Packagingandlabelingsystem = Column(String(255), nullable=False)
    CreatedAt = Column(DateTime, server_default=func.getdate(), nullable=False)
    UpdatedAt = Column(DateTime, server_default=func.getdate(), onupdate=func.getdate(), nullable=False)

class AIandCountrywise(Base):
    __tablename__ = "AIandCountrywise"
    id=Column(Integer, primary_key=True, index=True, autoincrement=True)
    name=Column(String(255), nullable=False)
    count=Column(Integer, nullable=True)  # For both classification counts (NAI, VAI, OAI) and country-wise counts
    CreatedAt = Column(DateTime, server_default=func.getdate(), nullable=False)
    UpdatedAt = Column(DateTime, server_default=func.getdate(), onupdate=func.getdate(), nullable=False)

class ObservationsAlongWith483(Base):
    __tablename__ = "ObservationsAlongWith483"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    InspectionID = Column(Integer, nullable=False, index=True)
    FEINumber = Column(String(50), nullable=False, index=True)
    LegalName = Column(String(500), nullable=True)
    InspectionEndDate = Column(Date, nullable=True)
    ProgramArea = Column(String(255), nullable=True)
    ActCFRNumber = Column(String(255), nullable=True)
    System = Column(String(255), nullable=True)
    ShortDescription = Column(String(1000), nullable=True)
    LongDescription = Column(Text, nullable=True)

    Matched_FEI_Number = Column(String(50), nullable=True, index=True)
    Matched_Record_Date = Column(Date, nullable=True)
    DownloadURL = Column(String(1000), nullable=True)