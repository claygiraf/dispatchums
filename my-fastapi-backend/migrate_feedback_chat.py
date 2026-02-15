"""
Migration script to add feedback chat tables
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dispatchums.db")
engine = create_engine(DATABASE_URL)

def migrate():
    """Add feedback conversation and message tables"""
    
    with engine.connect() as conn:
        # Create feedback_conversations table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS feedback_conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                case_number VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """))
        
        # Create index on case_number for faster lookups
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_case_number ON feedback_conversations(case_number)
            """))
        except:
            pass
        
        # Create feedback_messages table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS feedback_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                sender_id INTEGER NOT NULL,
                sender_name VARCHAR(100) NOT NULL,
                sender_role VARCHAR(20) NOT NULL,
                message TEXT NOT NULL,
                photo_url VARCHAR(500),
                is_read BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES feedback_conversations(id),
                FOREIGN KEY (sender_id) REFERENCES users(id)
            )
        """))
        
        conn.commit()
        print("✅ Feedback chat tables created successfully!")

if __name__ == "__main__":
    migrate()
