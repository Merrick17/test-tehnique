export type TimeWindow = {
  startMinute: number;
  endMinute: number;
};

export type DeliveryInput = {
  clientId: string;
  verticalId: string;
  minAge: number;
  maxAge: number;
  dailyCapacity: number;
  pricePerLead: number;
  isActive?: boolean;
  postalCodes: string[];
  timeWindows: TimeWindow[];
};

export type Delivery = DeliveryInput & {
  id: string;
  client: { id: string; name: string };
  vertical: { id: string; name: string };
  postalCodes: { id: string; postalCode: string }[];
  timeWindows: (TimeWindow & { id: string })[];
};