## Project Overview
This project is a back end for the EventosTech application, based on a [video](https://www.youtube.com/watch?v=d0KaNzAMVO4) by Fernanda Kipper, where she develops a solution in Java. I decided to redo this project using NestJS and add some extra features, such as user authentication.

## Technologies Used
- NestJS: A framework for Node.js that helps build efficient and scalable server-side applications.
- Docker: Used to create isolated containers for the application, ensuring a consistent and easy-to-manage environment.
- Docker Compose: A tool for defining and managing multi-container Docker applications, simplifying the configuration and execution of the application's services.
- MySQL: Relational database used for storing application data.
- Prisma: An ORM (Object-Relational Mapping) tool for database access, providing type-safe database queries.
- JWT (JSON Web Token): Used for secure user authentication and authorization.
- bcryptjs: A library for hashing passwords to enhance security.
- Yup: A schema builder for runtime value parsing and validation.

## Getting Started
To get started with this application, follow these steps:

1. Make sure you have Docker and Docker Compose installed on your machine.
2. Clone the repository: `git clone https://github.com/lidiagaldino/eventostec-challenge.git`
3. Navigate to the project directory: `cd eventostec-challenge`
4. Install the required dependencies: `npm install`
4. Run `docker compose up`
5. Run `docker compose exec app bash`
6. Run `npx prisma migrate dev`
7. Run `npm run start`
8. Access the application at http://localhost:3000.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

