// Documentation: https://sdk.netlify.com/docs

import { NetlifyExtension } from "@netlify/sdk";
import type { TeamConfig } from "./schema/team-config.js";

const extension = new NetlifyExtension<Record<string, never>, TeamConfig>();

extension.addBuildEventHandler("onPreBuild", async ({ netlifyConfig, teamConfiguration }) => {
  // If the build event handler is not enabled, return early
  if (!process.env["NETLIFY_EXTENSION_DARTSASS_ENABLED"]) {
    return;
  }

  // Obtain Dart Sass version with priority: env var > team config > default
  const DEFAULT_VERSION = "1.97.3";
  const teamVersion = teamConfiguration?.dartsassVersion;
  const envVersion = netlifyConfig.build.environment.DART_SASS_VERSION;

  let DART_SASS_VERSION = envVersion || teamVersion || DEFAULT_VERSION;
  console.log(`Installing Dart Sass v${DART_SASS_VERSION}`);
  
  // Define the Dart Sass installation command 
  // See https://gohugo.io/host-and-deploy/host-on-netlify/ for more information
  let newCommand = 
    `curl -sLJO "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" && \
    tar -xf dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz && \
    rm "dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz" && \
    export PATH=/opt/build/repo/dart-sass:$PATH`
 

  // Run the installation command before the build command
    netlifyConfig.build.command = netlifyConfig.build.command
      ? `${newCommand} && ${netlifyConfig.build.command}`
      : newCommand;

});
export { extension };
