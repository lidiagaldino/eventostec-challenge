export type TEventInputDTO = {
  title: string;
  description: string;
  date: Date;
  remote: boolean;
  img_url: string;
  event_url: string;
  owner_id: string
  partners_id?: string[]
  address?: { city: string; uf: string };
};

export type TEventPartnerInputDTO = {
  partner_username: string
  event_id: string
}

export type TEventOutputDTO = {
  id: string;
  title: string;
  description: string;
  date: Date;
  remote: boolean;
  img_url: string;
  event_url: string;
  owner_id: string
  partners_id?: string[]
  address?: { city: string; uf: string };
};
