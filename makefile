.PHONY: pt

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

pt:
	@echo "🔍 Formatting code with Prettier..."
	@if [ ! -d "backend_app" ]; then \
		echo "❌ Directory 'backend_app' not found!"; \
		exit 1; \
	fi
	@cd backend_app && pnpm dlx prettier --write . && echo "✅ Formatting complete!"

tun:
	@echo "🔍 Tunneling Frontend..."
	@if [ ! -d "frontend_app" ]; then \
		echo "❌ Directory 'frontend_app' not found!"; \
		exit 1; \
	fi
	@cd frontend_app && cloudflared tunnel --url http://127.0.0.1:3001
