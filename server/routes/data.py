import json

from fastapi import APIRouter, Request
from controllers.data_controller import fetch_databases, fetch_table_names, fetch_table_data;
from controllers.summary_controller import summary_generator

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
async def generate_summary(request: Request):
    data = await request.body()
    data = data.decode('utf-8')
    json_data = json.loads(data)
    return summary_generator(database_name=json_data.get('database_name'), table_names=json_data.get('table_names'))