# emeris-libraries

For local development (without publishing a package):

1. Create a build inside the package. Eg: run `npm run build` inside packages/types/
2. Use url of that build. Eg: `import { FeesRequest, FeesResponse } from "../../../emeris-libraries/packages/types/lib/EmerisFees"` instead of `import { FeesResponse, FeesRequest } from "@emeris/types/lib/EmerisFees"`

There are other methods like `npm link` but ^ this should help.
