import { z } from "zod";

export function createQdrantCollectionsEnum(collections: string[]) {
  const collectionsToUse = collections.length > 0 ? collections : defaultCollections;
  return z.enum(collectionsToUse as [string, ...string[]]);
}

// Default collections for backward compatibility
const defaultCollections = [
  "ambient",
  "argo",
  "argo-rollouts",
  "cilium",
  "gateway-api",
  "gloo-edge",
  "gloo-gateway",
  "gloo-mesh-core",
  "gloo-mesh-enterprise",
  "helm",
  "istio",
  "kgateway",
  "kubernetes",
  "otel",
  "prometheus",
  "github-gloo-mesh-enterprise",
  "github-istio",
  "github-solo-projects",
  "github-solo-reference-architectures",
];