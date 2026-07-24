import type { APIRoute } from "astro";
import { CATEGORIES } from "../../data/tools";
import { json, options } from "../../lib/http";

export const prerender = false;

const categoryEnum = CATEGORIES.map((c) => c.id);

const openapi = {
  openapi: "3.1.0",
  info: {
    title: "freestack API",
    version: "0.1.0",
    description:
      "Public JSON for the freestack directory — claim plans, tool search, and health. CORS open.",
    license: { name: "MIT" },
  },
  servers: [
    { url: "https://freestack.kuyacarlo.dev", description: "Production" },
    { url: "http://localhost:4321", description: "Local Astro" },
  ],
  tags: [
    { name: "health" },
    { name: "claim" },
    { name: "tools" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["health"],
        summary: "Service ping",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/claim": {
      get: {
        tags: ["claim"],
        summary: "Ordered claim / setup plan",
        operationId: "getClaimPlan",
        parameters: [
          {
            name: "student",
            in: "query",
            schema: { type: "string", enum: ["0", "1", "true", "false", "yes", "no"] },
            description: "Enrolled / can verify student status",
          },
          {
            name: "commercial",
            in: "query",
            schema: { type: "string", enum: ["0", "1", "true", "false", "yes", "no"] },
          },
          {
            name: "ph",
            in: "query",
            schema: { type: "string", enum: ["0", "1", "true", "false", "yes", "no"] },
            description: "Include PH campus steps",
          },
          {
            name: "ai",
            in: "query",
            schema: { type: "string", enum: ["0", "1", "true", "false", "yes", "no"] },
            description: "Include AI tooling (defaults on)",
          },
        ],
        responses: {
          "200": {
            description: "Claim plan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClaimResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["claim"],
        summary: "Ordered claim plan (JSON body)",
        operationId: "postClaimPlan",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClaimProfile" },
            },
          },
        },
        responses: {
          "200": {
            description: "Claim plan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClaimResponse" },
              },
            },
          },
          "400": {
            description: "Invalid JSON",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/tools": {
      get: {
        tags: ["tools"],
        summary: "Filter / search catalog",
        operationId: "listTools",
        parameters: [
          {
            name: "meta",
            in: "query",
            schema: { type: "string", enum: ["1"] },
            description: "If 1, return count + categories only",
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string", enum: categoryEnum },
          },
          {
            name: "cost",
            in: "query",
            schema: {
              type: "string",
              enum: ["free", "credits", "student_free", "discount"],
            },
          },
          {
            name: "student",
            in: "query",
            schema: { type: "string", enum: ["no", "required", "helps"] },
          },
          {
            name: "commercial",
            in: "query",
            schema: { type: "string", enum: ["yes", "hobby", "edu", "check"] },
          },
          { name: "q", in: "query", schema: { type: "string" } },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 200 },
          },
        ],
        responses: {
          "200": {
            description: "Tool list or meta",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ToolsResponse" },
              },
            },
          },
        },
      },
    },
    "/api/tools/{id}": {
      get: {
        tags: ["tools"],
        summary: "Single tool by id",
        operationId: "getTool",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "neon",
          },
        ],
        responses: {
          "200": {
            description: "Tool",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ToolResponse" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/openapi.json": {
      get: {
        tags: ["health"],
        summary: "This OpenAPI document",
        operationId: "getOpenApi",
        responses: {
          "200": {
            description: "OpenAPI 3.1 JSON",
            content: {
              "application/json": { schema: { type: "object" } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ClaimProfile: {
        type: "object",
        properties: {
          student: { type: "boolean" },
          commercial: { type: "boolean" },
          ph: { type: "boolean" },
          ai: { type: "boolean", description: "Defaults true if omitted on POST" },
        },
      },
      Tool: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          blurb: { type: "string" },
          category: { type: "string", enum: categoryEnum },
          cost: {
            type: "string",
            enum: ["free", "credits", "student_free", "discount"],
          },
          student: { type: "string", enum: ["no", "required", "helps"] },
          commercial: { type: "string", enum: ["yes", "hobby", "edu", "check"] },
          limits: { type: "string" },
          url: { type: "string", format: "uri" },
          tags: { type: "array", items: { type: "string" } },
          verified: { type: "string" },
        },
      },
      ClaimStep: {
        type: "object",
        properties: {
          n: { type: "string" },
          title: { type: "string" },
          why: { type: "string" },
          href: { type: "string" },
          toolIds: { type: "array", items: { type: "string" } },
          tools: {
            type: "array",
            items: { $ref: "#/components/schemas/Tool" },
          },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          service: { type: "string" },
          version: { type: "string" },
          tools: { type: "integer" },
          categories: { type: "integer" },
          endpoints: { type: "object", additionalProperties: { type: "string" } },
          site: { type: "string" },
        },
      },
      ClaimResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          profile: { $ref: "#/components/schemas/ClaimProfile" },
          warnings: { type: "array", items: { type: "string" } },
          steps: {
            type: "array",
            items: { $ref: "#/components/schemas/ClaimStep" },
          },
          stackHint: { type: "string" },
        },
      },
      ToolsResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          tools: {
            type: "array",
            items: { $ref: "#/components/schemas/Tool" },
          },
          total: { type: "integer" },
          query: { type: "object" },
          count: { type: "integer" },
          categories: { type: "array", items: { type: "object" } },
        },
      },
      ToolResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          tool: { $ref: "#/components/schemas/Tool" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          error: { type: "string" },
        },
      },
    },
  },
};

export const OPTIONS: APIRoute = () => options();

export const GET: APIRoute = () => json(openapi);
