# Executables (local)
TOOLKIT = docker compose run --rm toolkit

# Misc
.DEFAULT_GOAL = help
.PHONY        : help \
                art art-clean backgrounds-clean \
                lint lint-fix \
                npm node_modules

## —— 🔧 👾 Escape from Cygnus X1 Makefile 👾 🔧 ——————————————————————————————————
help: ## Outputs this help screen.
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Art 🎨 ——————————————————————————————————————————————————————————————————————
art: ## Export all art to the assets directory.
art: backgrounds

art-clean: ## Remove all art from the assets directory.
art-clean: backgrounds-clean

#
# Backgrounds
#
BACKGROUNDS = starfield-512x512

BACKGROUNDS_starfield-512x512_LAYER_OPTIONS = --layer Space --layer Stars

BACKGROUNDS_DST_DIR  = assets/backgrounds
BACKGROUNDS_TARGETS := $(addprefix $(BACKGROUNDS_DST_DIR)/,$(addsuffix .png,$(BACKGROUNDS)))

backgrounds: ## Export all backgrounds to the assets directory.
backgrounds: $(BACKGROUNDS_TARGETS)

$(BACKGROUNDS_DST_DIR)/%.png: art/backgrounds/%.aseprite
	@$(TOOLKIT) ase --batch $(BACKGROUNDS_$(basename $(notdir $<))_LAYER_OPTIONS) $< --save-as $@

$(BACKGROUNDS_TARGETS): | $(BACKGROUNDS_DST_DIR)

$(BACKGROUNDS_DST_DIR):
	@$(TOOLKIT) mkdir -p $(BACKGROUNDS_DST_DIR)

backgrounds-clean: ## Remove all backgrounds from the assets directory.
	@$(TOOLKIT) rm -rf $(BACKGROUNDS_DST_DIR)

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
