from fastapi import APIRouter
from controllers.data_controller import fetch_databases, fetch_table_names, fetch_table_data;

router = APIRouter()

@router.get("/databases")
def get_databases():
    return fetch_databases()

@router.get("/table_names")
async def get_table_names(database_name: str = None):
    return fetch_table_names(database_name)

@router.get("/table_data")
async def get_table_names(database_name: str = None, table_name: str = None):
    return fetch_table_data(database_name, table_name)

@router.post("/generate_summary")
async def generate_summary(database_name: str = None, table_names: str = None):
    return summary_generator(database_name, table_name)