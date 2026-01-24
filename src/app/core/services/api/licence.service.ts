import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiConstant } from "../../constants/api-constant";
import { AuthenticationService } from "../global/authentication.service";
import { InterceptorService } from "../global/interceptor.service";
import { ApiCacheService } from "../global/api-global-cache";

@Injectable({ providedIn: "root" })
export class LicenceService {
  constructor(
    private authenticationService: AuthenticationService,
    private axiosInterceptorService: InterceptorService,
    private router: Router,
    private apiCache: ApiCacheService
  ) {
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      if (!isAuthenticated) this.router.navigate(["/"]);
    });
  }

  modifyLicence(body: any): Promise<any> {
    return this.axiosInterceptorService
      .getAxiosInstance()
      .put(ApiConstant.API + "/licence/update", body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("firebaseToken") ?? ""}`,
        },
      })
      .then((res) => {
        this.apiCache.invalidateTags("licence");
        return res;
      });
  }

  listLicence(opts?: { force?: boolean; ttlMs?: number }): Promise<any> {
    const key = "licence:list";

    return this.apiCache.wrap(
      key,
      () =>
        this.axiosInterceptorService
          .getAxiosInstance()
          .get(ApiConstant.API + "/licence/list-licence"),
      {
        force: opts?.force,
        ttlMs: opts?.ttlMs ?? 60_000,
        tags: ["licence"],
      }
    );
  }
}