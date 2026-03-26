# Production and Deployment

Projects developed using ofa.js can be directly deployed to a static server for use.

## Development Environment

You can use the official [ofa Studio](https://core.noneos.com/?redirect=studio) for development, which offers one-click project creation and preview.

You can also build your own static server:

* Use static server software such as Nginx or Apache  
* Use Node.js’s [http-server](https://www.npmjs.com/package/http-server) module  
* Preview directly with a static-server plugin in your editor

## Production Environment

### Export Project

If you are using a project built with [ofa Studio](https://core.noneos.com/?redirect=studio), simply use the built-in export function of the tool.

If it's a manually built project, you can directly deploy the project folder to a static server, keeping the same mode as the development environment.

### Compression and Obfuscation

In production environments, compression and obfuscation tools are typically used to reduce file size and improve loading speed. You can use [Terser CLI](https://terser.org/docs/cli-usage/) for compression and obfuscation.

If you don't want to use command-line tools, you can use [ofa build](https://builder.ofajs.com/) to compress and obfuscate files online. This tool is currently in beta and will be merged into ofa Studio in the future.

