import { MapNewRoute } from "./_components/map-new-route";
import { NewRouteForm } from "./_components/new-route-form";

type SearchParams = { source: string; destination: string };

interface NewRoutePageProps {
  searchParams: Promise<SearchParams>;
}

export async function searchDirections(source: string, destination: string) {
  const BASE_URL = "http://localhost:3333";

  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(`${BASE_URL}/places?text=${source}`, {
      cache: "force-cache",
      next: { revalidate: 1 * 60 * 60 * 24 }, // 1 day
    }),
    fetch(`${BASE_URL}/places?text=${destination}`, {
      cache: "force-cache",
      next: { revalidate: 1 * 60 * 60 * 24 }, // 1 day
    }),
  ]);

  if (!sourceResponse.ok) {
    throw new Error("Failed to fetch source data");
  }

  if (!destinationResponse.ok) {
    throw new Error("Failed to fetch destination data");
  }

  const [sourceData, destinationData] = await Promise.all([
    sourceResponse.json(),
    destinationResponse.json(),
  ]);

  const placeSourceId = sourceData.candidates[0].place_id;
  const placeDestinationId = destinationData.candidates[0].place_id;

  // use fetch to get data in next.js
  const directionsResponse = await fetch(
    `${BASE_URL}/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`,
  );

  if (!directionsResponse.ok) {
    throw new Error("Failed to fetch directions data");
  }

  const directionsData = await directionsResponse.json();

  return {
    directionsData,
    placeSourceId,
    placeDestinationId,
  };
}

export default async function NewRoutePage({
  searchParams,
}: NewRoutePageProps) {
  const { source, destination } = await searchParams;

  const result =
    source && destination ? await searchDirections(source, destination) : null;

  let directionsData = null;
  let placeSourceId = null;
  let placeDestinationId = null;

  if (result) {
    directionsData = result.directionsData;
    placeSourceId = result.placeSourceId;
    placeDestinationId = result.placeDestinationId;
  }

  return (
    <div className="flex h-full w-full flex-1">
      <div className="h-full w-1/3 p-4">
        <h4 className="mb-2 text-3xl text-contrast">Nova rota</h4>

        <form className="flex flex-col space-y-4" method="get">
          <div className="relative">
            <input
              id="source"
              name="source"
              type="search"
              placeholder=""
              defaultValue={source}
              className="border-contrast focus:border-primary peer block w-full appearance-none rounded-t-lg border-0 border-b-2 bg-default px-2.5 pb-2.5 pt-5 text-sm text-contrast focus:outline-none focus:ring-0"
            />

            <label
              htmlFor="source"
              className="peer-focus:text-secondary absolute start-2.5 top-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-contrast duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Origem
            </label>
          </div>

          <div className="relative">
            <input
              id="destination"
              name="destination"
              type="search"
              placeholder=""
              defaultValue={destination}
              className="border-contrast focus:border-primary peer block w-full appearance-none rounded-t-lg border-0 border-b-2 bg-default px-2.5 pb-2.5 pt-5 text-sm text-contrast focus:outline-none focus:ring-0"
            />
            <label
              htmlFor="destination"
              className="peer-focus:text-secondary absolute start-2.5 top-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-contrast duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              Destino
            </label>
          </div>

          <button
            type="submit"
            className="rounded bg-main p-2 text-xl font-bold text-primary"
          >
            Pesquisar
          </button>
        </form>

        {directionsData && (
          <div className="mt-4 rounded border p-4 text-contrast">
            <ul>
              <li className="mb-2">
                <strong>Origem:</strong>{" "}
                {directionsData.routes[0].legs[0].start_address}
              </li>

              <li className="mb-2">
                <strong>Destino:</strong>{" "}
                {directionsData.routes[0].legs[0].end_address}
              </li>

              <li className="mb-2">
                <strong>Distância:</strong>{" "}
                {directionsData.routes[0].legs[0].distance.text}
              </li>

              <li className="mb-2">
                <strong>Duração:</strong>{" "}
                {directionsData.routes[0].legs[0].duration.text}
              </li>
            </ul>

            <NewRouteForm>
              {placeSourceId && (
                <input
                  type="hidden"
                  name="sourceId"
                  defaultValue={placeSourceId}
                />
              )}

              {placeDestinationId && (
                <input
                  type="hidden"
                  name="destinationId"
                  defaultValue={placeDestinationId}
                />
              )}

              <button
                type="submit"
                className="mt-4 rounded bg-main p-2 font-bold text-primary"
              >
                Adicionar rota
              </button>
            </NewRouteForm>
          </div>
        )}
      </div>

      <MapNewRoute directionsData={directionsData} />
    </div>
  );
}
