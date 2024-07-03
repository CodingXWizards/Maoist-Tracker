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
        cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
        rows = cursor.fetchall()
        table_names = [row[0] for row in rows]
        for table in table_names:
            if(table_name in table):
                table_name = table;
        
        columns_mapping = {
            'one': 'CdrNo',
            'two': "A Type",
            'three': 'B Party',
            'four': 'Date',
            'five': 'Time',
            'six': 'Duration',
            'f2': 'Call Type',
            'eight': 'First Cell ID',
            'nine': 'Last Cell ID',
            'ten': 'IMEI',
            'eleven': 'IMSI',
            'f3': 'Roaming',
            'f4': 'LRN',
            'twelve': 'Circle',
            'fourteen': 'Crime',
            'thirteen': 'Operator',
            'fifteen': 'Default'
        }
        # Fetches data from the query
        selected_columns = ", ".join(columns_mapping.keys())
        query = f"SELECT {selected_columns} FROM [{table_name}]"

        cursor.execute(query)
        column_names = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        
        for row in rows:
            # Create a dictionary for the current row
            row_data = {}
            for i, value in enumerate(row):
                # Use column name as key and value as data
                row_data[column_names[i]] = value
            result.append(row_data)

        # Rename columns if a mapping is provided
        if columns_mapping:
            for i, row in enumerate(result):
                for old_column, new_column in columns_mapping.items():
                    if old_column in row:
                        row[new_column] = row.pop(old_column)
    except Exception as e:
        print(e)
    finally:
        return result
