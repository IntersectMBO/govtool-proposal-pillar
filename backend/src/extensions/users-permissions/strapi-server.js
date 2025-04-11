// @ts-nocheck
'use strict';
const utils = require('@strapi/utils');
const { ApplicationError, ValidationError } = utils.errors;
const { sanitize } = utils;
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const {
	COSESign1,
	COSEKey,
	BigNum,
	Label,
	Int,
} = require('@emurgo/cardano-message-signing-nodejs');
const {
	Ed25519Signature,
	PublicKey,
} = require('@emurgo/cardano-serialization-lib-nodejs');

const sanitizeUser = (user, ctx) => {
	const { auth } = ctx.state;
	const userSchema = strapi.getModel('plugin::users-permissions.user');

	return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getService = (name) => {
	return strapi.plugin('users-permissions').service(name);
};

// issue a JWT
const issueJWT = (payload, jwtOptions = {}) => {
	_.defaults(jwtOptions, strapi.config.get('plugin.users-permissions.jwt'));
	return jwt.sign(
		_.clone(payload.toJSON ? payload.toJSON() : payload),
		strapi.config.get('plugin.users-permissions.jwtSecret'),
		jwtOptions
	);
};

// verify the refreshToken by using the REFRESH_SECRET from the .env
const verifyRefreshToken = (token) => {
	return new Promise(function (resolve, reject) {
		jwt.verify(
			token,
			process.env.REFRESH_SECRET,
			{},
			function (err, tokenPayload = {}) {
				if (err) {
					return reject(new Error('Invalid token.'));
				}
				resolve(tokenPayload);
			}
		);
	});
};

// issue a Refresh token
const issueRefreshToken = (payload, jwtOptions = {}) => {
	_.defaults(jwtOptions, strapi.config.get('plugin.users-permissions.jwt'));
	return jwt.sign(
		_.clone(payload.toJSON ? payload.toJSON() : payload),
		process.env.REFRESH_SECRET,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
	);
};

module.exports = (plugin) => {
	plugin.controllers.auth.callback = async (ctx) => {
		const provider = ctx.params.provider || 'local';
		const params = ctx.request.body;

		const store = strapi.store({
			type: 'plugin',
			name: 'users-permissions',
		});
		const grantSettings = await store.get({ key: 'grant' });

		const grantProvider = provider === 'local' ? 'email' : provider;

		if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
			throw new ApplicationError('This provider is disabled');
		}

		if (provider === 'local') {
			const { identifier, signedData } = params;

			let userInfo = ctx?.state?.user;

			if (!identifier) {
				throw new ValidationError('identifier was not provided');
			}

			if (!signedData) {
				throw new ValidationError('signData object was not provided');
			}

			const decoded = COSESign1.from_bytes(
				Buffer.from(signedData.signature, 'hex')
			);
			const key = COSEKey.from_bytes(Buffer.from(signedData.key, 'hex'));
			const pubKeyBytes = key
				.header(Label.new_int(Int.new_negative(BigNum.from_str('2'))))
				.as_bytes();
			const publicKey = PublicKey.from_bytes(pubKeyBytes);
			const signature = Ed25519Signature.from_bytes(decoded.signature());
			const receivedData = decoded.signed_data().to_bytes();

			// Remove network id from identifier
			const rawKeyHash = userInfo ? identifier : identifier.slice(2);

			const isVerified =
				publicKey.verify(receivedData, signature) &&
				rawKeyHash === publicKey.hash().to_hex();

			if (!isVerified) {
				throw new ApplicationError('Verification failed');
			}

			const user = await strapi
				.query('plugin::users-permissions.user')
				.findOne({
					where: {
						provider,
						$or: [
							{
								email: userInfo
									? userInfo?.username?.toLowerCase()
									: identifier?.toLowerCase(),
							},
							{
								username: userInfo
									? userInfo?.username
									: identifier,
							},
						],
					},
				});

			if (!user) {
				if (userInfo) {
					throw new ValidationError(
						'User associated with the token do not exist with a key provided in token.'
					);
				}
				const pluginStore = await strapi.store({
					type: 'plugin',
					name: 'users-permissions',
				});

				const settings = await pluginStore.get({ key: 'advanced' });

				if (!settings.allow_register) {
					throw new ApplicationError(
						'Register action is currently disabled'
					);
				}

				const role = await strapi
					.query('plugin::users-permissions.role')
					.findOne({ where: { type: settings.default_role } });

				const identifierFilter = {
					$or: [{ username: identifier }],
				};

				const conflictingUserCount = await strapi
					.query('plugin::users-permissions.user')
					.count({
						where: { ...identifierFilter, provider },
					});

				if (conflictingUserCount > 0) {
					throw new ApplicationError(
						'There is already a user with this wallet address.'
					);
				}

				const newUser = {
					username: identifier,
					email: `${identifier}@example.com`,
					provider: 'local',
					password: identifier,
					role: role.id,
					confirmed: true,
				};

				const user = await getService('user').add(newUser);

				const sanitizedUser = await sanitizeUser(user, ctx);

				if (settings.email_confirmation) {
					try {
						await getService('user').sendConfirmationEmail(
							sanitizedUser
						);
					} catch (err) {
						throw new ApplicationError(err.message);
					}

					return ctx.send({ user: sanitizedUser });
				}

				ctx.cookies.set(
					'refreshToken',
					issueRefreshToken({
						id: sanitizedUser.id,
						stakeKey: identifier,
					}),
					{
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						signed: true,
						overwrite: true,
						sameSite: 'Lax',
					}
				);

				return ctx.send({
					status: 'Authenticated',
					jwt: issueJWT(
						{ id: user.id, stakeKey: identifier },
						{ expiresIn: process.env.JWT_SECRET_EXPIRES }
					),
					user: sanitizedUser,
				});
			} else {
				const advancedSettings = await store.get({ key: 'advanced' });
				const requiresConfirmation = _.get(
					advancedSettings,
					'email_confirmation'
				);

				if (requiresConfirmation && user.confirmed !== true) {
					throw new ApplicationError(
						'Your account email is not confirmed'
					);
				}

				if (user.blocked === true) {
					throw new ApplicationError(
						'Your account has been blocked by an administrator'
					);
				}

				ctx.cookies.set(
					'refreshToken',
					issueRefreshToken({
						id: user.id,
						stakeKey: user?.username,
						dRepID: userInfo ? identifier : null,
					}),
					{
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						signed: true,
						overwrite: true,
						sameSite: 'Lax',
					}
				);

				return ctx.send({
					status: 'Authenticated',
					jwt: issueJWT(
						{
							id: user.id,
							stakeKey: user?.username,
							dRepID: userInfo ? identifier : null,
						},
						{ expiresIn: process.env.JWT_SECRET_EXPIRES }
					),
					user: await sanitizeUser(user, ctx),
				});
			}
		}
	};
	plugin.controllers.auth['refreshToken'] = async (ctx) => {
		const store = await strapi.store({
			type: 'plugin',
			name: 'users-permissions',
		});

		const { refreshToken } = ctx.request.body;
		let refreshCookie = ctx.cookies.get('refreshToken');

		if (!refreshCookie && !refreshToken) {
			ctx.cookies.set('refreshToken', '', { expires: new Date(0) });
			return ctx.badRequest('No Authorization');
		}
		if (!refreshCookie) {
			if (refreshToken) {
				refreshCookie = refreshToken;
			} else {
				ctx.cookies.set('refreshToken', '', { expires: new Date(0) });
				return ctx.badRequest('No Authorization');
			}
		}
		try {
			const obj = await verifyRefreshToken(refreshCookie);

			const user = await strapi
				.query('plugin::users-permissions.user')
				.findOne({ where: { id: obj.id } });
			if (!user) {
				ctx.cookies.set('refreshToken', '', { expires: new Date(0) });
				throw new ValidationError('Invalid identifier or password');
			}
			if (
				_.get(
					await store.get({ key: 'advanced' }),
					'email_confirmation'
				) &&
				user.confirmed !== true
			) {
				ctx.cookies.set('refreshToken', '', { expires: new Date(0) });
				throw new ApplicationError(
					'Your account email is not confirmed'
				);
			}
			if (user.blocked === true) {
				ctx.cookies.set('refreshToken', '', { expires: new Date(0) });
				throw new ApplicationError(
					'Your account has been blocked by an administrator'
				);
			}
			const refreshToken = issueRefreshToken({
				id: user.id,
				stakeKey: obj?.stakeKey,
				dRepID: obj?.dRepID,
			});
			ctx.cookies.set('refreshToken', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				signed: true,
				overwrite: true,
				sameSite: 'Lax',
			});
			ctx.send({
				jwt: issueJWT(
					{
						id: obj.id,
						stakeKey: obj?.stakeKey,
						dRepID: obj?.dRepID,
					},
					{ expiresIn: process.env.JWT_SECRET_EXPIRES }
				),
				refreshToken: refreshToken,
			});
		} catch (err) {
			ctx.cookies.set('refreshToken', '', { expires: new Date(0) });
			return ctx.badRequest(err.toString());
		}
	};
	plugin.routes['content-api'].routes.push({
		method: 'POST',
		path: '/token/refresh',
		handler: 'auth.refreshToken',
		config: {
			policies: [],
			prefix: '',
			auth: false,
		},
	});
	plugin.controllers.user.update = async (ctx) => {
		const params = ctx?.request?.body;
		const userId = ctx?.state?.user?.id;

		if (!params) {
			ctx.throw(400, 'Missing parameters for user update.');
		}

		const { govtoolUsername } = params;

		if (!userId) {
			ctx.throw(400, 'User not authenticated or missing user ID.');
		}

		try {
			const updatedUser = await strapi.entityService.update(
				'plugin::users-permissions.user',
				userId,
				{
					data: {
						govtool_username: govtoolUsername,
					},
				}
			);

			return await sanitizeUser(updatedUser, ctx);
		} catch (error) {
			ctx.throw(400, 'Failed to update user: ' + error.message);
		}
	};
	plugin.controllers.user.find = async (ctx) => {
		return {};
	};
	plugin.controllers.user.findOne = async (ctx) => {
		return {};
	};

	return plugin;
};
