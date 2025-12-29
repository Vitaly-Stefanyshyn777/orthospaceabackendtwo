import { Injectable } from "@nestjs/common";

import { AuthHelpers } from "../../shared/helpers/auth.helpers";

@Injectable()
export class UserListener {
  static async onCreated(params, next) {
    // Check incoming query type
    if (params.model == "User") {
      if (params.action === "create" || params.action === "update") {
        const password = params.args["data"].password;

        // Only hash if password is not already hashed (doesn't contain ':')
        if (password && !password.includes(":")) {
          const encryptedPass = await AuthHelpers.hash(password);

          params.args["data"] = {
            ...params.args["data"],
            password: encryptedPass,
          };
        }
      }
    }

    return next(params);
  }
}
