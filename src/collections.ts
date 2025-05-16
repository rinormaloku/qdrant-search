import { z } from "zod";

export const QdrantCollections = z.enum([
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
]);