import { NextRequest, NextResponse } from "next/server";

/* EXPOSES AN API ROUTE
 * EXAMPLE USAGE:
 * http://localhost:3333/api/routes/xxxxx
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ routeId: string }> },
) {
  const { routeId } = await params;
  const response = await fetch(`http://localhost:3333/routes/${routeId}`, {
    cache: "force-cache",
    next: { tags: [`routes-${routeId}`, "routes"] },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
