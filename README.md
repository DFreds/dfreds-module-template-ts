<div align="center">
  <img src="https://i.imgur.com/gOZy3Jf.png" width="200" height="200"/>
</div>
<h1 align="center">DFreds Module Template TS</h1>

<h4 align="center">
  <a href="https://foundryvtt.com/packages/dfreds-module-template-ts">Install</a>
  ·
  <a href="https://discord.gg/Wq8AEV9bWb">Discord</a>
  ·
  <a href="https://github.com/topics/dfreds-modules">Other Modules</a>
</h4>

<p align="center">
    <a href="https://github.com/DFreds/dfreds-module-template-ts/pulse"><img src="https://img.shields.io/github/last-commit/DFreds/dfreds-module-template-ts?style=for-the-badge&logo=github&color=7dc4e4&logoColor=D9E0EE&labelColor=302D41"></a>
    <a href="https://github.com/DFreds/dfreds-module-template-ts/releases/latest"><img src="https://img.shields.io/github/v/release/DFreds/dfreds-module-template-ts?style=for-the-badge&logo=gitbook&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41"></a>
    <a href="https://github.com/DFreds/dfreds-module-template-ts/stargazers"><img src="https://img.shields.io/github/stars/DFreds/dfreds-module-template-ts?style=for-the-badge&logo=apachespark&color=eed49f&logoColor=D9E0EE&labelColor=302D41"></a>
    <br>
    <br>
    <img src="https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/DFreds/dfreds-module-template-ts/main/static/module.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=fe6a1f&style=for-the-badge&logo=foundryvirtualtabletop">
    <a href="https://forge-vtt.com/bazaar#package=dfreds-module-template-ts"><img src="https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https://forge-vtt.com/api/bazaar/package/dfreds-module-template-ts&colorB=68a74f&style=for-the-badge&logo=condaforge"></a>
    <br>
    <img src="https://img.shields.io/github/downloads/DFreds/dfreds-module-template-ts/latest/dfreds-module-template-ts.zip?color=2b82fc&label=LATEST%20DOWNLOADS&style=for-the-badge">
    <img src="https://img.shields.io/github/downloads/DFreds/dfreds-module-template-ts/total?color=2b82fc&label=TOTAL%20DOWNLOADS&style=for-the-badge">
    <br>
    <br>
    <a href="https://www.patreon.com/dfreds"><img src="https://img.shields.io/badge/-Patreon-%23f96854?style=for-the-badge&logo=patreon"></a>
    <a href="https://www.buymeacoffee.com/dfreds"><img src="https://img.shields.io/badge/-Buy%20Me%20A%20Coffee-%23ff813f?style=for-the-badge&logo=buymeacoffee"></a>
    <a href="https://discord.gg/Wq8AEV9bWb"><img src="https://img.shields.io/badge/-Discord-%235865f2?style=for-the-badge"></a>
</p>

<p align="center">
    <b>DFreds Module Template TS</b> is a FoundryVTT module template that uses Typescript and Vite for development.
</p>

## Setup

- Ensure you have the pf2e repo cloned from github (`git clone git@github.com:foundryvtt/pf2e.git`)
- Use the template button on Github to create a new repo. Make sure that the "Repository name" is the same name as the identifier of your new module. This is important since the folder name NEEDS to match the identifier when the module is linked to Foundry
  - Example:
    - Owner: DFreds
    - Repository name: `dfreds-new-cool-module`
- Clone the repo OUTSIDE of the Foundry data path
- Copy `foundryconfig.example.json` to `foundryconfig.json` and update the data and pf2e paths
  - This will allow the setup scripts to run
  - Example:
    - Windows: `"dataPath": "C:\\Users\\DFreds\\AppData\\Local\\FoundryVTT\\Data"`
- If not already installed, download and install [nvm](https://github.com/nvm-sh/nvm).
- Run `nvm use` or `nvm install <version>` and `nvm use`
  - Ensures a common node version is used regardless of user environment
- Run `npm ci`
  - Installs all dependencies according to the `package-lock.json`
- Run `npm run rename-module`
  - Replaces all occurrences of `dfreds-module-template-ts` and `DFreds Module Template TS` in the project with your desired module identifier and name
- Run `npm run update-types`
  - Copies all pf2e types to the `/types` folder using the pf2e path set in `foundryconfig.json`
- Run `npm run lint:fix`
  - Fixes and formats all the types you just copied from pf2e. Recommend doing this after every type update to reduce diffs
- Run `npm run build`
  - Builds the app into the `/dist` folder
- Run `npm run link`
  - Symlinks the built `/dist` folder to your Foundry data path set in `foundryconfig.json`
- If you don't plan on using any 3rd party dependencies, then be sure to remove `vendor.mjs` everywhere that it is mentioned in the project.
  - Note that the UUID dependency was included to get started. It's likely you don't need this specific dependency, but the module won't build without at least one dependency if the references to `vendor.mjs` exists in the project.

## Static Files

Assets, fonts, language files, packs, templates, and the module.json can all exist in the `/static` folder in anyway you see fit. When built, any static files or folders will exist in `/dist` directly.

## Updating Node

After updating to a new node version, run `node -v > .nvmrc`.

## Releasing a New Module Version

- Create a new tag with the format `major.minor.patch` or `vMajor.Minor.Patch`.
  - Example: `1.0.0` or `v1.0.0`
- Push the tag to origin
- Once the workflow completes, go to the Releases and observe the new draft release corresponding to the version
- Edit the draft release, make any desired changes, and then press Publish

## References

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.wiki/en/development/guides/vite
- https://bringingfire.com/blog/intro-to-foundry-module-development
