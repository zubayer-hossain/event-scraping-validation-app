# Event Scraping Validation App

The "Event Scraping Validation App" is a dynamic web application developed to automate the extraction and validation of event-related data from specified websites. Leveraging Laravel's robust framework, the app is designed to periodically scrape event listings from various online sources, capturing essential details such as event names, dates, descriptions, and links. The data collected is then processed and stored in a structured format, allowing for easy access and analysis.
## Requirements

- PHP 8.2 or higher
- Laravel 11
- Composer
- MySQL
- Node.js

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/zubayer-hossain/event-scraping-validation-app.git
   ```
   ```bash
   cd event-scraping-validation-app
    ```


2. **Install Dependencies**

   ```bash
   composer install
   npm install
   ```


3. **Environment Configuration**
   Copy the example environment file and make the necessary configuration changes in the `.env` file.

   ```bash
   cp .env.example .env
   ```
   Update these settings in the `.env` file to match your local environment:
- `DB_USERNAME` (your database username)
- `DB_PASSWORD` (your database password)

4. **Generate App Key**

   ```bash
   php artisan key:generate
   ```

5. **Create the Database and Run Migrations and Seeders**
   
   Create a new database in your database management system named `event_scraping_app`, and ensure that the database connection settings in `.env` are correct.
   ```bash
    php artisan migrate --seed
    ```
    It will create the necessary tables and seed the database with `author` role and 5 users with `client`
 role and also will generate 3 events for testing purposes.


6. **Build Frontend Assets**

   ```bash
    npm run build
    ```


7. **Running the Application**
   Start the local development server:

   ```bash
    php artisan serve
    ```
   You can now access the server at http://localhost:8000.


8. **Queue Configuration**
   Ensure that your queue driver is set up correctly in the .env file:
    ```bash
    QUEUE_CONNECTION=database
    ```
   To process jobs, you must run the queue worker:
    ```bash
    php artisan queue:work
    ```

## Running the Application

Navigate to http://localhost:8000 in your web browser to view the application. If everything is set up correctly, you should see your Laravel application running.
