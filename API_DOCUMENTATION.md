# 📖 API Documentation

This document covers all backend API endpoints configured in the application router.

---

## 🧠 AI endpoints (`/api/ai/*`)

### 1. AI Chat
- **Endpoint**: `POST /api/ai/chat`
- **Description**: Handles multilingual chat questions.
- **Payload**:
  ```json
  {
    "message": "Where is Gate B?",
    "language": "en",
    "stadiumId": "metlife",
    "module": "chat"
  }
  ```

### 2. AI Wayfinder Navigation
- **Endpoint**: `POST /api/ai/navigate`
- **Description**: Explains steps between points in a stadium.
- **Payload**:
  ```json
  {
    "from": "Parking Lot J",
    "to": "Section 112",
    "stadiumId": "metlife"
  }
  ```

### 3. AI Translation
- **Endpoint**: `POST /api/ai/translate`
- **Description**: Translates phrases for volunteers or fans.

---

## 🏟️ Venue Operations (`/api/*`)

### 1. Get Stadium List
- **Endpoint**: `GET /api/stadiums`
- **Response**: List of all 16 stadiums.

### 2. Get Incidents List
- **Endpoint**: `GET /api/incidents?stadiumId=metlife`
- **Response**: List of active incidents in MetLife stadium.

### 3. Report Incident
- **Endpoint**: `POST /api/incidents`
- **Payload**:
  ```json
  {
    "stadiumId": "metlife",
    "category": "medical",
    "severity": "medium",
    "title": "Dehydration at Section 100",
    "description": "Fan needs water and basic medical support.",
    "location": {
      "zoneId": "metlife-lower-100",
      "zoneName": "Lower bowl"
    },
    "reportedBy": {
      "name": "Alex",
      "role": "staff"
    }
  }
  ```
