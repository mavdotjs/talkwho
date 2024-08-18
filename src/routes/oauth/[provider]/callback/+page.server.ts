import { oauth_callback, oauth_callback_actions } from '$lib/server/oauth'

export const load = oauth_callback()
export const actions = oauth_callback_actions()
