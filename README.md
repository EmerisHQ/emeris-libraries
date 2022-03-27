# emeris-libraries

## How to install
1. clone using ssh - `git clone git@github.com:EmerisHQ/emeris-libraries.git`. (May seem unresponsive - don't worry it takes a while)
2. run `cd emeris-libraries`, `npm run bootstrap && npm run build`
3. run `npm run serve` in the root directory(emeris-libraries) to start the dev environment
4. Open chrome / firefox etc.(instructions based on chrome), open `chrome://extensions/`
5. Toggle the developer mode switch if not already turned on, click on Load unpacked and navigate to the `packages/browser-extension/dist` directory and load
6. Enjoy your unstable hot-reloading dev env. It is recommended to `run npm serve` again and `remove` + `load unpacked` the extension on any changes to the code
