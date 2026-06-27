import sqlite3
import json
from datetime import datetime
import os

if os.environ.get("VERCEL"):
    DB_FILE = "/tmp/farm_memory.db"
else:
    # DB will be created in the backend folder
    DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "farm_memory.db")

def get_connection():
    return sqlite3.connect(DB_FILE)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS farm_queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT,
            analysis TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

def save_query(query: str, analysis: dict):
    conn = get_connection()
    cursor = conn.cursor()
    timestamp = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO farm_queries (query, analysis, timestamp)
        VALUES (?, ?, ?)
    """, (query, json.dumps(analysis), timestamp))
    conn.commit()
    conn.close()

def get_history(limit: int = 20) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT query, analysis, timestamp 
        FROM farm_queries 
        ORDER BY timestamp DESC 
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        result.append({
            "query": row[0],
            "analysis": json.loads(row[1]),
            "timestamp": row[2]
        })
    return result

def get_dashboard_summary() -> dict:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM farm_queries")
    total_queries = cursor.fetchone()[0]
    
    cursor.execute("SELECT query, analysis FROM farm_queries ORDER BY timestamp DESC LIMIT 1")
    last_record = cursor.fetchone()
    
    last_query = None
    last_issue = None
    if last_record:
        last_query = last_record[0]
        try:
            analysis_dict = json.loads(last_record[1])
            last_issue = analysis_dict.get("issue", "Unknown")
        except:
            last_issue = "Unknown"
            
    cursor.execute("SELECT query, timestamp FROM farm_queries ORDER BY timestamp DESC LIMIT 5")
    recent_activity = [{"query": r[0], "timestamp": r[1]} for r in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_queries": total_queries,
        "last_query": last_query or "No queries yet",
        "last_issue": last_issue or "No issues recorded",
        "recent_activity": recent_activity
    }
