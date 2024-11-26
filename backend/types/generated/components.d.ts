import { ProposalProposalLink } from './components.d';
import type { Schema, Attribute } from '@strapi/strapi';

export interface ProposalProposalLink extends Schema.Component {
  collectionName: 'components_proposal_proposal_links';
  info: {
    displayName: 'Proposal link';
    description: '';
  };
  attributes: {
    prop_link: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    prop_link_text: Attribute.String;
  };
}

export interface ProposalProposalWithdrawals extends Schema.Component {
  collectionName: 'components_proposal_proposal_withdrawals';
  info: {
    displayName: 'proposal_withdrawals';
  };
  attributes: {
    prop_receiving_address: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    prop_amoount: Attribute.Decimal
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'proposal.proposal-link': ProposalProposalLink;
      'proposal.proposal-withdrawals': ProposalProposalWithdrawals;
    }
  }
}
