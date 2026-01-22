"""Create .env file with database credentials"""
env_content = """DB_SERVER=ss-ai-dev-ci-001.database.windows.net
DB_NAME=db-ai-dev-ci-001
DB_USER=dbo.admin
DB_PASSWORD=AIdevsql!@#456
"""

with open('.env', 'w', encoding='utf-8') as f:
    f.write(env_content)

print("SUCCESS: .env file created successfully!")
