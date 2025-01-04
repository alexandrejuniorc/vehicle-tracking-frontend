"use client";

import { PropsWithChildren, useActionState } from "react";
import { createRouteAction } from "../_actions/create-route.action";

interface UseActionStateProps {
  error?: string;
  success?: boolean;
}
type UseActionState = UseActionStateProps | null;

export const NewRouteForm = (props: PropsWithChildren) => {
  const [state, formAction] = useActionState<UseActionState, FormData>(
    createRouteAction,
    null,
  );

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="bg-error rounded border p-4 text-contrast">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-success rounded border p-4 text-contrast">
          Rota criada com sucesso!
        </div>
      )}

      {props.children}
    </form>
  );
};
