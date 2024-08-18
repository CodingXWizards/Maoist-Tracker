from utils.summary import calc_summary_cdr, calc_summary_tdr

from connection import get_db_instance

conn = get_db_instance()

def summary_generator(database_name, table_names):
    summary = {}
    type = str(database_name).split("_")[1]
    print(type)
    try:
        if(type == 'cdr'):
            summary = calc_summary_cdr(database_name, table_names, conn)
        elif(type == 'tower'):
            summary = calc_summary_tdr(database_name, table_names, conn)
    except Exception as e:
        print(e)
    finally:
        return summary