import { API_BASE } from "./config";

export interface FeeEstimateResponse {
  priorityBucket: {
    feerate: number;
    estimatedSeconds: number;
  };
  normalBuckets: Array<{
    feerate: number;
    estimatedSeconds: number;
  }>;
  lowBuckets: Array<{
    feerate: number;
    estimatedSeconds: number;
  }>;
}

export const getFeeEstimate = async (): Promise<FeeEstimateResponse> => {
  try {
    const response = await fetch(`${API_BASE}/info/fee-estimate`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const fees: FeeEstimateResponse = await response.json();
    return fees;

  } catch (error) {
    console.error("Failed to fetch fee estimate:", error);
    throw error;
  }
};

// Type guard to ensure the data matches the FeeEstimate interface
const isFeeEstimate = (data: any): data is FeeEstimateResponse => {
  return (
    typeof data === "object" &&
    "priorityBucket" in data &&
    "normalBuckets" in data &&
    "lowBuckets" in data &&
    Array.isArray(data.normalBuckets) &&
    Array.isArray(data.lowBuckets) &&
    typeof data.priorityBucket.feerate === "number" &&
    typeof data.priorityBucket.estimatedSeconds === "number"
  );
};
