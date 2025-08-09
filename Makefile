# Executables (local)
TOOLKIT = docker compose run --rm toolkit

# Misc
.DEFAULT_GOAL = help
.PHONY        : help \
                art art-clean animations-clean backgrounds-clean fonts-clean \
                lint lint-fix \
                npm node_modules

## —— 🔧 👾 Escape from Cygnus X1 Makefile 👾 🔧 ——————————————————————————————————
help: ## Outputs this help screen.
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Art 🎨 ——————————————————————————————————————————————————————————————————————
art: ## Export all art to the assets directory.
art: animations backgrounds fonts

art-clean: ## Remove all art from the assets directory.
art-clean: animations-clean backgrounds-clean fonts-clean

#
# Animations
#
ANIMATIONS = gameobjects-32x32

ANIMATIONS_gameobjects-32x32_LAYER_OPTIONS = --layer Object

ANIMATIONS_DST_DIR  = src/assets/animations
ANIMATIONS_TARGETS := $(addprefix $(ANIMATIONS_DST_DIR)/,$(addsuffix .png,$(ANIMATIONS)) $(addsuffix .json,$(ANIMATIONS)))

animations: ## Export all animation spritesheets & data to the assets directory.
animations: $(ANIMATIONS_TARGETS)

animations-clean: ## Remove all animation spritesheets & data from the assets directory.
	@$(TOOLKIT) rm -rf $(ANIMATIONS_DST_DIR)

$(ANIMATIONS_DST_DIR)/%.png: art/animations/%.aseprite
	@$(TOOLKIT) ase --batch $(ANIMATIONS_$(basename $(notdir $<))_LAYER_OPTIONS) $< --sheet $@  --data $(@:.png=.json) \
	--sheet-type packed --ignore-empty --merge-duplicates --border-padding 1 --shape-padding 1 --inner-padding 1 \
	--trim --trim-sprite --filename-format {frame} --tagname-format {tag} --list-tags

$(ANIMATIONS_TARGETS): | $(ANIMATIONS_DST_DIR)

$(ANIMATIONS_DST_DIR):
	@$(TOOLKIT) mkdir -p $(ANIMATIONS_DST_DIR)

#
# Backgrounds
#
BACKGROUNDS = starfield-512x512

BACKGROUNDS_starfield-512x512_LAYER_OPTIONS = --layer Space --layer Stars

BACKGROUNDS_DST_DIR  = src/assets/backgrounds
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

#
# Fonts
#
FONTS = Orbitron-VariableFont_wght

FONTS_DST_DIR = src/assets/fonts
FONTS_TARGETS = $(addprefix $(FONTS_DST_DIR)/,$(addsuffix .ttf,$(FONTS)))

fonts: ## Export all fonts to the assets directory.
fonts: $(FONTS_TARGETS)

$(FONTS_DST_DIR)/%.ttf: art/fonts/%.ttf
	@$(TOOLKIT) cp $< $@

$(FONTS_TARGETS): | $(FONTS_DST_DIR)

$(FONTS_DST_DIR):
	@$(TOOLKIT) mkdir -p $(FONTS_DST_DIR)

fonts-clean: ## Remove all fonts from the assets directory.
	@$(TOOLKIT) rm -rf $(FONTS_DST_DIR)

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
