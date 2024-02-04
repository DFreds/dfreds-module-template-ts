# DFreds Module Template TS

[![alt-text](https://img.shields.io/badge/-Patreon-%23f96854?style=for-the-badge)](https://www.patreon.com/dfreds)
[![alt-text](https://img.shields.io/badge/-Buy%20Me%20A%20Coffee-%23ff813f?style=for-the-badge)](https://www.buymeacoffee.com/dfreds)
[![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/Wq8AEV9bWb)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/DFreds/dfreds-module-template-ts/main/static/module.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=ff6400&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https://forge-vtt.com/api/bazaar/package/dfreds-module-template-ts&colorB=68a74f&style=for-the-badge)](https://forge-vtt.com/bazaar#package=dfreds-module-template-ts)
![Latest Release Download Count](https://img.shields.io/github/downloads/DFreds/dfreds-module-template-ts/latest/dfreds-module-template-ts.zip?color=2b82fc&label=LATEST%20DOWNLOADS&style=for-the-badge)
![Total Download Count](https://img.shields.io/github/downloads/DFreds/dfreds-module-template-ts/total?color=2b82fc&label=TOTAL%20DOWNLOADS&style=for-the-badge)

**DFreds Module Template TS** is a FoundryVTT module template that uses Typescript and Vite for development.

## After Using as Template

- Ensure you have the pf2e repo cloned from github (`git clone git@github.com:foundryvtt/pf2e.git`)
- Rename the folder to what your module identifier will be (i.e. `dfreds-module-template-ts`)
- Copy `foundryconfig.example.json` to `foundryconfig.json` and update the data and pf2e paths
- `nvm use` or `nvm install <version>` and `nvm use`
- `npm ci`
- `npm run rename-module`
- `npm run update-types`
- `npm run build`
- `npm run link`
- If you don't plan on using any 3rd party dependencies, then be sure to remove `vendor.mjs` everywhere that it is mentioned.

## Updating Node

After updating to a new node version, run `node -v > .nvmrc`.

## Releasing a New Version

- Create a new tag with the format `major.minor.patch` or `vMajor.Minor.Patch`.
  - Example: `1.0.0` or `v1.0.0`
- Push the tag to origin
- Once the workflow completes, go to the Releases and observe the new draft release corresponding to the version
- Edit the draft release, make any desired changes, and then press Publish

## References

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.wiki/en/development/guides/vite
- https://bringingfire.com/blog/intro-to-foundry-module-development
