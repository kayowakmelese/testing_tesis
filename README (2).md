<p align="center">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" align="center" width="30%">
</p>
<p align="center"><h1 align="center">TESTING_TESIS.GIT</h1></p>
<p align="center">
	<em>Unlock Seamless Testing with testing_tesis.git: Code, Build, Test, Repeat!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/kayowakmelese/testing_tesis.git?style=default&logo=opensourceinitiative&logoColor=white&color=7016d6" alt="license">
	<img src="https://img.shields.io/github/last-commit/kayowakmelese/testing_tesis.git?style=default&logo=git&logoColor=white&color=7016d6" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/kayowakmelese/testing_tesis.git?style=default&color=7016d6" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/kayowakmelese/testing_tesis.git?style=default&color=7016d6" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

---

##  Overview

**testingtesis.git Project Overview:

**Problem:** testingtesis.git streamlines testing and deployment processes for a gaming application by ensuring consistent code formatting, seamless networking, and reliable dependency management.

**Features:** Automates code formatting with Prettier, sets up PostgreSQL and Redis services in Docker, manages package dependencies with pnpm-lock.yaml, and enforces best practices with ESLint.

**Audience:** Developers working on gaming applications seeking efficient testing, deployment, and code quality assurance.

---

##  Features

|      | Feature         | Summary       |
| :--- | :---:           | :---          |
| ⚙️  | **Architecture**  | <ul><li>Dependencies: docker, npm, jest-e2e.json, typescript, javascript</li><li>Documentation: primary_language='TypeScript', language_counts={'yml': 1, 'yaml': 2, 'json': 8, 'mjs': 3, 'ts': 68, 'prisma': 1, 'toml': 1, 'sql': 15, 'tsx': 51, 'css': 1}</li><li>Install Commands: npm install, docker build -t kayowakmelese/testing_tesis.git .</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>File Contents: makefile for code formatting with Prettier, README for project setup instructions, docker-compose.yml for defining services, backend_app/pnpm-lock.yaml for package management</li></ul> |
| 📄 | **Documentation** | <ul><li>Package Managers: npm</li><li>Containers: docker</li><li>Usage Commands: npm start, docker run -it {image_name}</li></ul> |
| 🔌 | **Integrations**  | <ul><li>Containers: docker for running PostgreSQL and Redis services</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Components: components.json</li><li>File Contents: makefile for backend_app, docker-compose.yml for service configurations</li></ul> |
| 🧪 | **Testing**       | <ul><li>Test Commands: npm test</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Optimizations: Cloudflared for frontend tunneling</li></ul> |
| 🛡️ | **Security**      | <ul><li>Secure Networking: Docker for service isolation and data persistence</li></ul> |
| 📦 | **Dependencies**  | <ul><li>Dependencies: docker, npm, jest-e2e.json, typescript, javascript, sql, prisma, postgres, redis</li></ul> |

---

##  Project Structure

```sh
└── testing_tesis.git/
    ├── backend_app
    │   ├── .gitignore
    │   ├── .prettierrc
    │   ├── README.md
    │   ├── eslint.config.mjs
    │   ├── nest-cli.json
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── prisma
    │   ├── src
    │   ├── test
    │   ├── tsconfig.build.json
    │   └── tsconfig.json
    ├── docker-compose.yml
    ├── frontend_app
    │   ├── .gitignore
    │   ├── README.md
    │   ├── app
    │   ├── components
    │   ├── components.json
    │   ├── config
    │   ├── constants
    │   ├── contexts
    │   ├── eslint.config.mjs
    │   ├── events
    │   ├── hooks
    │   ├── lib
    │   ├── middleware.ts
    │   ├── next.config.ts
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── postcss.config.mjs
    │   ├── public
    │   ├── server_actions
    │   ├── stores
    │   ├── tsconfig.json
    │   ├── types
    │   └── utils
    ├── makefile
    └── readME
```


###  Project Index
<details open>
	<summary><b><code>TESTING_TESIS.GIT/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/makefile'>makefile</a></b></td>
				<td>Enables formatting code with Prettier in the backend_app directory and tunneling the frontend via cloudflared.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/readME'>readME</a></b></td>
				<td>- Start the project by running 'docker compose up -d' from the project root to set up the entire codebase architecture<br>- This action initializes the necessary services and dependencies defined in the docker-compose.yml file.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/docker-compose.yml'>docker-compose.yml</a></b></td>
				<td>Facilitates running PostgreSQL and Redis services with specific configurations in a Docker environment, ensuring seamless networking and data persistence for the gaming application.</td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- backend_app Submodule -->
		<summary><b>backend_app</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/pnpm-lock.yaml'>pnpm-lock.yaml</a></b></td>
				<td>- The `pnpm-lock.yaml` file in the `backend_app` directory manages package dependencies for the project<br>- It specifies the lockfile version and settings for auto-installing peer dependencies<br>- Additionally, it lists the dependencies for the project, including the version of '@nestjs/common' and its related packages<br>- This file ensures consistent and reliable dependency resolution for the project's backend application.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/tsconfig.json'>tsconfig.json</a></b></td>
				<td>Optimize TypeScript compiler options for the backend application to ensure efficient transpilation and enhanced type safety.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/eslint.config.mjs'>eslint.config.mjs</a></b></td>
				<td>- Defines ESLint configuration for TypeScript, integrating recommended rules and Prettier plugin<br>- Includes custom rules for TypeScript, setting up globals for Node.js and Jest, and specifying parser options<br>- Improves code quality by enforcing best practices and catching potential issues early in the development process.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/tsconfig.build.json'>tsconfig.build.json</a></b></td>
				<td>Enhances project build configuration by extending the base TypeScript configuration and excluding unnecessary files for building the backend application.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/nest-cli.json'>nest-cli.json</a></b></td>
				<td>Defines project structure and compiler options for a Nest.js application using the provided JSON configuration file.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/package.json'>package.json</a></b></td>
				<td>- Define project build, formatting, testing, linting, and start scripts for a Nest.js backend application<br>- Dependencies include Nest.js modules, Prisma, Redis, and Socket.IO for robust API development<br>- Dev dependencies encompass testing tools like Jest and ESLint for maintaining code quality<br>- The Jest configuration ensures comprehensive test coverage for Node.js environments.</td>
			</tr>
			</table>
			<details>
				<summary><b>src</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/app.controller.ts'>app.controller.ts</a></b></td>
						<td>Handles HTTP requests by connecting the app service to provide a greeting message.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/app.module.ts'>app.module.ts</a></b></td>
						<td>- Manages the application's modules, services, controllers, filters, and pipes<br>- Integrates various modules like configuration, authentication, database, shared utilities, and game-specific functionalities<br>- Handles validation errors and exceptions using custom filters and pipes for enhanced error handling<br>- Also includes WebSocket gateway for real-time communication.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/app.service.ts'>app.service.ts</a></b></td>
						<td>- The AppService retrieves the DATABASE_URL from the environment service<br>- This service is essential for obtaining configuration values for the application.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/main.ts'>main.ts</a></b></td>
						<td>- Initiates the backend server for a Telegram-based gaming platform<br>- Handles WebSocket connections, sets up Swagger API documentation, and configures AsyncAPI for real-time interactions<br>- Enables seamless communication between clients and the server while providing clear API documentation.</td>
					</tr>
					</table>
					<details>
						<summary><b>types</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/types/index.ts'>index.ts</a></b></td>
								<td>Defines essential types for user authentication and player presence status within the backend application, ensuring accurate user identification and real-time player status tracking.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>shared</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/shared/shared.module.ts'>shared.module.ts</a></b></td>
								<td>Exports a global module for sharing PresenceService across the codebase, enhancing reusability and encapsulation.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/shared/redis-io.adapter.ts'>redis-io.adapter.ts</a></b></td>
								<td>- Implements Redis-based IO adapter for NestJS Socket.IO server, enabling real-time communication<br>- Handles Redis client connection and creates a Socket.IO server with custom middleware for authentication<br>- Adaptable namespaces for different game scenarios.</td>
							</tr>
							</table>
							<details>
								<summary><b>presence</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/shared/presence/presence.service.ts'>presence.service.ts</a></b></td>
										<td>- Manages player presence data in Redis by updating, removing, and fetching player presence information<br>- Implements methods to update, remove, and retrieve player presence data with Redis storage, ensuring a 1-hour time-to-live (TTL) for the presence key.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>socket</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/shared/socket/utils.ts'>utils.ts</a></b></td>
										<td>- Define a reusable function for socket responses, encapsulating a message and associated data<br>- This function enhances codebase modularity and readability by providing a consistent structure for communication across the backend application.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>pipes</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/shared/pipes/zod-validation.pipe.ts'>zod-validation.pipe.ts</a></b></td>
										<td>- Validates incoming data against a specified schema using Zod, raising a BadRequestException if validation fails<br>- The ZodValidationPipe class implements the PipeTransform interface and handles parsing and error handling<br>- This pipe plays a crucial role in ensuring data integrity and consistency throughout the backend application architecture.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>prisma</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/prisma/prisma.module.ts'>prisma.module.ts</a></b></td>
								<td>Facilitates global access to PrismaService across the entire codebase architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/prisma/prisma.service.ts'>prisma.service.ts</a></b></td>
								<td>- Manages database connections for the application, ensuring proper initialization and shutdown<br>- It extends the PrismaClient to provide lifecycle hooks for connecting and disconnecting from the database on application start and stop<br>- This service plays a crucial role in maintaining database connections for the backend application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>env</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/env/env.service.ts'>env.service.ts</a></b></td>
								<td>- Provides a service for retrieving environment configuration values using NestJS and the ConfigService<br>- It facilitates accessing specific keys from the environment configuration, ensuring type safety and inference.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/env/env.module.ts'>env.module.ts</a></b></td>
								<td>- The EnvModule in the backend_app/src/env/env.module.ts file serves as a global module provider for handling environment-related services in the project architecture<br>- It encapsulates the functionality of the EnvService and ensures its availability for other parts of the codebase.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>strategies</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/strategies/refresh-token.strategy.ts'>refresh-token.strategy.ts</a></b></td>
								<td>- Enables authentication token refreshing by validating the user's credentials using a JWT refresh token strategy<br>- This file integrates with the project's authentication module, allowing seamless and secure token renewal for authenticated users.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/strategies/jwt.strategy.ts'>jwt.strategy.ts</a></b></td>
								<td>- Implements a JWT authentication strategy using NestJS Passport for user validation<br>- Extracts user credentials from incoming requests, verifies against a JWT secret key, and validates the payload to grant or deny access.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>gateways</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/gateways/root.gateway.ts'>root.gateway.ts</a></b></td>
								<td>- The RootGateway class manages real-time user connections and presence events in the backend through WebSocket communication<br>- It handles new user connections, disconnections, and provides functionality to retrieve a list of active users<br>- The class facilitates broadcasting messages to clients and logging user events for enhanced user interaction within the application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>events</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/events/penalty.events.ts'>penalty.events.ts</a></b></td>
								<td>- Define penalty-related events for game lifecycle, player connection, and error handling in the backend<br>- This file plays a crucial role in managing event communication within the penalty-related functionalities of the project.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/events/game-invite.events.ts'>game-invite.events.ts</a></b></td>
								<td>- Define game invite and room events for seamless client-server communication within the backend application architecture<br>- The enums facilitate event handling for creating, receiving, accepting, declining, and canceling game invites, as well as managing player presence, readiness, and game progression<br>- These defined events ensure smooth coordination and interaction across the gaming platform.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>games</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/games.service.ts'>games.service.ts</a></b></td>
								<td>- Manages game configurations, rooms, and settings within the app, ensuring data integrity and accessibility<br>- Validates, creates, updates game configurations, and retrieves game rooms with associated players and invites<br>- Facilitates seamless gameplay by handling game room and configuration retrieval efficiently.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/games.controller.ts'>games.controller.ts</a></b></td>
								<td>- Defines API endpoints for managing game configurations, rooms, and updates<br>- Handles requests to fetch, create, update game configurations, and retrieve game rooms by type or ID<br>- Validates game types and provides detailed responses for successful and failed requests<br>- Maintains a structured interface for interacting with game-related data within the backend system.</td>
							</tr>
							</table>
							<details>
								<summary><b>penalty</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/penalty/penalty.module.ts'>penalty.module.ts</a></b></td>
										<td>- Defines the Penalty Game module within the backend application architecture by providing necessary controllers, services, and gateways<br>- Integrates with Prisma and Redis modules to manage penalty game functionality efficiently.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/penalty/penalty.service.ts'>penalty.service.ts</a></b></td>
										<td>- Implements services for creating, initializing, and managing penalty games within the project<br>- Handles game creation, player validation, role assignment, move processing, and game state updates<br>- Manages game end scenarios, calculates winnings, and updates player balances accordingly<br>- Provides endpoints to retrieve and update game state information.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/penalty/penalty.controller.ts'>penalty.controller.ts</a></b></td>
										<td>- Handles Penalty Game operations such as creating a game, making moves, and retrieving game state<br>- Utilizes a Penalty Game Service to interact with the game logic<br>- Organized under the 'games/penalty' endpoint with appropriate Swagger annotations for documentation<br>- Maintains a clean and structured approach to managing Penalty Game functionalities within the codebase architecture.</td>
									</tr>
									</table>
									<details>
										<summary><b>schema</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/penalty/schema/penalty.schema.ts'>penalty.schema.ts</a></b></td>
												<td>- Define validation schemas and DTO classes for creating penalty games and making moves within the penalty game system<br>- The code ensures that input data meets specified criteria for player IDs, game IDs, bet amounts, and move directions, maintaining data integrity and consistency across the application.</td>
											</tr>
											</table>
										</blockquote>
									</details>
									<details>
										<summary><b>gateway</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/penalty/gateway/penalty.gateway.ts'>penalty.gateway.ts</a></b></td>
												<td>- Facilitates real-time communication for a penalty shootout game, managing player presence, game initiation, move submissions, and game updates<br>- Handles connections, disconnections, joining/leaving rooms, and broadcasting events to players<br>- Implements WebSocket functionality using NestJS, allowing seamless gameplay interactions within the system.</td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<details>
								<summary><b>schema</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/games/schema/game-config.schema.ts'>game-config.schema.ts</a></b></td>
										<td>- Defines schemas and DTOs for game configuration in NestJS controllers<br>- Handles input validation for creating and updating game configurations, ensuring data integrity and consistency within the application.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>users</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/users/users.module.ts'>users.module.ts</a></b></td>
								<td>- The code in `users.module.ts` orchestrates the user-related functionality by defining the module's structure<br>- It integrates the user service and controller, along with the authentication module<br>- This module serves as a central hub for managing user operations within the broader application architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/users/users.service.ts'>users.service.ts</a></b></td>
								<td>- Provides user-related functionality such as fetching users by various criteria and handling exceptions<br>- Interfaces with Prisma and AuthService to retrieve user data and verify user existence<br>- Key methods include fetching users by ID, Telegram ID, and for development purposes<br>- Ensures robust user data retrieval and error handling within the application architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/users/users.controller.ts'>users.controller.ts</a></b></td>
								<td>- Handles user-related operations such as retrieving user data and authentication<br>- Utilizes guards for JWT authentication and interacts with the UsersService to fetch user information based on user ID or Telegram ID<br>- This controller plays a crucial role in managing user requests and responses within the backend application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>redis</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/redis/redis.provider.ts'>redis.provider.ts</a></b></td>
								<td>- Provides a Redis client as a NestJS provider to establish a connection with a Redis server<br>- Retrieves the Redis URL from environment variables, creates a client instance, and logs connection status<br>- This enables seamless data operations with Redis within the project's architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/redis/redis.module.ts'>redis.module.ts</a></b></td>
								<td>- Facilitates integration of Redis functionality into the project architecture through a dedicated module<br>- This module encapsulates Redis-related providers for seamless utilization across various components.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>validators</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/validators/env.validation.ts'>env.validation.ts</a></b></td>
								<td>- Define environment validation schema and function to ensure correct configuration values for the backend application<br>- The code enforces specific types and constraints for essential environment variables like NODE_ENV, PORT, DATABASE_URL, REDIS_URL, TELEGRAM_BOT_TOKEN, JWT_SECRET, JWT_EXPIRES_IN, and CORS_ORIGINS<br>- This ensures a secure and reliable runtime environment for the application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>game-invite</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/game-invite/game-invite.module.ts'>game-invite.module.ts</a></b></td>
								<td>- Manages game invitations and interactions between players, utilizing services and controllers within the project's architecture<br>- Integrates with Redis and the Penalty Game module for seamless functionality.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/game-invite/game-invite.service.ts'>game-invite.service.ts</a></b></td>
								<td>- The `GameInviteService` orchestrates game invites, handling creation, retrieval, acceptance, and decline<br>- It ensures invite integrity, user validation, and wallet balance before processing<br>- Additionally, it manages game creation and status updates based on invite actions, enhancing the multiplayer gaming experience within the application.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/game-invite/game-invite.controller.ts'>game-invite.controller.ts</a></b></td>
								<td>- Manages endpoints for game invites, including fetching, accepting, declining, and deleting invites<br>- Utilizes JWT authentication and interacts with the GameInviteService to handle invite-related operations<br>- Ensures secure handling of invite actions within the game-invites context of the project.</td>
							</tr>
							</table>
							<details>
								<summary><b>schema</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/game-invite/schema/game-invite.schema.ts'>game-invite.schema.ts</a></b></td>
										<td>- Define schemas and DTO classes for creating and accepting game invites in the backend application<br>- The code enforces validation rules for game invite parameters like recipient user IDs, game type, bet amount, and minimum players<br>- It leverages NestJS DTO classes to ensure data integrity and consistency throughout the system.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>gateway</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/game-invite/gateway/game-invite.gateway.ts'>game-invite.gateway.ts</a></b></td>
										<td>- The `game-invite.gateway.ts` file serves as a WebSocket gateway within the project architecture<br>- It facilitates real-time communication between clients and the server using WebSockets<br>- This component handles various events related to game invites, such as accepting or rejecting invites, and manages the overall interaction flow<br>- By leveraging this gateway, the application can efficiently handle multiplayer game invitations and related actions.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>guards</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/guards/auth.guard.ts'>auth.guard.ts</a></b></td>
								<td>Protects routes by validating JWT tokens for authentication and token refresh in the backend application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>auth</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/auth/auth.module.ts'>auth.module.ts</a></b></td>
								<td>- Facilitates user authentication and authorization within the backend system by providing necessary services, controllers, and strategies<br>- Integrates Passport and JWT for secure authentication mechanisms<br>- This module ensures seamless user access control and token management in the application architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/auth/auth.service.ts'>auth.service.ts</a></b></td>
								<td>- Handles user authentication and authorization using Telegram login data<br>- Verifies data integrity, creates new users, updates user profiles, generates access tokens, and allows users to login by Telegram ID<br>- Implements user validation and throws exceptions when necessary<br>- Integrates with Prisma for database operations and utilizes JWT for token generation.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/auth/auth.controller.ts'>auth.controller.ts</a></b></td>
								<td>- Handles authentication and user token management for the application<br>- Includes endpoints for Telegram login, token refresh, user verification, and login by Telegram ID<br>- Utilizes Swagger for API documentation and JWT guards for authorization<br>- Implements user creation, token generation, and user verification functionalities.</td>
							</tr>
							</table>
							<details>
								<summary><b>schema</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/auth/schema/auth.schema.ts'>auth.schema.ts</a></b></td>
										<td>- Define a schema and DTO for Telegram login data using Zod and NestJS-Zod in the auth module<br>- The schema ensures required fields like Telegram ID and auth date are present, while allowing optional fields like last name and username<br>- The DTO enforces this schema for handling Telegram login requests.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>filters</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/filters/prisma-exception.filter.ts'>prisma-exception.filter.ts</a></b></td>
								<td>- Handles Prisma database errors by mapping specific codes to appropriate HTTP status codes and messages<br>- This filter ensures consistent error responses for unique constraint violations, record not found, and foreign key constraint errors<br>- Additionally, it logs unexpected errors without exposing details to clients.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/filters/http-exception.filter.ts'>http-exception.filter.ts</a></b></td>
								<td>- Filters and logs HTTP exceptions, handling Zod serialization errors<br>- Extends the base exception filter provided by NestJS<br>- Logs Zod error messages when ZodSerializationException occurs.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/filters/zod-exception.filter.ts'>zod-exception.filter.ts</a></b></td>
								<td>- Handles Zod validation errors for both request and response scenarios, logging detailed error information and generating appropriate error responses<br>- Differentiates between request and response validations, formats error details, and logs errors with corresponding severity<br>- Implements ZodValidationFilter class to streamline error handling and response generation based on the type of validation failure.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>health</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/health/health.controller.ts'>health.controller.ts</a></b></td>
								<td>- Implements a health check endpoint in the backend to verify the status of essential system components like the database, Redis, and memory<br>- It efficiently runs multiple checks in parallel, determining an overall system health status ('OK', 'DEGRADED', 'DOWN')<br>- This endpoint provides crucial insights into the system's operational health and performance.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/health/health.service.ts'>health.service.ts</a></b></td>
								<td>Manages the health status of the application, ensuring its operational efficiency and stability.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/src/health/health.module.ts'>health.module.ts</a></b></td>
								<td>Facilitates health monitoring functionality by structuring controllers and services within a dedicated module, enhancing code organization and maintainability in the project architecture.</td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>prisma</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/schema.prisma'>schema.prisma</a></b></td>
						<td>- Defines data models and enums for user profiles, wallets, transactions, games, and invitations in the backend schema<br>- Establishes relationships between users, games, wallets, transactions, and game invites<br>- Manages user status, game configurations, and game player details with defined attributes and associations.</td>
					</tr>
					</table>
					<details>
						<summary><b>migrations</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/migration_lock.toml'>migration_lock.toml</a></b></td>
								<td>- Define the database provider for the project by specifying it in the migration_lock.toml file located in backend_app/prisma/migrations<br>- This file should not be manually altered and is crucial for version control, particularly for PostgreSQL integration within the codebase architecture.</td>
							</tr>
							</table>
							<details>
								<summary><b>20250926103953_updating_game_status_from_waiting_to_pending</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926103953_updating_game_status_from_waiting_to_pending/migration.sql'>migration.sql</a></b></td>
										<td>- Update game status values from 'WAITING' to 'PENDING' and 'ACTIVE' for better database consistency<br>- Additionally, set default values for status and expiration time in games and game configurations tables to ensure data integrity and smooth operation of the application.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250926090618_entry_fee_bet</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926090618_entry_fee_bet/migration.sql'>migration.sql</a></b></td>
										<td>Update the database schema by dropping the 'entry_fee' column from the 'game_invites' table and adding a new 'bet' column with a default value of 5.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250926103348_relation_fix</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926103348_relation_fix/migration.sql'>migration.sql</a></b></td>
										<td>Improve data integrity by modifying database constraints and foreign key relationships in the migration file.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20251001122935_game_winner_updated_to_be_player_not_user</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20251001122935_game_winner_updated_to_be_player_not_user/migration.sql'>migration.sql</a></b></td>
										<td>Update database schema to change game winner association from user to player, ensuring data integrity and enabling better player tracking and management in the system architecture.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250926103825_</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926103825_/migration.sql'>migration.sql</a></b></td>
										<td>- The migration script updates the database schema by altering the "games" table in the backend application<br>- It drops the "roundNumber" column and adds a new "round" column with a default value of 1<br>- Additionally, it modifies the default expiration time for game configurations in the "game_config" table.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250919034340_init</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250919034340_init/migration.sql'>migration.sql</a></b></td>
										<td>Define database schema for user profiles, transactions, games, and sessions, including foreign key relationships for data integrity.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250922184606_add_started_at_to_game</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250922184606_add_started_at_to_game/migration.sql'>migration.sql</a></b></td>
										<td>- Introduce a timestamp field 'startedAt' to the 'games' table in the database schema<br>- This enhancement enables tracking and storing the start time of games played within the application, enhancing data visibility and analysis capabilities.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250921092811_init</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250921092811_init/migration.sql'>migration.sql</a></b></td>
										<td>Drop the `sessions` table and its foreign key constraint, potentially losing data.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250926095528_add_expires_at_default</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926095528_add_expires_at_default/migration.sql'>migration.sql</a></b></td>
										<td>Update database schema by adding a new column in the `game_config` table and dropping a column in the `game_invites` table, ensuring default values are set appropriately.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250921163952_round_number</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250921163952_round_number/migration.sql'>migration.sql</a></b></td>
										<td>Migrate database schema to support game round numbers, removing 'is_active' column from user statuses.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250926110452_round_added_to_game_config</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926110452_round_added_to_game_config/migration.sql'>migration.sql</a></b></td>
										<td>Implement database schema changes to introduce a new enum value and default column values for game configurations.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250926093010_</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250926093010_/migration.sql'>migration.sql</a></b></td>
										<td>Optimize database schema by removing redundant columns, altering data types, and adding necessary constraints to enhance performance and maintain data consistency within the project's backend architecture.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20251001123948_game_winner_updated_from_user_to_game_player</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20251001123948_game_winner_updated_from_user_to_game_player/migration.sql'>migration.sql</a></b></td>
										<td>Update the database schema by altering the default expiration time for game configurations and dropping the 'bet' column from the 'game_players' table.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250922184052_add_game_invite_id</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250922184052_add_game_invite_id/migration.sql'>migration.sql</a></b></td>
										<td>- Implements database schema changes to establish a one-to-one relationship between game invites and games<br>- Drops the existing `game_id` column from the `game_invites` table, adds a `game_invite_id` column to the `games` table, and enforces a unique constraint on it<br>- Also sets up foreign key references for data integrity.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>20250922175052_game_invite</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/prisma/migrations/20250922175052_game_invite/migration.sql'>migration.sql</a></b></td>
										<td>Define new database schema for game invites, including status and relationships with users and games.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>test</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/test/app.e2e-spec.ts'>app.e2e-spec.ts</a></b></td>
						<td>- Tests the endpoint response of the AppController in the Nest.js application using supertest<br>- It creates a testing module, initializes the application, and sends a GET request to the root endpoint expecting a 200 status code and 'Hello World!' response.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/backend_app/test/jest-e2e.json'>jest-e2e.json</a></b></td>
						<td>Configures Jest for end-to-end testing of Node.js modules using TypeScript, defining file extensions, root directory, test environment, regex pattern, and transformation settings.</td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- frontend_app Submodule -->
		<summary><b>frontend_app</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/pnpm-lock.yaml'>pnpm-lock.yaml</a></b></td>
				<td>- The `pnpm-lock.yaml` file in the `frontend_app` directory manages package dependencies for the project<br>- It specifies the lockfile version and settings for auto-installing peers<br>- The file lists dependencies and their versions, ensuring consistent package versions across the codebase architecture.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/next.config.ts'>next.config.ts</a></b></td>
				<td>Define global configurations for the Next.js frontend application.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/tsconfig.json'>tsconfig.json</a></b></td>
				<td>- Configures TypeScript settings for the frontend app to target ES2017, enable JSX preservation, and integrate with Next.js using the specified plugins<br>- Defines module resolution, JSON module resolution, and path aliases for cleaner imports<br>- Additionally, enforces strict type checking and isolation of modules for improved code quality and maintainability within the project architecture.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/eslint.config.mjs'>eslint.config.mjs</a></b></td>
				<td>- Define ESLint configuration for Next.js project by setting up base directory and extending core web vitals and TypeScript rules<br>- Ignore specified directories and files for linting.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/middleware.ts'>middleware.ts</a></b></td>
				<td>- Implements middleware for authentication and token refresh in the frontend application<br>- Handles access token refresh, redirect paths, and route protection based on environment and cookie presence<br>- Supports token management and redirects for improved security and user experience.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/postcss.config.mjs'>postcss.config.mjs</a></b></td>
				<td>Exports a PostCSS configuration with TailwindCSS plugin for the frontend application, enhancing the codebase architecture with optimized styling capabilities.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/package.json'>package.json</a></b></td>
				<td>Define project dependencies and scripts in package.json for the frontend_app, enabling development, building, and linting processes.</td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components.json'>components.json</a></b></td>
				<td>- Define project structure and configuration for frontend components<br>- Specify styling, TypeScript usage, Tailwind CSS settings, icon library, and path aliases<br>- Establish a schema and registries for seamless integration within the codebase architecture.</td>
			</tr>
			</table>
			<details>
				<summary><b>types</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/types/penalty-game.ts'>penalty-game.ts</a></b></td>
						<td>Define the structure for penalty game data to track attempts, state, and game progress.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/types/index.ts'>index.ts</a></b></td>
						<td>- Define and export various types essential for managing user data, game details, invitations, and transactions within the frontend application<br>- These types encapsulate structured data representations to ensure consistency and clarity across the codebase architecture.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>contexts</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/contexts/PenaltySocketProvider.tsx'>PenaltySocketProvider.tsx</a></b></td>
						<td>- Facilitates real-time communication for a penalty game within the frontend app<br>- Manages socket connections, game events, and error handling<br>- Enables game creation, moves, and joining, along with event subscriptions<br>- Ensures seamless interaction between players by handling socket connections and game updates.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/contexts/RootSocketProvider.tsx'>RootSocketProvider.tsx</a></b></td>
						<td>- Enables real-time communication with the server for user interactions within the application<br>- Manages WebSocket connections, tracks active users, and handles user join/leave events<br>- Facilitates seamless updates and notifications for a dynamic user experience.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/contexts/GameInviteSocketProvider.tsx'>GameInviteSocketProvider.tsx</a></b></td>
						<td>- Facilitates real-time game invite interactions through WebSocket connections<br>- Manages invite creation, acceptance, and cancellation, as well as game room operations<br>- Handles event subscriptions for invite-related activities and game updates<br>- Monitors socket connection status and error handling within the game invite context.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>lib</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/lib/utils.ts'>utils.ts</a></b></td>
						<td>Enhances styling flexibility by merging Tailwind CSS classes in a concise manner.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/lib/axios-client.ts'>axios-client.ts</a></b></td>
						<td>- Manages Axios client configuration including request and response interceptors for handling API calls in the frontend application<br>- Configures base URL and sets up authorization headers using cookies<br>- Logs outgoing requests and incoming responses for debugging purposes<br>- Handles errors with appropriate logging and rejection.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>config</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/config/env.ts'>env.ts</a></b></td>
						<td>- Defines environment variables for the frontend app, ensuring the presence of the WebSocket URL<br>- It sets the NODE_ENV and NEXT_PUBLIC_WS_URL values, handling errors if the latter is missing<br>- This file plays a crucial role in configuring the app's environment variables for proper functionality.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<details>
						<summary><b>custom</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/custom/DebugJson.tsx'>DebugJson.tsx</a></b></td>
								<td>- Enables interactive debugging of JSON data with theme and visibility toggles<br>- Supports production data hiding and inspection with copy functionality<br>- Designed for React components, enhancing debugging experience in development environments.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/custom/Header.tsx'>Header.tsx</a></b></td>
								<td>- Improve user experience by displaying a clean and decoupled status badge in the header component<br>- The badge showcases real-time socket status alongside the user's authentication details and wallet balance<br>- This enhances the visual appeal and functionality of the Game Lobby interface.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/custom/SocketStatusBadge.tsx'>SocketStatusBadge.tsx</a></b></td>
								<td>- Implements SocketStatusBadge component displaying live connection status using badges and tooltips<br>- Utilizes RootSocketProvider context to fetch connection status.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/custom/ErrorDisplay.tsx'>ErrorDisplay.tsx</a></b></td>
								<td>Display error messages with an option to retry, enhancing user experience and guiding them through potential issues.</td>
							</tr>
							</table>
							<details>
								<summary><b>websocket</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/custom/websocket/ConnectionStatus.tsx'>ConnectionStatus.tsx</a></b></td>
										<td>- Manages WebSocket connection status and displays badges indicating connection state for specified namespaces<br>- Includes a component for individual namespaces and a global status component showing total connected namespaces and their names<br>- Improves user experience by providing real-time feedback on WebSocket connections within the frontend application.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>ui</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/badge.tsx'>badge.tsx</a></b></td>
								<td>- Defines a reusable Badge component with various visual variants<br>- It leverages class-variance-authority for dynamic styling and integrates with React for flexible rendering<br>- The component encourages consistency in UI elements across the project.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/label.tsx'>label.tsx</a></b></td>
								<td>- Implements a reusable UI label component using Radix UI for consistent styling and accessibility enhancements across the frontend application<br>- The component abstracts label rendering logic and leverages utility functions for streamlined development and maintenance.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/scroll-area.tsx'>scroll-area.tsx</a></b></td>
								<td>- Implements ScrollArea and ScrollBar components for interactive scrolling within the UI<br>- These components enhance the user experience by providing smooth navigation through content<br>- They are crucial for maintaining a seamless and user-friendly interface within the frontend application.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/input.tsx'>input.tsx</a></b></td>
								<td>Defines a reusable React input component with dynamic styling and functionality for user input in the frontend application, enhancing the project's UI components.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/textarea.tsx'>textarea.tsx</a></b></td>
								<td>Enhances user experience by providing a customizable textarea component for the frontend, facilitating text input in the application.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/separator.tsx'>separator.tsx</a></b></td>
								<td>- Implements a Separator component for the UI, enhancing visual separation in the frontend app<br>- The component leverages React and @radix-ui/react-separator to manage orientation and decorative styles, contributing to a cohesive user interface experience.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/select.tsx'>select.tsx</a></b></td>
								<td>- Implements UI components for a select dropdown feature in the frontend application<br>- The code defines various elements like the select trigger, content, items, and separators, enhancing user interaction and visual presentation<br>- These components play a crucial role in providing a seamless and intuitive selection experience within the application.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/button.tsx'>button.tsx</a></b></td>
								<td>- Defines a Button component with various visual variants and sizes<br>- Handles pending state to show a loading spinner<br>- Utilizes class-variance-authority for dynamic class generation based on props<br>- Allows customization of button appearance and behavior.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/drawer.tsx'>drawer.tsx</a></b></td>
								<td>- Defines reusable components for a drawer UI, including triggers, content, headers, and footers<br>- Manages overlay behavior and styling for different drawer directions<br>- Facilitates structured presentation of content within a drawer interface.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/dialog.tsx'>dialog.tsx</a></b></td>
								<td>- Enables creation of customizable dialogs in the frontend app using Radix UI components<br>- The code defines various dialog elements like content, overlay, header, footer, close button, title, and description for enhanced user interaction.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/alert.tsx'>alert.tsx</a></b></td>
								<td>- Defines reusable components for rendering different types of alerts with customizable variants, titles, and descriptions in a React application<br>- These components encapsulate styling and behavior logic, enhancing codebase modularity and maintainability.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/tabs.tsx'>tabs.tsx</a></b></td>
								<td>- Implements UI components for tabs functionality in React, leveraging the "@radix-ui/react-tabs" library<br>- Includes components for tabs, tabs list, tabs trigger, and tabs content<br>- Enables easy integration of tabbed navigation in the frontend application.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/skeleton.tsx'>skeleton.tsx</a></b></td>
								<td>- The code in frontend_app/components/ui/skeleton.tsx provides a reusable Skeleton component for displaying loading placeholders in the user interface<br>- It leverages utility functions for classnames and animation, enhancing the visual experience during data loading.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/switch.tsx'>switch.tsx</a></b></td>
								<td>- Implements a customizable switch component for the frontend UI, enhancing user interactions<br>- The component leverages Radix UI for seamless integration and consistent styling across the codebase.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/avatar.tsx'>avatar.tsx</a></b></td>
								<td>- Defines reusable Avatar components for displaying user images in the frontend UI, enhancing modularity and maintainability<br>- Encapsulates avatar rendering logic to promote consistency and reusability across the application, adhering to best practices in component-based architecture.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/tooltip.tsx'>tooltip.tsx</a></b></td>
								<td>- The `tooltip.tsx` file in the project's frontend architecture provides components for tooltips, including Tooltip, TooltipTrigger, TooltipContent, and TooltipProvider<br>- These components enable the display of interactive and informative tooltips within the user interface.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/sonner.tsx'>sonner.tsx</a></b></td>
								<td>- Enhances UI functionality by integrating theme support for toasts using the Sonner library<br>- The Toaster component leverages the next-themes package to dynamically apply themes, offering a seamless user experience.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/components/ui/card.tsx'>card.tsx</a></b></td>
								<td>- Define UI components for a card in the React frontend app<br>- Includes Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, and CardContent functions for creating structured card elements with specific styling and layout.</td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>events</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/events/penalty.events.ts'>penalty.events.ts</a></b></td>
						<td>- Define penalty-related events for the frontend application, including game lifecycle events, connection handling, and error events<br>- This enum file centralizes event definitions for seamless event communication and handling throughout the project architecture.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/events/game-invite.events.ts'>game-invite.events.ts</a></b></td>
						<td>- Defines game invite and room events, along with schemas for creating game invites<br>- Specifies payloads for invite creation, acceptance, and game presence<br>- Facilitates communication between clients and servers for managing game invites and player interactions within the gaming platform.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>hooks</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/hooks/useIsMobile.tsx'>useIsMobile.tsx</a></b></td>
						<td>- Enables responsive design by determining if the user's device is mobile<br>- Monitors window size changes to adjust layout for optimal user experience.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>constants</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/constants/index.ts'>index.ts</a></b></td>
						<td>Define constants for cookie names and paths to eliminate hard-coded strings in the project's frontend application.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>server_actions</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/server_actions/game-room.actions.ts'>game-room.actions.ts</a></b></td>
						<td>Retrieve game room data from the server using Axios and return the response.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/server_actions/game.actions.ts'>game.actions.ts</a></b></td>
						<td>- Retrieve game configurations from the server using AxiosClient for various game types<br>- The code file facilitates fetching game configurations and types by making API requests to the server, enabling seamless integration with the frontend application.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/server_actions/game-invite.actions.ts'>game-invite.actions.ts</a></b></td>
						<td>- Facilitates retrieval of user game invites and game invite details through server actions, leveraging axiosClient for HTTP requests<br>- Maintains separation of concerns by utilizing serverActionWrapper for handling async operations<br>- Enhances codebase architecture by encapsulating server interactions within dedicated functions.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/server_actions/index.ts'>index.ts</a></b></td>
						<td>- Implementing a server action wrapper function to handle asynchronous server requests and responses<br>- The function wraps API calls, returning success data or error messages based on the outcome<br>- This enhances error handling and response consistency across the frontend app.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/server_actions/dev.actions.ts'>dev.actions.ts</a></b></td>
						<td>- Facilitates user authentication and data retrieval from the server using Axios<br>- Handles operations like fetching all users, specific user data, and logging in via Telegram ID<br>- Manages token setting for secure access and refresh.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/server_actions/auth.actions.ts'>auth.actions.ts</a></b></td>
						<td>- Handles server authentication and user data retrieval through Axios requests<br>- Verifies user credentials and retrieves user details using serverActionWrapper for error handling<br>- Integrated with the project's Axios client for efficient API interactions.</td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>utils</b></summary>
				<blockquote>
					<details>
						<summary><b>format</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/utils/format/index.ts'>index.ts</a></b></td>
								<td>- Achieves time-based formatting for display within the frontend application<br>- The function calculates the time elapsed since a given date and returns a human-readable representation (e.g., 'just now', '1 hour ago')<br>- This utility enhances the user experience by providing contextually relevant timestamps.</td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>app</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/layout.tsx'>layout.tsx</a></b></td>
						<td>- Defines the layout for the frontend app, setting metadata and fonts<br>- Imports necessary dependencies, including Google fonts and global styles<br>- Utilizes a custom Toaster component for notifications<br>- Integrates axiosClient for API calls<br>- Renders the main content within an HTML body with specified language and font styles.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/globals.css'>globals.css</a></b></td>
						<td>- Define global CSS variables for theming and styling in the frontend application, utilizing Tailwind CSS and custom properties<br>- Ensure consistent design language and color palettes across the app by setting color, font, and radius values<br>- Separately define light and dark mode themes for enhanced user experience.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/page.tsx'>page.tsx</a></b></td>
						<td>Redirects users to the "/games" page upon visiting the Home page in the frontend app, facilitating seamless navigation within the project.</td>
					</tr>
					</table>
					<details>
						<summary><b>games</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/layout.tsx'>layout.tsx</a></b></td>
								<td>- This code file orchestrates the layout for games within the frontend app, ensuring authenticated user access and setting up necessary socket providers<br>- It handles user verification, retrieves user details, and sets up the necessary components for a seamless gaming experience.</td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/page.tsx'>page.tsx</a></b></td>
								<td>- Display game configurations and allow players to choose from available games with dynamic details like player count, entry fee, and game status<br>- Handles empty state elegantly<br>- Promotes player engagement through clear UI and interactive elements<br>- Enhances user experience by providing a seamless pathway to start playing games.</td>
							</tr>
							</table>
							<details>
								<summary><b>penalty</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/penalty/layout.tsx'>layout.tsx</a></b></td>
										<td>- Facilitates integration of PenaltySocketProvider into the game layout for seamless communication between the frontend app and the server<br>- Retrieves the access token using useGetAccessToken to establish a secure connection<br>- This component encapsulates the game content, ensuring a streamlined user experience.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/penalty/page.tsx'>page.tsx</a></b></td>
										<td>- Render a dynamic game space interface displaying game details, player info, and user invites<br>- Handles error displays for config fetching and user data<br>- Uses components for card layout, badges, and user interactions.</td>
									</tr>
									</table>
									<details>
										<summary><b>invites</b></summary>
										<blockquote>
											<details>
												<summary><b>[gameInviteId]</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/penalty/invites/[gameInviteId]/page.tsx'>page.tsx</a></b></td>
														<td>- Enables rendering game invite details and connecting players in the frontend app<br>- Retrieves game invite data asynchronously and displays it, handling potential errors gracefully<br>- Includes an option for debugging during development<br>- The component facilitates a seamless user experience by showcasing the game invite room client.</td>
													</tr>
													</table>
													<details>
														<summary><b>_components</b></summary>
														<blockquote>
															<table>
															<tr>
																<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/penalty/invites/[gameInviteId]/_components/GameInviteRoomClient.tsx'>GameInviteRoomClient.tsx</a></b></td>
																<td>- Enables real-time interaction for game invites, displaying player statuses and facilitating game start<br>- Handles player readiness and updates, with a focus on user experience and seamless game initiation<br>- Supports both creators and participants in the invite process, ensuring a smooth transition to gameplay.</td>
															</tr>
															</table>
														</blockquote>
													</details>
												</blockquote>
											</details>
										</blockquote>
									</details>
									<details>
										<summary><b>[gameId]</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/penalty/[gameId]/page.tsx'>page.tsx</a></b></td>
												<td>- Retrieve and display game room data based on the provided gameId, handling errors and displaying a custom error message if needed<br>- If the game room data is not found, navigate to a not found page<br>- Display the game room client component with the retrieved game room data.</td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<details>
								<summary><b>_contexts</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_contexts/PenaltyGameContext.tsx'>PenaltyGameContext.tsx</a></b></td>
										<td>- Facilitates real-time multiplayer penalty shootout game interactions by managing game state, socket connections, and event handling<br>- Enables players to join games, make moves, and receive updates on game progress<br>- Implements callbacks for game initialization, updates, and completion, enhancing the overall gameplay experience within the application.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>_components</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/PenaltyGame.tsx'>PenaltyGame.tsx</a></b></td>
										<td>Facilitates the integration of Penalty Game UI components with the game context, enhancing the user experience.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/InitAuthUser.tsx'>InitAuthUser.tsx</a></b></td>
										<td>- Initialize authentication user data in the frontend application by setting user, access token, and user details using custom hooks from the auth store<br>- This component ensures seamless user authentication handling during app initialization.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/GameInvitesList.tsx'>GameInvitesList.tsx</a></b></td>
										<td>- Manages game invites, displaying and handling them based on status<br>- Allows users to accept, decline, or cancel invites, with real-time updates<br>- Filters invites and shows relevant actions for each status<br>- Provides a seamless interface for users to manage game requests efficiently within the app.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/AcceptDeclineButtonsClient.tsx'>AcceptDeclineButtonsClient.tsx</a></b></td>
										<td>- Improve user experience by enabling players to easily accept or decline game invitations through intuitive buttons<br>- This component enhances the frontend app's gameplay flow, ensuring smooth interactions for users.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/GameInviteForm.tsx'>GameInviteForm.tsx</a></b></td>
										<td>- Enables creating game invites with player selection, bet amount, and form validation<br>- Integrates user search, selection, and active status indicators<br>- Facilitates creating invites based on game type and configuration, ensuring user limits and service fees are met<br>- Supports toggling between free and paid games, resetting bet amounts as needed.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/PenaltyGameUI.tsx'>PenaltyGameUI.tsx</a></b></td>
										<td>- Facilitates real-time multiplayer Penalty Shootout game interactions, handling player connections, game initialization, turn-based moves, and game completion<br>- Dynamically assigns player roles, updates game state, and displays game outcomes<br>- Manages player statuses, triggers game events, and provides a seamless user experience.</td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/_components/GameRenderer.tsx'>GameRenderer.tsx</a></b></td>
										<td>- The GameRenderer component selects and renders the appropriate game component based on the game type provided<br>- It plays a crucial role in dynamically displaying different game types within the frontend application's game section.</td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>rooms</b></summary>
								<blockquote>
									<details>
										<summary><b>[gameId]</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/games/rooms/[gameId]/page.tsx'>page.tsx</a></b></td>
												<td>- The code in the provided file retrieves game data and renders it in a dedicated space within the frontend application<br>- It utilizes server actions to fetch the game room information based on the provided gameId<br>- If the retrieval is successful, the game data is passed to the GameRenderer component for display, otherwise an error message is shown using the ErrorDisplay component.</td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>test</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/test/page.tsx'>page.tsx</a></b></td>
								<td>- Demonstrates real-time communication using Socket.IO to establish a connection with a server for testing purposes<br>- Handles various connection events and displays connection status in the browser console<br>- Essential for verifying and troubleshooting socket functionality within the frontend application.</td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>auth</b></summary>
						<blockquote>
							<details>
								<summary><b>login</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/auth/login/page.tsx'>page.tsx</a></b></td>
										<td>Defines a React component for the login page, encapsulating the UI logic for the login functionality.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>dev</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/dev/page.tsx'>page.tsx</a></b></td>
								<td>- Render a developer-specific page displaying user data fetched from the server, with a login form for access control<br>- Handles user absence gracefully.</td>
							</tr>
							</table>
							<details>
								<summary><b>_components</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/app/dev/_components/LoginForm.tsx'>LoginForm.tsx</a></b></td>
										<td>- Enables user authentication via Telegram Id with seamless login functionality and error handling<br>- Integrates with server actions for user verification and login, updating authentication state upon successful login<br>- Enhances user experience by providing real-time feedback through toast notifications.</td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>stores</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/stores/auth.store.tsx'>auth.store.tsx</a></b></td>
						<td>- Manages authentication state and actions for the frontend app, providing hooks to access and update user information and access tokens<br>- The code defines an Auth store with user and user detail data structures, along with functions to set and retrieve user details and access tokens<br>- This facilitates seamless authentication handling within the application.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/stores/websocket.store.ts'>websocket.store.ts</a></b></td>
						<td>- Manages WebSocket connections, errors, and sockets within the application<br>- Handles adding, removing, updating connection status, setting errors, and emitting events on sockets<br>- Provides hooks to access and interact with WebSocket state in a structured manner throughout the codebase architecture.</td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/kayowakmelese/testing_tesis.git/blob/master/frontend_app/stores/active-users.store.tsx'>active-users.store.tsx</a></b></td>
						<td>- Manages state for active users, allowing initialization, addition, and removal of user IDs<br>- Provides functions to check for active users and access actions for WebSocket or API interactions<br>- This file encapsulates the logic for tracking and managing active user data within the frontend application's state management system.</td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---
##  Getting Started

###  Prerequisites

Before getting started with testing_tesis.git, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm
- **Container Runtime:** Docker


###  Installation

Install testing_tesis.git using one of the following methods:

**Build from source:**

1. Clone the testing_tesis.git repository:
```sh
❯ git clone https://github.com/kayowakmelese/testing_tesis.git
```

2. Navigate to the project directory:
```sh
❯ cd testing_tesis.git
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker build -t kayowakmelese/testing_tesis.git .
```




###  Usage
Run testing_tesis.git using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker run -it {image_name}
```


###  Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```


---
##  Project Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

##  Contributing

- **💬 [Join the Discussions](https://github.com/kayowakmelese/testing_tesis.git/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/kayowakmelese/testing_tesis.git/issues)**: Submit bugs found or log feature requests for the `testing_tesis.git` project.
- **💡 [Submit Pull Requests](https://github.com/kayowakmelese/testing_tesis.git/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/kayowakmelese/testing_tesis.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/kayowakmelese/testing_tesis.git/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=kayowakmelese/testing_tesis.git">
   </a>
</p>
</details>

---

##  License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

---
