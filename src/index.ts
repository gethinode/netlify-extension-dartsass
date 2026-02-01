// Documentation: https://sdk.netlify.com/docs

import { NetlifyExtension } from "@netlify/sdk";
// import type { TeamConfig } from "./schema/team-config.js";
// import type { SiteConfig } from "./schema/site-config.js";

const extension = new NetlifyExtension();
// const extension = new NetlifyExtension<SiteConfig, TeamConfig>();
extension.addBuildEventHandler("onPreBuild", async ({ netlifyConfig }) => {
  // If the build event handler is not enabled, return early
  if (!process.env["NETLIFY_EXTENSION_DARTSASS_ENABLED"]) {
    return;
  }

  // Obtain and log the requested Dart Sass version, using 1.97.3 by default
  let DART_SASS_VERSION = netlifyConfig.build.environment.DART_SASS_VERSION || "1.97.3";
  console.log(`Installing Dart Sass v${DART_SASS_VERSION}`);
  
  // Define the Dart Sass installation command 
  // See https://gohugo.io/host-and-deploy/host-on-netlify/ for more information
  let newCommand = `
    curl -sLJO "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" && \
    tar -C "${HOME}/.local" -xf "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" && \
    rm "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" && \
    export PATH="${HOME}/.local/dart-sass:${PATH}"`
 

  // Run the installation command before the build command
    netlifyConfig.build.command = netlifyConfig.build.command
      ? `${newCommand} && ${netlifyConfig.build.command}`
      : newCommand;

});
export { extension };
