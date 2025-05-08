'use strict';

module.exports = {
  async generateSnapShootReport(ctx) {
    try {
      		let { startDate, endDate } = ctx.query;
      		if (!startDate) {
      			startDate = '2020-01-01';
      		}
      		if (!endDate) {
      			endDate = new Date().toISOString();
      		}
          let report = [];
          const allPolls = await strapi.entityService.findMany('api::bd-poll.bd-poll', {
				  filters: {
					  createdAt: {
						  $gte: startDate,
						  $lt: endDate,
					  },
				  },
          populate: ['bd-poll-vote'],
			  });
        if (Array.isArray(allPolls)) {
        for (let poll of allPolls) {
          const bd = await strapi.entityService.findMany('api::bd.bd', { 
            filters: 
            {$and:[
            { master_id: poll.bd_proposal_id },
            { createdAt: {
              $gte: startDate,
              $lt: endDate,
            }}]
          },
          populate: ['bd_costing','bd_psapb','bd_proposal_detail','creator',
            'bd_further_information','bd_proposal_ownership','bd_psapb','bd_psapb'],
          sort: ['createdAt:desc'],
          limit: 1
          });
          const allVotes = await strapi.entityService.findMany('api::bd-poll-vote.bd-poll-vote', { 
           filters: 
           {$and:[
           { bd_poll_id: poll.id },
           { createdAt: {
             $gte: startDate,
             $lt: endDate,
           }}]
          }});
          const allComments = await strapi.entityService.findMany('api::comment.comment',{
            filters: {
            $and: [
              {
                bd_proposal_id: poll.bd_proposal_id,
              },             
            ]}
          });

          bd[0].comments = JSON.stringify(allComments)||[];
          bd[0].votes = JSON.stringify(allVotes)||[];
          const votes = allVotes.reduce((acc, vote) => {
            const votingPower = Number(vote.drep_voting_power);
            if (vote.vote_result) {
              acc.true = (acc.true || 0) + votingPower;
              acc.yes = (acc.yes || 0) + 1;
            } else {
              acc.false = (acc.false || 0) + votingPower;
              acc.no = (acc.no || 0) + 1;
            }
            acc.total = (acc.total || 0) + votingPower;
            return acc;
          }, {});
        
          bd[0].total_votes = allVotes.length || 0;
          bd[0].total_voting_power = votes.total || 0;
          bd[0].total_yes_votes = votes.yes || 0;
          bd[0].total_yes_voting_power = votes.true || 0;
          bd[0].total_no_votes = votes.no || 0;
          bd[0].total_no_voting_power = votes.false || 0;
          bd[0].votes = JSON.stringify(allVotes)||[];
          report.push(bd[0]);
        }
      }
      ctx.send(report);
    } catch (err) {
      ctx.throw(500, 'Došlo je do greške prilikom generisanja izveštaja.', err);
    }
  },
};






//'use strict';
//const crypto = require('crypto');
/**
 * reports controller
 */

//const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = ( 
// 	({ strapi }) => ({
// 		async getBdSnapshot(ctx) {
// 			let { startDate, endDate } = ctx.query;
// 			if (!startDate) {
// 				startDate = '2020-01-01';
// 			}
// 			if (!endDate) {
// 				endDate = new Date().toISOString();
// 			}
			
// 			const allPolls = await strapi.entityService.findMany('api::bd-poll.bd-poll', {
// 				filters: {
// 					createdAt: {
// 						$gte: startDate,
// 						$lt: endDate,
// 					},
// 				}
// 			});
// 			let report = [];
// 			// @ts-ignore
// 			for (let poll of allPolls) {
// 				const bd = await strapi.entityService.findMany('api::bd.bd', { 
// 					filters: 
// 					{$and:[
// 					{ master_id: poll.bd_proposal_id },
// 					{ createdAt: {
// 						$gte: startDate,
// 						$lt: endDate,
// 					}}]
// 				 },
// 				populate: ['bd_costing.preferred_currency',
// 						   'bd_psapb.type_name',
// 						   'bd_proposal_detail.contract_type_name',
// 						   'creator',
// 						   'bd_further_information.proposal_links',
// 						   'bd_proposal_ownership.be_country',
// 						   'bd_psapb.roadmap_name',
// 						   'bd_psapb.committee_name'
// 				],
// 				sort: ['createdAt:desc'],
// 				limit: 1
// 				});

// 				const allDreps = await strapi.entityService.findMany('api::drep.drep', { 
// 					filters: 
// 					{$and:[
// 					{ hashRaw: bd[0].drep_id },
// 					{ createdAt: {
// 						$gte: startDate,
// 						$lt: endDate,
// 					}}]
// 				 }});
 				// const allVotes = await strapi.entityService.findMany('api::bd-poll-vote.bd-poll-vote', { 
 				// 	filters: 
 				// 	{$and:[
 				// 	{ bd_poll_id: poll.id },
 				// 	{ createdAt: {
 				// 		$gte: startDate,
 				// 		$lt: endDate,
 				// 	}}]
 				//  }});
// 				const allComments = await strapi.entityService.findMany('api::comment.comment',{
// 					filters: {
// 					$and: [
// 						{
// 							bd_proposal_id: poll.bd_proposal_id,
// 						},
// 						{
// 							createdAt: {
// 								$gte: startDate,
// 								$lt: endDate,
// 							},
// 						},
// 					]}
// 				});

// 			}	






			
		
// 			const proposalsIds = allPolls.map((p) => p?.attributes?.bd_proposal_id);
		
// 			const bdsData = await strapi.entityService.findMany('api::bd.bd', {
// 				filters: {
// 				$and: [
// 					{
// 						master_id: {
// 							$in: proposalsIds,
// 						},
// 					},
// 					{
// 						createdAt: {
// 							$gte: startDate,
// 							$lt: endDate,
// 						},
// 					}
// 				],

// 				},
// 				sort: ['createdAt:desc'],

// 			})
		
// 			// 1. jedinstveni dRep-ovi
// 			// const uniqueDreps = [
// 			//   ...new Set(allVotes?.map((v) => v.attributes?.drep_id)),
// 			// ];
		
// 			// 2. podela na dva bloka (prva–druga polovina)
// 			// const mid = Math.ceil(uniqueDreps.length / 2);
// 			// const drepsChunks = [uniqueDreps.slice(0, mid), uniqueDreps.slice(mid)];
		
// 			/** helper – napravi URL sa „identifiers" query-stringom */
// 			const makeUrl = (ids) => {
// 			  const params = new URLSearchParams();
// 			  ids.forEach((id) => params.append("identifiers", id));
// 			  const govtoolURL = "https://be.gov.tools";
// 			  return `${govtoolURL}/drep/voting-power-list?${params.toString()}`;
// 			};
		
// 			// 3. paralelno pogodimo API za oba bloka
// 			// const [drepsA, drepsB] = await Promise.all(
// 			//   drepsChunks.map((chunk) =>
// 			// 	fetch(makeUrl(chunk), { method: "GET" }).then((res) => res.json())
// 			//   )
// 			// );
		
// 			// 4. spojimo rezultate u jednu listu
// 			// const allDreps = [...drepsA, ...drepsB];
		
// 			// const finalResponse = [];
		
// 			// for (let proposal of bdsData) {
// 			//   if (proposal.bd_costing.data.attributes.ada_amount) {
// 			// 	proposal.attributes.bd_costing.data.attributes.ada_amount =
// 			// 	  +proposal.attributes.bd_costing.data.attributes.ada_amount;
// 			//   }
		
// 			//   if (
// 			// 	proposal.attributes.bd_costing.data.attributes
// 			// 	  .amount_in_preferred_currency
// 			//   ) {
// 			// 	proposal.attributes.bd_costing.data.attributes.amount_in_preferred_currency =
// 			// 	  +proposal.attributes.bd_costing.data.attributes
// 			// 		.amount_in_preferred_currency;
// 			//   }
		
// 			//   if (
// 			// 	proposal.attributes.bd_costing.data.attributes
// 			// 	  .usd_to_ada_conversion_rate
// 			//   ) {
// 			// 	proposal.attributes.bd_costing.data.attributes.usd_to_ada_conversion_rate =
// 			// 	  +proposal.attributes.bd_costing.data.attributes
// 			// 		.usd_to_ada_conversion_rate;
// 			//   }
		
// 			//   let comments = allComments?.filter(
// 			// 	(comment) =>
// 			// 	  comment?.attributes?.bd_proposal_id?.toString() ===
// 			// 	  proposal?.id?.toString()
// 			//   );
		
// 			//   comments = comments?.map((comment) => {
// 			// 	return cleanObject(comment);
// 			//   });
		
// 			//   const parentComments = comments?.filter(
// 			// 	(comment) => comment?.comment_parent_id === null
// 			//   );
		
// 			//   parentComments?.map((parentComment) => {
// 			// 	const replies = comments?.filter(
// 			// 	  (comment) =>
// 			// 		comment?.comment_parent_id?.toString() ===
// 			// 		parentComment?.id?.toString()
// 			// 	);
// 			// 	parentComment.replies = replies;
// 			//   });
		
// 			//   const poll = allPolls?.filter(
// 			// 	(poll) =>
// 			// 	  poll?.attributes?.bd_proposal_id?.toString() ===
// 			// 	  proposal?.id?.toString()
// 			//   )[0];
		
// 			//   let votes = allVotes?.filter(
// 			// 	(vote) =>
// 			// 	  vote?.attributes?.bd_poll_id?.toString() === poll?.id?.toString()
// 			//   );
		
// 			//   votes = votes?.map((vote) => {
// 			// 	return cleanObject(vote);
// 			//   });
		
// 			//   votes?.map((vote) => {
// 			// 	if (vote?.drep_id) {
// 			// 	  const drep = allDreps?.find(
// 			// 		(drep) => drep?.hashRaw === vote?.drep_id
// 			// 	  );
// 			// 	  vote.drep = drep;
// 			// 	}
// 			//   });
		
// 			//   const yesVotes = votes?.filter((vote) => vote?.vote_result === true);
// 			//   const noVotes = votes?.filter((vote) => vote?.vote_result === false);
		
// 			//   proposal = cleanObject(proposal);
		
// 			//   if (proposal.bd_further_information.proposal_links) {
// 			// 	proposal.bd_further_information.proposal_links = JSON.stringify(
// 			// 	  proposal.bd_further_information.proposal_links
// 			// 	);
// 			//   }
		
// 			//   finalResponse.push({
// 			// 	...proposal,
// 			// 	comments: JSON.stringify(comments),
// 			// 	total_votes: votes?.length,
// 			// 	total_voting_power: sumVotingPower(
// 			// 	  allDreps?.filter((drep) =>
// 			// 		votes?.some((vote) => vote?.drep_id === drep?.hashRaw)
// 			// 	  )
// 			// 	),
// 			// 	total_yes_votes: yesVotes?.length,
// 			// 	total_yes_voting_power: sumVotingPower(
// 			// 	  allDreps?.filter((drep) =>
// 			// 		yesVotes?.some((vote) => vote?.drep_id === drep?.hashRaw)
// 			// 	  )
// 			// 	),
// 			// 	total_no_votes: noVotes?.length,
// 			// 	total_no_voting_power: sumVotingPower(
// 			// 	  allDreps?.filter((drep) =>
// 			// 		noVotes?.some((vote) => vote?.drep_id === drep?.hashRaw)
// 			// 	  )
// 			// 	),
// 			// 	votes: JSON.stringify({
// 			// 	  yes_votes: yesVotes,
// 			// 	  no_votes: noVotes,
// 			// 	}),
// 			//   });
// 			// }
		
// 			// return finalResponse;


			
// 			return ctx.send({ report });
// 		}
// 	}
// ))