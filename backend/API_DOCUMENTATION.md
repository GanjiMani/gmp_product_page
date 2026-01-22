# GMP Dashboard API Documentation

## Base URL
```
http://localhost:8000
```

## Endpoints

### 1. Get Total Observations
**GET** `/api/total-observations`

Returns the total observations count from the database.

**Response:**
```json
{
    "id": 1,
    "name": "total_observations",
    "total": 269054
}
```

**Example:**
```bash
curl http://localhost:8000/api/total-observations
```

---

### 2. Get Total Cites Inspected
**GET** `/api/total-citesinspected`

Returns the total cites inspected count from the database.

**Response:**
```json
{
    "id": 2,
    "name": "total_citesinspected",
    "total": 115715
}
```

**Example:**
```bash
curl http://localhost:8000/api/total-citesinspected
```

---

### 3. Get All Counts (Bonus)
**GET** `/api/all-counts`

Returns all count records from the database.

**Response:**
```json
[
    {
        "id": 1,
        "name": "total_observations",
        "total": 269054
    },
    {
        "id": 2,
        "name": "total_citesinspected",
        "total": 115715
    },
    {
        "id": 3,
        "name": "drugs",
        "total": 39733
    },
    ...
]
```

**Example:**
```bash
curl http://localhost:8000/api/all-counts
```

---

## Running the Server

### Option 1: Using run_server.py
```bash
cd backend
python run_server.py
```

### Option 2: Using uvicorn directly
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Using FastAPI CLI
```bash
cd backend
fastapi dev main.py
```

## Testing

Once the server is running, you can:
1. Visit http://localhost:8000/docs for interactive API documentation
2. Visit http://localhost:8000/redoc for alternative documentation
3. Test endpoints using curl or Postman

## Frontend Integration

In your React frontend, you can call these endpoints like:

```javascript
// Fetch total observations
const response = await fetch('http://localhost:8000/api/total-observations');
const data = await response.json();
console.log(data); // { id: 1, name: "total_observations", total: 269054 }

// Fetch total cites inspected
const response2 = await fetch('http://localhost:8000/api/total-citesinspected');
const data2 = await response.json();
console.log(data2); // { id: 2, name: "total_citesinspected", total: 115715 }
```
