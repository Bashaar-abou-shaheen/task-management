import React, { ReactNode } from "react";

type Props = {
  condition: boolean;
  trueComponent: ReactNode;
  falseComponent?: ReactNode;
};

export default function IF({
  condition,
  trueComponent,
  falseComponent,
}: Props) {
  if (condition) {
    return <>{trueComponent}</>;
  }

  if (falseComponent !== undefined) {
    return <>{falseComponent}</>;
  }

  return null;
}
