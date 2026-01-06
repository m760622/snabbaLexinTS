import json
import csv
import sys

def convert_json_to_csv():
    json_path = 'public/data/data.json'
    csv_path = 'public/data/data.csv'

    print(f"Reading {json_path}...")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_path} not found.")
        return

    print(f"Converting {len(data)} entries to CSV...")

    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        # We don't need a header row because our app processes arrays by index
        # But standard CSV usually has headers. 
        # However, to keep parsing extremely fast and simple in JS, 
        # avoiding headers or just skipping the first line is fine.
        # Given the app expects raw arrays, let's keep it headerless or simple.
        # Let's verify if the app needs keys. 
        # The current app uses array indices (data[0], data[1]...), so no keys needed.
        
        writer.writerows(data)

    print(f"Success! Saved to {csv_path}")

if __name__ == "__main__":
    convert_json_to_csv()
