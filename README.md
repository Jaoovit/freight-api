<p>&nbsp;</p>
<h1 align="center">🚚 Freight API</h1>
<p>&nbsp;</p>

## 📖 Description

A RESTful API for freight management, built with Node.js and Prisma ORM. This API provides tools for managing shipments, calculating transporter fee, handling delivery logistics.

## 💡 Features

- **User Authentication**: Register, login,  and manage sessions.
- **User Information handler**: Update user informations.
- **Car Management**: Create, update, delete, and view cars.
- **Delivery Logistics**: Plan, post, and handle delivery costs.
- **Database Integration**: Built using Prisma ORM for database management.

## 🔨 Tools

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Framework for building the API.
- **PostgreSQL**: Relational database for data persistence.
- **Prisma**: ORM for database schema and queries.

## 📍 Routes

### Session

- **POST**

    - **/session/login**: Log in to an existing account.

    - **/session/logout**: Log out from the session.

### User

- **GET**

    - **/user/transporter**: Retrieve details of a user with the role of transporter.

    - **/user/:id**: Retrieve user details by user id.

    - **/user/transporter/search/search?query=${query}**: Retrive user by location using query params.

    - **/user/transporter/:carId**: Retrive transporter information by car id.

- **POST**

    - **/user/transporter/register**: Register an user with the role of transporter.

    - **/user/operator/register**: Register an user with the role of operator.

    - **/user/supervisor/register**: Register an user with the role of supervisor.

    - **/user/manager/register**: Register an user with the role of manager.

    - **/user/:id/car**: Register a car by user id.

    - **/user/forgot_password**: Send a email with a token to recover password.

- **PUT**

    - **/user/:id/location**: Update user location details.

    - **/user/:id/workdays**: Update user workdays.

    - **/user/:id/phone**: Update user phone number.

    - **/user/:id/profileImage**: Update user profile image.

    - **/user/password**: Update user password using token.

### Car

- **GET**

    - **/car/:id**: Retrieve details of a car.

    - **/car/user/:id**: Retrive car by user id.

- **POST**

    - **/car/:id/delivery**: Register a delivery by car id.

- **PUT**

    - **/car/:id**: Update car details by car id.

- **DELETE**

    - **/car/:id**: Delete car by car id.


### Delivery

- **GET**

    - **/delivery**: Return all deliveries.

    - **/delivery/unpaid**: Retrive unpaid deliveries. 
    
    - **/delivery/undelivered**: REtrive undelivered deliveries.

- **PUT**

    - **/delivery/:id**: Change the delivery status to paid.

## ⚙️ Setup

### Prerequisites

Before starting, ensure you have the following installed:

 - Node.js: For running the server and managing dependencies.

 - PostgreSQL: The relational database used for data persistence.

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Jaoovit/freight-api.git
   
   cd freight-api
2. **Prepare environment variables:**

    - Rename the .env_template file to .env.

    - Define the following variables in the .env file:

        - DATABASE_URL: Connection string for PostgreSQL.
        - PORT: Port on which the application will run.
        - SECRET: Secret key for session management.
        - JWT_SECRET: Secret key for generating JSON Web Tokens.

3. **Set up Cloudinary for file management:**

    - Create an account on Cloudinary.

    - Add the following Cloudinary-related environment variables:

        - CLOUDINARY_CLOUD_NAME
        - CLOUDINARY_API_KEY
        - CLOUDINARY_API_SECRET

4. **Configure CORS:**

    - Add your frontend application URL to the environment variable:

        - PRODUCTION_URL: Base URL of the frontend allowed to access the API.

5. **Configure email services with Mailtrap:**

    - Create an account on Mailtrap.

    - Add the following Mailtrap-related variables:

        - NODEMAILER_HOST
        - NODEMAILER_PORT
        - NODEMAILER_USER
        - NODEMAILER_PASSWORD

6. **Password recovery setup:**

    - Define the following variables for password recovery emails:

        - NODEMAILER_EMAIL_PROVIDER: The recipient email for sending emails.
        - EMAIL_TITLE_UPDATE_PASSWORD: Subject of the recovery email.
        - EMAIL_TEXT_UPDATE_PASSWORD: Body text for the recovery email.

7. **Admin account setup:**

    - Choose a secret for creating an admin account:

        - ADMIN_SECRET: Secret used for creating the admin account.

    - Configure the first manager account informations:

        - INITIAL_MANAGER_USERNAME=
        - INITIAL_MANAGER_PASSWORD=
        - INITIAL_MANAGER_EMAIL=
        - INITIAL_MANAGER_FIRST_NAME=
        - INITIAL_MANAGER_LAST_NAME=
        - INITIAL_MANAGER_TAX_DOCUMENT=
        - INITIAL_MANAGER_PHONE=


## 🏃‍➡️ Start

- **Run commands:**

    ```bash
    npm install

    npx prisma migrate dev --name init

    node scripts/initManager.js manager

    npm run start