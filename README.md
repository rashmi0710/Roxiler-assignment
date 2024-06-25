# MERN Stack Coding Challenge
![Image Description](https://example.com/path/to/your/image.png)
## Overview

This project is a MERN stack application that fetches transaction data from a third-party API, seeds a MongoDB database, and provides various endpoints to interact with the data. The frontend displays the transactions, statistics, and charts based on the selected month.

## Backend Setup

### Prerequisites

- Node.js
- MongoDB
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mern-stack-coding-challenge.git
    cd mern-stack-coding-challenge
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up MongoDB:**

    Make sure MongoDB is running on your machine. By default, it will connect to `mongodb://localhost:27017/transactionsDB`.

4. **Seed the database:**

    This script fetches data from the third-party API and seeds the MongoDB database.

    ```bash
    node seed.js
    ```

5. **Start the server:**

    ```bash
    npm start
    ```

    The server will run on `http://localhost:3000`.

### API Endpoints

- **Initialize Database:**

  ```bash
  GET /seedDatabase
