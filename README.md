# emeris-libraries

## How to install
1. clone using ssh - `git clone git@github.com:EmerisHQ/emeris-libraries.git`. (May seem unresponsive - don't worry it takes a while)
2. run `cd emeris-libraries`, `npm run bootstrap && npm run build`
3. Publishing new versions (patch/minor/major) is done via manually triggering the appropriate workflow in the Github Actions tab
4. A PR in this repo will publish a canary version on any changes under the PR-{PR#} dist tag.

E.g. if you create PR #123 to update some types in @emeris/types, any commit in that PR will trigger a build and publish that is accessible in other projects via `npm install @emeris/types@pr-123`
