1. Run MySQL server:
    ```
    run mysql server
    ```
2. Create a database named `safty_dashboard`:
    ```
    create database safty_dashboard
    ```
3. Change the password:
    ```
    mysql://root:'your pass here'@localhost:3306/safty_dashboard
    ```
4. Reset Prisma migrations and run:
    ```
    npx prisma migrate dev --name init
    ```
5. Start the development server:
    ```
    npm run dev
    ```
