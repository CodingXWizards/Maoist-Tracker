from connection import get_db_instance

cursor = get_db_instance().cursor()

def fetch_databases():
    database_names = []
    try:
        cursor.execute("SELECT name FROM sys.databases WHERE database_id > 4 ORDER BY name")
        rows = cursor.fetchall();
        database_names = [row[0] for row in rows]
    except Exception as e:
        print(e)
    finally:
        return database_names

def fetch_table_names(database_name):
    table_names = []
    try:
        cursor.execute(f"USE [{database_name}]")
        cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
        rows = cursor.fetchall()
        table_names = [row[0] for row in rows]
    except Exception as e:
        print(e)
    finally:
        return table_names

def fetch_table_data(database_name, table_name):
    result = []
    try:
        cursor.execute(f"USE [{database_name}]")
        cursor.execute(f"SELECT * FROM [{table_name}]")
        headers = [column[0] for column in cursor.description]  # Get column names (headers)

        # Fetches data from the query
        data = cursor.fetchall()  
        for row in data:
            # Combines headers with corresponding data
            record = dict(zip(headers, row))  
            result.append(record)
    except Exception as e:
        print(e)
    finally:
        return result
