import { randomUUID } from "crypto";
import type {
  DataStore,
  IntegrationEvent,
  IntegrationEventType,
} from "./types";

export function findSucceededEvent(
  store: DataStore,
  enrollmentId: string,
  eventType: IntegrationEventType,
) {
  return store.integrationEvents.find(
    (event) =>
      event.enrollmentId === enrollmentId &&
      event.eventType === eventType &&
      event.status === "succeeded",
  );
}

export function recordIntegrationEvent(
  store: DataStore,
  input: {
    enrollmentId: string;
    eventType: IntegrationEventType;
    payload: Record<string, unknown>;
    ok: boolean;
    error?: string;
    at: string;
  },
): IntegrationEvent {
  const existing = findSucceededEvent(
    store,
    input.enrollmentId,
    input.eventType,
  );
  if (existing) return existing;

  const event: IntegrationEvent = {
    id: randomUUID(),
    enrollmentId: input.enrollmentId,
    eventType: input.eventType,
    payload: input.payload,
    status: "pending",
    retryCount: 0,
    lastError: null,
    createdAt: input.at,
    processedAt: null,
  };

  event.status = "processing";

  if (input.ok) {
    event.status = "succeeded";
    event.processedAt = input.at;
  } else {
    event.status = "failed";
    event.lastError = input.error ?? "Handoff failed.";
    event.processedAt = input.at;
  }

  store.integrationEvents.push(event);
  return event;
}
