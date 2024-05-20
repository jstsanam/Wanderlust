# Wanderlust

## Local Setup

### Prerequisites
- Node.js installed on your machine
- MongoDB installed and running locally or accessible MongoDB URI

### Environment Variables
| Variable Name        | Description                                      | Example Value         |
|----------------------|--------------------------------------------------|-----------------------|
| DATABASE_URL         | URL of the database server                       |mongodb://127.0.0.1:27017/wanderlust |
| REINITIATE_DB        | Boolean for reinitiate DB with predefined values |true                   |
| SESSION_SECRET_CODE  | Secret code for session                          |"abcd"                 |
| CLOUDINARY_NAME      | Name of Cloudinary cloud storage                 |"abcd"                 |
| CLOUDINARY_API_KEY   | API key of Cloudinary cloud storage              |"abcd1234"             |
| CLOUDINARY_API_SECRET| API Secret for Cloudinary cloud storage          |"abcd1234"             |