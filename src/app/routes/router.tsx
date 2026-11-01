import { createBrowserRouter, Navigate } from "react-router";

import { OrderPage } from "@/app/routes/lazyPages";

import { environment } from "@/constants/environment";

import { ErrorPage } from "@/components/ErrorPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/order" replace />,
    },
    {
      path: "/order",
      element: <OrderPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ],
  {
    basename: environment.routerBasename,
  },
);
