// Business details used across the site. Edit these in one place.
// Values marked PLACEHOLDER need your real details before launch.

export const site = {
  name: "Rabbit Land Agribusiness",
  city: "Port Harcourt",
  region: "Rivers State",
  locationLabel: "Port Harcourt, Rivers State, Nigeria",
  pickupLabel: "Farm pickup in Port Harcourt", // PLACEHOLDER: add the pickup area/landmark
  email: "hello@rabbitland.ng", // PLACEHOLDER
  phoneDisplay: "+234 000 000 0000", // PLACEHOLDER
  phoneHref: "tel:+2340000000000", // PLACEHOLDER
  // WhatsApp number in international format, digits only (e.g. 2348012345678).
  // Can also be set with NEXT_PUBLIC_WHATSAPP_NUMBER in your .env file.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2340000000000",
};

export function whatsappLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsappNumber}${text}`;
}

// Delivery options shown at checkout. Fees are in Naira and are added to the
// order total, so the customer pays everything online in one go.
// PLACEHOLDER fees — set your real rates.
export const deliveryOptions = [
  {
    id: "pickup",
    label: "Pickup — Port Harcourt",
    description: "Collect from our farm in Port Harcourt. We'll send directions after payment.",
    fee: 0,
    needsAddress: false,
  },
  {
    id: "ph",
    label: "Delivery within Port Harcourt",
    description: "Delivered to you within Port Harcourt and environs.",
    fee: 3000,
    needsAddress: true,
  },
  {
    id: "south",
    label: "South-South & South-East",
    description: "Rivers, Bayelsa, Delta, Edo, Akwa Ibom, Cross River, Abia, Imo, Anambra, Enugu, Ebonyi.",
    fee: 8000,
    needsAddress: true,
  },
  {
    id: "nationwide",
    label: "Rest of Nigeria",
    description: "Nationwide delivery to all other states, including Lagos and Abuja.",
    fee: 15000,
    needsAddress: true,
  },
];

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];
