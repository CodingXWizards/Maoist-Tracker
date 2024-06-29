from utils.summary import calc_summary

from connection import get_db_instance
from utils.summary import is_message, is_call, is_non_company_number

conn = get_db_instance()

def summary_generator(database_name, table_names):
    summary = {}
    try:
        summary = calc_summary(database_name, table_names, conn)
    except Exception as e:
        print(e)
    finally:
        return summary