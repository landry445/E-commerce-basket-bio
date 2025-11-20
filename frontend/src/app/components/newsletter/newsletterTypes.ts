export type Subscriber = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type BasketItemForm = {
  label: string;
  price: string;
};

export type NewsletterFormData = {
  subject: string;
  pickupDateISO: string;
  basket10Items: BasketItemForm[];
  basket15Items: BasketItemForm[];
};

export type SendResult = {
  sent: number;
};

export type NewsletterRenderMode = "preview" | "email";
