// General reusable function to get entities by any field value from any collection
async function getEntityByField(collection, field, value) {
	try {
		// Use Strapi's entity service to find many entities based on field and value
		const entities = await strapi.entityService.findMany(collection, {
			filters: { [field]: { $eq: value } }, // Dynamic field search with equality operator
		});

		if (entities.length === 0) {
			return { message: `${value} not found in ${collection}` };
		}

		return entities[0]; // Return the found entities
	} catch (error) {
		console.error('Error fetching entities:', error);
		throw new Error(
			`An error occurred while fetching the entities from ${collection}`
		);
	}
}

function extractLinksFromString(inputString) {
	const regex = /https?:\/\/[^\s]+/g; // Check urls
	const result = [];
	let match;

	// Prolazimo kroz sve podudaranja u stringu
	while ((match = regex.exec(inputString)) !== null) {
		const propLink = match[0].trim(); // URL
		result.push({
			prop_link: propLink,
			prop_link_text: propLink, // Place URL in exact fields
		});
	}

	return result;
}

module.exports = {
	async migrateCountries(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const countryList = await strapi.entityService.findMany(
			'api::country-list.country-list'
		);

		if (countryList.length > 0) {
			return {
				success: false,
				message: 'Country List already exists',
			};
		}

		for (const country of data) {
			try {
				await strapi.entityService.create(
					'api::country-list.country-list',
					{
						data: {
							country_name: country.country_name,
							alfa_2_code: country.alfa_2_code,
							alfa_3_code: country.alfa_3_code,
							publishedAt: new Date(),
						},
					}
				);
			} catch (error) {
				console.error(
					`Error creating country ${country.country_name}:`,
					error
				);
			}
		}

		return {
			success: true,
		};
	},
	async migrateCurrencies(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const currencyList = await strapi.entityService.findMany(
			'api::bd-currency-list.bd-currency-list'
		);

		if (currencyList.length > 0) {
			return {
				success: false,
				message: 'Currency List already exists',
			};
		}
		for (const currency of data) {
			try {
				await strapi.entityService.create(
					'api::bd-currency-list.bd-currency-list',
					{
						data: {
							currency_name: currency.currency_name,
							currency_letter_code: currency.currency_letter_code,
							currency_number_code: currency.currency_number_code,
							publishedAt: new Date(),
						},
					}
				);
			} catch (error) {
				console.error(
					`Error creating currency ${currency.currency_name}:`,
					error
				);
			}
		}

		return {
			success: true,
		};
	},

	async migrateContractTypes(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const contractTypeList = await strapi.entityService.findMany(
			'api::bd-contract-type.bd-contract-type'
		);

		if (contractTypeList.length > 0) {
			return {
				success: false,
				message: 'Contract Type List already exists',
			};
		}
		for (const contractType of data) {
			try {
				await strapi.entityService.create(
					'api::bd-contract-type.bd-contract-type',
					{
						data: {
							contract_type_name: contractType.contract_type_name,
							publishedAt: new Date(),
						},
					}
				);
			} catch (error) {
				console.error(
					`Error creating contract type ${contractType.contract_type_name}:`,
					error
				);
			}
		}

		return {
			success: true,
		};
	},

	async migrateRoadMap(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const roadMapList = await strapi.entityService.findMany(
			'api::bd-road-map.bd-road-map'
		);

		if (roadMapList.length > 0) {
			return {
				success: false,
				message: 'Road Map List already exists',
			};
		}
		for (const roadMap of data) {
			try {
				await strapi.entityService.create(
					'api::bd-road-map.bd-road-map',
					{
						data: {
							roadmap_name: roadMap.roadmap_name,
							publishedAt: new Date(),
						},
					}
				);
			} catch (error) {
				console.error(
					`Error creating road map ${roadMap.roadmap_name}:`,
					error
				);
			}
		}

		return {
			success: true,
		};
	},

	async migrateBdTypes(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const bdTypeList = await strapi.entityService.findMany(
			'api::bd-type.bd-type'
		);

		if (bdTypeList.length > 0) {
			return {
				success: false,
				message: 'BD Type List already exists',
			};
		}
		for (const bdType of data) {
			try {
				await strapi.entityService.create('api::bd-type.bd-type', {
					data: {
						type_name: bdType.type_name,
						publishedAt: new Date(),
					},
				});
			} catch (error) {
				console.error(
					`Error creating bd type ${bdType.type_name}:`,
					error
				);
			}
		}

		return {
			success: true,
		};
	},

	async migrateBdIntersectCommittees(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const bdIntersectCommitteesList = await strapi.entityService.findMany(
			'api::bd-intersect-committee.bd-intersect-committee'
		);

		if (bdIntersectCommitteesList.length > 0) {
			return {
				success: false,
				message: 'BD Intersect Committee List already exists',
			};
		}
		for (const committee of data) {
			try {
				await strapi.entityService.create(
					'api::bd-intersect-committee.bd-intersect-committee',
					{
						data: {
							committee_name: committee.committee_name,
							publishedAt: new Date(),
						},
					}
				);
			} catch (error) {
				console.error(
					`Error creating intersect committee ${committee.committee_name}:`,
					error
				);
			}
		}

		return {
			success: true,
		};
	},

	async migrateSubmissions(ctx) {
		// @ts-ignore
		const body = ctx.request.body;

		const data = body?.data;

		const formattedJson = data?.map((item) => ({
			'api::bd-contact-information.bd-contact-information': {
				be_full_name:
					`${item?.['Beneficiary First Name']} ${item?.['Beneficiary Last Name']}`?.replace(
						/\u200B/g,
						''
					),
				be_email: item?.['Beneficiary Email']?.replace(/\u200B/g, ''),
				be_country_of_res: item?.[
					'Beneficiary Country of Residence'
				]?.replace(/\u200B/g, ''),
				be_nationality: item?.['Beneficiary Nationality']?.replace(
					/\u200B/g,
					''
				),
				submission_lead_full_name:
					`${item?.['Submission Lead First Name']} ${item?.['Submission Lead Last Name']}`?.replace(
						/\u200B/g,
						''
					),
				submission_lead_email: item?.['Submission Lead Email']?.replace(
					/\u200B/g,
					''
				),
			},
			'api::bd-proposal-ownership.bd-proposal-ownership': {
				agreed: true,
				submited_on_behalf: item?.[
					'Is this proposal being submitted on behalf of an individual (the beneficiary), company, or some other group?'
				]?.replace(/\u200B/g, ''),
				company_name: item?.['Company Name']?.replace(/\u200B/g, ''),
				company_domain_name: item?.['Company Domain Name']?.replace(
					/\u200B/g,
					''
				),
				be_country: item?.['Country of Incorporation']?.replace(
					/\u200B/g,
					''
				),
				group_name: item?.['Group Name']?.replace(/\u200B/g, ''),
				type_of_group: item?.['Type of Group']?.replace(/\u200B/g, ''),
				key_info_to_identify_group: item?.[
					'Key Information to Identify Group'
				]?.replace(/\u200B/g, ''),
				proposal_public_champion: item?.[
					'<strong>Proposal Public Champion</strong>: Who would you like to be the public proposal champion?'
				]?.replace(/\u200B/g, ''),
				social_handles: item?.[
					'What social handles would you like to be used? E.g. Github, X'
				]?.replace(/\u200B/g, ''),
			},
			'api::bd-psapb.bd-psapb': {
				problem_statement: item?.[
					'<strong>Problem Statement</strong>: What problem does this proposal seek to address?'
				]?.replace(/\u200B/g, ''),
				proposal_benefit: item?.[
					'<strong>Proposal Benefit</strong>: &#xa0;If implemented, what would be the benefit and to which parts of the community? Please include the demonstrated value or return on investment to the Cardano Community.'
				]?.replace(/\u200B/g, ''),
				roadmap_name: item?.[
					'Does this proposal align to the Product Roadmap and Roadmap Goals?'
				]?.replace(/\u200B/g, ''),
				type_name: item?.[
					'Does your proposal align to any of the categories listed below?'
				]?.replace(/\u200B/g, ''),
				committee_name: item?.[
					'<strong>Committee Alignment</strong>: Which of the Intersect Committees does your proposal align to?'
				]?.replace(/\u200B/g, ''),
				supplementary_endorsement: item?.[
					'<strong>Supplementary Endorsement</strong>: If possible provide evidence of wider community endorsement for this proposal?'
				]?.replace(/\u200B/g, ''),
				explain_proposal_roadmap: item?.[
					'Please explain how your proposal supports the Product Roadmap.'
				]?.replace(/\u200B/g, ''),
			},
			'api::bd-proposal-detail.bd-proposal-detail': {
				proposal_name: item?.[
					'<strong>Proposal Name</strong>: What is your proposed name to be used to reference this proposal publicly?'
				]?.replace(/\u200B/g, ''),
				proposal_description: item?.[
					'<strong>Proposal Description</strong>: Please provide a high-level description / abstract of the proposal (2500 words max).'
				]?.replace(/\u200B/g, ''),
				key_dependencies: item?.[
					'<strong>Dependencies</strong>: Please list any key dependencies (if any) for this proposal? These can be internal or external to the proposal.'
				]?.replace(/\u200B/g, ''),
				maintain_and_support: item?.[
					'<strong>Maintenance</strong>: How will this proposal be maintained and supported after initial development?'
				]?.replace(/\u200B/g, ''),
				key_proposal_deliverables: item?.[
					'<strong>Key Proposal Deliverable(s) and Definition of Done:</strong> What tangible milestones or outcomes are to be delivered and what will the community ultimately receive?*'
				]?.replace(/\u200B/g, ''),
				resourcing_duration_estimates: item?.[
					'<strong>Resourcing &amp; Duration Estimates</strong>: Please provide estimates of team size and duration to achieve the Key Proposal Deliverables outlined above.'
				]?.replace(/\u200B/g, ''),
				experience: item?.[
					'<strong>Experience</strong>: Please provide previous experience relevant to complete this project.'
				]?.replace(/\u200B/g, ''),
				contract_type_name: item?.[
					'<strong>Contracting</strong>: Please describe how you expect to be contracted.'
				]?.replace(/\u200B/g, ''),
				other_contract_type: item?.[
					'Please describe what you have in mind.'
				]?.replace(/\u200B/g, ''),
			},
			'api::bd-costing.bd-costing': {
				preferred_currency: item?.['Preferred Currency']?.replace(
					/\u200B/g,
					''
				),
				amount_in_preferred_currency:
					item?.['Amount in preferred currency'],
				usd_to_ada_conversion_rate:
					item?.['USD to ADA Conversion Rate'],
				ada_amount: item?.['ADA Amount'],
				cost_breakdown: item?.[
					'<strong>Cost breakdown</strong>: Based on your preferred contract type and cost estimate, please provide a cost breakdown in ada and in USD.'
				]?.replace(/\u200B/g, ''),
			},
			'api::bd-further-information.bd-further-information': {
				proposal_links: extractLinksFromString(
					item?.[
						'<strong>Further Information</strong>: Please link to any supplementary information on this proposal to help aid knowledge sharing.'
					]?.replace(/\u200B/g, '')
				),
			},
			'api::bd.bd': {
				is_active: true,
				privacy_policy: true,
				intersect_named_administrator:
					item?.[
						"<strong>Administration and Auditing</strong>: A successful proposal requires an Administrator. To ensure transparency and accuracy, audits may also be undertaken.<br><br>Intersect's role as an administrator, through our committees and internal operational function, would consist of the following:<br>- Contract management&#xa0;<br>- Delivery assurance and Communications&#xa0;<br>- Fund management&#xa0;<br>- Fiat conversion&#xa0;<br>- Legal<br>- KYC / KYB<br>- Dispute resolution&#xa0;<br>- Technical and Financial auditing<br><br>Would you like Intersect to be your named Administrator, including acting as the auditor, as per the Cardano Constitution?"
					]?.replace(/\u200B/g, '') === 'Yes'
						? true
						: false,
			},
		}));

		try {
			for (const item of formattedJson) {
				let bdRelationIds = [{}];
				let bdData = {};

				for (const [key, value] of Object.entries(item)) {
					let collectionApiName = key;
					let collectionData = value;

					if (collectionData.hasOwnProperty('be_country_of_res')) {
						let entityValue = collectionData['be_country_of_res'];

						if (!entityValue) {
							collectionData['be_country_of_res'] = null;
						} else {
							let entity = await getEntityByField(
								'api::country-list.country-list',
								'country_name',
								collectionData['be_country_of_res']
							);

							if (!entity?.message) {
								collectionData['be_country_of_res'] =
									entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('be_nationality')) {
						let entityValue = collectionData['be_nationality'];

						if (!entityValue) {
							collectionData['be_nationality'] = null;
						} else {
							let entity = await getEntityByField(
								'api::country-list.country-list',
								'country_name',
								collectionData['be_nationality']
							);

							if (!entity?.message) {
								collectionData['be_nationality'] = entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('be_country')) {
						let entityValue = collectionData['be_country'];

						if (!entityValue) {
							collectionData['be_country'] = null;
						} else {
							let entity = await getEntityByField(
								'api::country-list.country-list',
								'country_name',
								collectionData['be_country']
							);

							if (!entity?.message) {
								collectionData['be_country'] = entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('roadmap_name')) {
						let entityValue = collectionData['roadmap_name'];

						if (!entityValue) {
							collectionData['roadmap_name'] = null;
						} else {
							let entity = await getEntityByField(
								'api::bd-road-map.bd-road-map',
								'roadmap_name',
								collectionData['roadmap_name']
							);

							if (!entity?.message) {
								collectionData['roadmap_name'] = entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('type_name')) {
						let entityValue = collectionData['type_name'];

						if (!entityValue) {
							collectionData['type_name'] = null;
						} else {
							let entity = await getEntityByField(
								'api::bd-type.bd-type',
								'type_name',
								collectionData['type_name']
							);

							if (!entity?.message) {
								collectionData['type_name'] = entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('committee_name')) {
						let entityValue = collectionData['committee_name'];

						if (!entityValue) {
							collectionData['committee_name'] = null;
						} else {
							let entity = await getEntityByField(
								'api::bd-intersect-committee.bd-intersect-committee',
								'committee_name',
								collectionData['committee_name']
							);

							if (!entity?.message) {
								collectionData['committee_name'] = entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('contract_type_name')) {
						let entityValue = collectionData['contract_type_name'];

						if (!entityValue) {
							collectionData['contract_type_name'] = null;
						} else {
							let entity = await getEntityByField(
								'api::bd-contract-type.bd-contract-type',
								'contract_type_name',
								collectionData['contract_type_name']
							);

							if (!entity?.message) {
								collectionData['contract_type_name'] =
									entity?.id;
							}
						}
					}

					if (collectionData.hasOwnProperty('preferred_currency')) {
						let entityValue = collectionData['preferred_currency'];

						if (!entityValue) {
							collectionData['preferred_currency'] = null;
						} else {
							let entity = await getEntityByField(
								'api::bd-currency-list.bd-currency-list',
								'currency_letter_code',
								collectionData['preferred_currency']
							);

							if (!entity?.message) {
								collectionData['preferred_currency'] =
									entity?.id;
							}
						}
					}

					if (collectionApiName !== 'api::bd.bd') {
						let createdCollectionData =
							await strapi.entityService.create(
								// @ts-ignore
								collectionApiName,
								{
									data: collectionData,
								}
							);

						if (createdCollectionData?.id) {
							let fieldName = collectionApiName
								.split('::')[1]
								.split('.')[0]
								.replace(/-/g, '_');

							bdRelationIds.push({
								[fieldName]: createdCollectionData.id,
							});
						}
					} else {
						bdData = collectionData;
					}
				}

				const createdBd = await strapi.entityService.create(
					'api::bd.bd',
					{
						data: {
							...bdData,
							...bdRelationIds.reduce(
								(acc, obj) => ({ ...acc, ...obj }),
								{}
							),
						},
					}
				);

				if (createdBd?.id) {
					//create bd poll
					await strapi.entityService.create('api::bd-poll.bd-poll', {
						data: {
							bd_proposal_id: createdBd?.id?.toString(),
							poll_yes: 0,
							poll_no: 0,
							is_poll_active: true,
						},
					});
				}
			}
		} catch (error) {
			console.log(error?.details?.errors);
			return console.error(error);
		}

		return {
			success: true,
		};
	},
};
