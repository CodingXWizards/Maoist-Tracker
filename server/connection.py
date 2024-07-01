import pyodbc
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_instance():
    server = os.getenv("DATABASE_SERVER")
    database = os.getenv("DATABASE_NAME")
    username = os.getenv("DATABASE_USER")
    password = os.getenv("DATABASE_PASSWORD")

    conn = pyodbc.connect(f"DRIVER=ODBC Driver 18 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes")
    return conn
