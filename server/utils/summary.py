import pandas as pd
import re

def is_message(call_type):
    return call_type in ['SMS_IN', 'SMS_OUT', 'DSM-SMS']

def is_call(call_type):
    return call_type in ['CALL_IN', 'CALL_OUT', 'v_out_vw', 'v_out_wifi', 'v_in_wifi', 'v_in_vw', 'v_in_wv', 'v_out_wv', 'v_frw', 'CALL_FORWARD']

def is_non_company_number(number):
    return len(number) == 10 and not any(char.isalpha() for char in number)

def calc_summary_tdr(database_name, table_names, conn):
    def is_p2p(number):
        return bool(re.match(r'^\d{10,}$', str(number)))

    # Initialize an empty DataFrame to store all data
    all_data = pd.DataFrame()
    for table_name in table_names:
        query = f"SELECT * FROM [{database_name}].[dbo].[{table_name}]"
        columns_mapping = {
            'one': 'TdrNo',
            'two': "A Party",
            'three': 'B Party',
            'four': 'Date',
            'five': 'Time',
            'six': 'Duration',
            'f1': 'Call Type',
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

        df = pd.read_sql(query, conn)
        print(table_name+"Concat Done")
        for old_column, new_column in columns_mapping.items():
            df.rename(columns={old_column: new_column}, inplace=True)
        all_data = pd.concat([all_data, df], ignore_index=True)

    # Get unique A Party values
    unique_a_parties = all_data['A Party'].unique()

    # Initialize a list to store the results
    results = []

    # For each unique A Party, calculate all required metrics
    for a_party in unique_a_parties:
        a_party_data = all_data[all_data['A Party'] == a_party]
        
        result = {
            'A Party': a_party,
            'Count of Unique TdrNo': a_party_data['TdrNo'].nunique(),
            'Total Entries in tdr': len(a_party_data),
            'Out_Call': len(a_party_data[a_party_data['Call Type'] == 'CALL_OUT']),
            'Incoming Call': len(a_party_data[a_party_data['Call Type'] == 'CALL_IN']),
            'Outgoing SMS': len(a_party_data[a_party_data['Call Type'] == 'SMS_OUT']),
            'Incoming SMS': len(a_party_data[a_party_data['Call Type'] == 'SMS_IN']),
            'Days': a_party_data['Date'].nunique(),
            'P2P Conversation': a_party_data['B Party'].apply(is_p2p).sum()
        }
        
        result['P2P Conversation Percentage'] = (result['P2P Conversation'] / result['Total Entries in tdr']) * 100 if result['Total Entries in tdr'] > 0 else 0
        
        results.append(result)

    # Create a DataFrame from the results
    result_df = pd.DataFrame(results)

    # Sort the DataFrame by 'Count of Unique TdrNo' in descending order
    result_df = result_df.sort_values('Count of Unique TdrNo', ascending=False)
    result_df = result_df.astype(object).where(pd.notnull(result_df), None)
    return result_df
    # # Write the results to TdrSummary.xlsx
    # output_file = 'TdrSummary.xlsx'
    # result_df.to_excel(output_file, index=False)

    # print(f"Results have been written to {output_file}")

def calc_summary_cdr(database_name, table_names, conn):
    # Define incoming message types
    incoming_messages = ['SMS_IN', 'A2P_SMSIN', 'P2P_SMSIN', 'A2P_SMSIN_wifi', 'P2P_SMSIN_wifi']

    # Initialize an empty DataFrame to store all data
    all_data = pd.DataFrame()
    for table_name in table_names:
        query = f"SELECT * FROM [{database_name}].[dbo].[{table_name}]"
        columns_mapping = {
            'one': 'CdrNo',
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
            'thirteen': 'Operator'
        }
        df = pd.read_sql(query, conn)
        print(table_name+"Concat Done")
        for old_column, new_column in columns_mapping.items():
            df.rename(columns={old_column: new_column}, inplace=True)
        all_data = pd.concat([all_data, df], ignore_index=True)
    
    # Convert date and time columns to datetime objects
    all_data['Date'] = pd.to_datetime(all_data['Date'], format='%d/%m/%Y')
    all_data['Time'] = pd.to_timedelta(all_data['Time'])

    # Sort data by CdrNo, Date, and Time
    all_data = all_data.sort_values(by=['CdrNo', 'Date', 'Time'])
    
    # Create a CDR-level aggregation
    cdr_metrics = []
    table_i = 1
    for cdr_no, cdr_data in all_data.groupby('CdrNo'):
        total_messages = cdr_data['Call Type'].apply(is_message).sum()
        total_calls = cdr_data['Call Type'].apply(is_call).sum()

        messages_percentage = (total_messages / (total_messages + total_calls)) * 100 if (total_messages + total_calls) > 0 else 0
        calls_percentage = (total_calls / (total_messages + total_calls)) * 100 if (total_messages + total_calls) > 0 else 0

        non_company_incoming_messages = cdr_data[(cdr_data['Call Type'] == 'SMS_IN') & (cdr_data['B Party'].apply(is_non_company_number))]
        non_company_incoming_messages_percentage = (len(non_company_incoming_messages) / total_messages) * 100 if total_messages > 0 else 0

        non_company_outgoing_messages = cdr_data[(cdr_data['Call Type'] == 'SMS_OUT') & (cdr_data['B Party'].apply(is_non_company_number))]
        incomingmessagesp= (len(non_company_incoming_messages)/(len(non_company_incoming_messages)+len(non_company_outgoing_messages))) * 100 if (len(non_company_incoming_messages)+len(non_company_outgoing_messages)) > 0 else 0

        non_company_incoming_calls = cdr_data[(cdr_data['Call Type'] == 'CALL_IN') & (cdr_data['B Party'].apply(is_non_company_number))]
        non_company_incoming_calls_percentage = (len(non_company_incoming_messages) / total_calls) * 100 if total_calls > 0 else 0

        non_company_outgoing_calls = cdr_data[(cdr_data['Call Type'] == 'CALL_OUT') & (cdr_data['B Party'].apply(is_non_company_number))]
        incomingcallsp= (len(non_company_incoming_calls)/(len(non_company_incoming_calls)+len(non_company_outgoing_calls))) * 100 if (len(non_company_incoming_calls)+len(non_company_outgoing_calls)) > 0 else 0

        non_company_calls = cdr_data[cdr_data['B Party'].apply(is_non_company_number) & cdr_data['Call Type'].isin(['CALL_IN', 'CALL_OUT','SMS_OUT','SMS_IN'])]
        non_company_contact_counts = non_company_calls['B Party'].value_counts()
        total_non_company_calls = non_company_contact_counts.sum()

        most_contacted_numbers = []
        cumulative_calls = 0
        countnumbers = 0
        for number, count in non_company_contact_counts.items():
            percentage = (count / total_non_company_calls) * 100
            most_contacted_numbers.append(f"{number} ({percentage:.2f}%)")
            cumulative_calls += count
            countnumbers += 1
            if cumulative_calls / total_non_company_calls >= 0.8:
                break
            
        conversations_percentage = (cumulative_calls / len(non_company_calls)) * 100 if len(non_company_calls) > 0 else 0

        no_outgoing_calls = cdr_data[~cdr_data['Call Type'].isin(['CALL_OUT'])]
        no_outgoing_calls_incoming_messages = len(no_outgoing_calls[no_outgoing_calls['Call Type'].isin(incoming_messages)]) > 0

        non_company_calls_more_than_10 = non_company_contact_counts[non_company_contact_counts > 10]
        more_than_10_calls_distinct_contacts = len(non_company_calls_more_than_10.index) < 10 if not non_company_calls_more_than_10.empty else True

        date_range = pd.date_range(start=cdr_data['Date'].min(), end=cdr_data['Date'].max(), freq='D')
        present_dates = cdr_data['Date'].dt.date.unique()
        off_days = len([date for date in date_range.date if date not in present_dates])
        total_days = (cdr_data['Date'].max() - cdr_data['Date'].min()).days + 1
        off_days_percentage = (off_days / total_days) * 100 if total_days > 0 else 0

        distinct_cell_ids = cdr_data['First Cell ID'].nunique()

        distinct_imei_count = cdr_data['IMEI'].nunique()

        # New Counters for P2P in SMS by IN SMS
        total_incoming_sms = len(cdr_data[cdr_data['Call Type'] == 'SMS_IN'])
        p2p_sms_in = len(cdr_data[(cdr_data['Call Type'] == 'SMS_IN') & (cdr_data['B Party'].apply(is_non_company_number))])
        p2psmsinpercent = (p2p_sms_in / total_incoming_sms) * 100 if total_incoming_sms > 0 else 0

        # Missed Call Alerts Counter
        missed_call_alerts = 0
        window = []

        for i in range(len(cdr_data)):
            if cdr_data.iloc[i]['Call Type'] == 'SMS_IN':
                current_time = cdr_data.iloc[i]['Time']
                current_date = cdr_data.iloc[i]['Date']
                current_b_party = cdr_data.iloc[i]['B Party']

                # Remove old entries from the window
                window = [(time, date, b_party) for time, date, b_party in window if (current_time - time).total_seconds() / 60 <= 2 and current_date == date]

                # Add current entry to the window
                window.append((current_time, current_date, current_b_party))

                # Check if there are more than two unique B Party numbers in the window
                unique_b_parties = len(set([b_party for _, _, b_party in window]))
                if unique_b_parties > 2:
                    missed_call_alerts += 1
        cdr_metrics.append({
            'CdrNo': int(cdr_no),  # Ensure numpy.int64 is converted to int
            'Total Messages': int(total_messages),
            'Total Calls': int(total_calls),
            'Messages Percentage': float(messages_percentage),
            'Calls Percentage': float(calls_percentage),
            'Company Incoming Messages Percentage': float(100 - non_company_incoming_messages_percentage),
            'Most Contacted Numbers': ', '.join(most_contacted_numbers),
            'COUNT for 80 cumulative calls': int(countnumbers),
            'No Outgoing Calls Incoming Messages': no_outgoing_calls_incoming_messages,
            'More than 10 Calls to Less than 10 Distinct Numbers': more_than_10_calls_distinct_contacts,
            'Off Days Percentage': float(off_days_percentage),
            'Distinct Cell ID Count': int(distinct_cell_ids),
            'Distinct IMEI': int(distinct_imei_count),
            'Incoming Sms Percentage P2P by all P2P conversation': float(incomingmessagesp),
            'Incoming Calls Percentage P2P by all P2P conversation': float(incomingcallsp),
            'Distinct P2P messages percentage': float(p2psmsinpercent),
            'Percentage for 80 cumulative calls conversation': float(conversations_percentage),
            'Missed Call Alerts': int(missed_call_alerts)
        })
        print(f"Table {table_i} Done")
        table_i+=1

    # return cdr_metrics
    return cdr_metrics