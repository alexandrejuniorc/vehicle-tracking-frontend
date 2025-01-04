export const searchDirections = async (source: string, destination: string) => {
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
};
