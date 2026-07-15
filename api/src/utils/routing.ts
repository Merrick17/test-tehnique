import { calculateAge } from "./age";
import { dateToMinuteOfDay } from "./time";

type LeadInput = {
  birthDate: Date;
  postalCode: string;
  verticalId: string;
  receivedAt: Date;
};

type CandidateDelivery = {
  id: string;
  verticalId: string;
  minAge: number;
  maxAge: number;
  dailyCapacity: number;
  pricePerLead: number;
  isActive: boolean;
  distributedToday: number;
  postalCodes: Array<{
    postalCode: string;
  }>;
  timeWindows: Array<{
    startMinute: number;
    endMinute: number;
  }>;
};

export const isDeliveryEligible = (
  lead: LeadInput,
  delivery: CandidateDelivery
): boolean => {
  if (!delivery.isActive) {
    return false;
  }

  if (
    delivery.verticalId !==
    lead.verticalId
  ) {
    return false;
  }

  const age = calculateAge(
    lead.birthDate,
    lead.receivedAt
  );

  if (
    age < delivery.minAge ||
    age > delivery.maxAge
  ) {
    return false;
  }

  const acceptsPostalCode =
    delivery.postalCodes.some(
      (item) =>
        item.postalCode ===
        lead.postalCode
    );

  if (!acceptsPostalCode) {
    return false;
  }

  const receivedMinute =
    dateToMinuteOfDay(
      lead.receivedAt
    );

  const acceptsTime =
    delivery.timeWindows.some(
      (window) =>
        receivedMinute >=
          window.startMinute &&
        receivedMinute <
          window.endMinute
    );

  if (!acceptsTime) {
    return false;
  }

  return (
    delivery.distributedToday <
    delivery.dailyCapacity
  );
};

export const sortEligibleDeliveries = <
  T extends {
    id: string;
    pricePerLead: number;
    distributedToday: number;
  }
>(
  deliveries: T[]
): T[] => {
  return [...deliveries].sort(
    (a, b) => {
      if (
        a.pricePerLead !==
        b.pricePerLead
      ) {
        return (
          b.pricePerLead -
          a.pricePerLead
        );
      }

      if (
        a.distributedToday !==
        b.distributedToday
      ) {
        return (
          a.distributedToday -
          b.distributedToday
        );
      }

      return a.id.localeCompare(b.id);
    }
  );
};
