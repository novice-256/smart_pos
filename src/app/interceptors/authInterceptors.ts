import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../auth";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

export const authInterceptors: HttpInterceptorFn = (request, next) => {
    // 1. Inject everything at the top level
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

   
    let req = request;
    if (token) {
        req = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            switch (error.status) {
                case 401:
                    authService.logout();
                    console.warn("Unauthorized - Redirecting to login...");
                    router.navigate(['/login']);
                    break;

                case 403:
                    router.navigate(['/unauthorized']);
                    break;

                case 404:
                    router.navigate(['/not-found']);
                    break;

                case 500:
                    // Only navigate if it's a critical failure
                    router.navigate(['/serverdown']);
                    break;
            }

            // Always re-throw the error so the Component knows it failed
            return throwError(() => error);
        })
    );
};