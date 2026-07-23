export type BookingAppointmentType = "phone" | "tour";

export type BookingSlot = {
  appointmentType?: string;
  durationMinutes?: number;
  end: string;
  id: string;
  label?: string;
  start: string;
  timezone?: string;
};

export type BookingAvailabilityRequest = {
  appointmentType: BookingAppointmentType;
  durationMinutes: number;
  flowId: string;
  flowVersion: string;
  stepMinutes?: number;
  range: {
    from: string;
    to: string;
  };
};

export type BookingAvailabilityResponse = {
  appointmentType?: string;
  calendar_checked?: boolean;
  from?: string;
  preview_mode?: boolean;
  slots: BookingSlot[];
  to?: string;
};

export type BookingRequest = {
  answers: Record<string, unknown>;
  booking: {
    durationMinutes: number;
    slot: {
      end: string;
      start: string;
      timezone?: string;
    };
    type: BookingAppointmentType;
  };
  contact: {
    email: string;
    name: string;
    phone: string;
  };
  eventId: string;
  flowId: string;
  flowVersion: string;
  source: {
    page: string;
    site: string;
  };
  tracking: Record<string, unknown>;
};

export type BookingResponse = {
  booking?: {
    eventId?: string;
    flowId?: string;
    flowVersion?: string;
    slot?: {
      end?: string;
      start?: string;
      timezone?: string;
    };
    status?: string;
  };
  confirmation_email?: {
    status: "failed" | "not_configured" | "queued";
  };
  google_calendar?: {
    eventId?: string;
    synced?: boolean;
  };
  lead?: {
    id?: string;
    leadNumber?: number | null;
    status?: string;
  };
  tracking?: {
    capi_ready?: boolean;
    eventId?: string;
    next_step?: string;
  };
};

export class BookingApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "BookingApiError";
    this.code = code;
    this.status = status;
  }
}

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new BookingApiError(`Server-Konfiguration fehlt: ${name}`, 500, "missing_config");
  }
  return value;
}

function bookingApiUrl(endpoint: "availability" | "book") {
  const baseUrl = requireEnv("CRM_BOOKING_API_URL").replace(/\/+$/, "");
  return `${baseUrl}/${endpoint}`;
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text };
  }
}

function responseErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    return typeof record.error === "string" && record.error.trim() ? record.error : fallback;
  }

  return fallback;
}

function responseErrorCode(payload: unknown) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const code = (payload as Record<string, unknown>).code;
    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

const bookingApiTimeoutMs = 15_000;

async function requestBookingApi<T>(endpoint: "availability" | "book", payload: unknown) {
  let response: Response;

  try {
    response = await fetch(bookingApiUrl(endpoint), {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${requireEnv("CRM_BOOKING_API_TOKEN")}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(bookingApiTimeoutMs)
    });
  } catch (error) {
    if (error instanceof BookingApiError) throw error;
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new BookingApiError("Booking API antwortet nicht.", 504, "timeout");
    }
    throw error;
  }

  const responsePayload = await parseJson(response);

  if (!response.ok) {
    throw new BookingApiError(
      responseErrorMessage(responsePayload, "Booking API Anfrage fehlgeschlagen."),
      response.status,
      responseErrorCode(responsePayload)
    );
  }

  return responsePayload as T;
}

export async function getBookingAvailability(payload: BookingAvailabilityRequest) {
  return requestBookingApi<BookingAvailabilityResponse>("availability", payload);
}

export async function createBooking(payload: BookingRequest) {
  return requestBookingApi<BookingResponse>("book", payload);
}

export function bookingErrorResponse(error: unknown) {
  if (error instanceof BookingApiError) {
    return Response.json(
      {
        code: error.code,
        error: error.message
      },
      { status: error.status }
    );
  }

  return Response.json({ error: "Booking API ist gerade nicht erreichbar." }, { status: 502 });
}
