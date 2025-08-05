# Executables (local)
TOOLKIT = docker compose run --rm toolkit

# Misc
.DEFAULT_GOAL = help
.PHONY        : help \
                lint lint-fix \
                npm node_modules

## —— 🔧 👾 Escape from Cygnus X1 Makefile 👾 🔧 ——————————————————————————————————
help: ## Outputs this help screen.
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Lint 🧹 —————————————————————————————————————————————————————————————————————
lint: ## Scan files for style errors.
lint: c=run lint
lint: npm

lint-fix: ## Scan files for style errors and fix them.
lint-fix: c=run lint:fix
lint-fix: npm

## —— NPM ⬢ ———————————————————————————————————————————————————————————————————————
npm: ## Run npm. Pass the parameter "c=" to run a given command; example: make npm c='install --save-dev webpack'.
	@$(eval c ?=)
	@$(TOOLKIT) npm $(c)

node_modules: ## Install node_modules according to the current package-lock.json file.
node_modules: c=ci
node_modules: npm
