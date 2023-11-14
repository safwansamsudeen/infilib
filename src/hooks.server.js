// import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
// import { PASSAGE_API_KEY } from '$env/static/private';
// import Passage from '@passageidentity/passage-node';

// export async function handle({ event, resolve }) {
//   // Authenticate user
//   const passage = new Passage({
//       appID: PUBLIC_PASSAGE_APP_ID,
//       apiKey: PASSAGE_API_KEY,
//       authStrategy: "HEADER",
//   });
//   let res;
//   try {
//       const authToken = event.cookies.get('psg_auth_token');
//       const req = {
//         headers: {
//           authorization: `Bearer ${authToken}`,
//         },
//       };
//       const userID = await passage.authenticateRequest(req);
//       if (userID) {
//         res =  {isAuthorized: true, appID: PUBLIC_PASSAGE_APP_ID, userID };
//       }
//     } catch (error) {
//       // authentication failed
//       res =  { isAuthorized: false, appID: PUBLIC_PASSAGE_APP_ID };
//     }
//   console.log(res)
//   const response = await resolve(event);
// 	return response;
// }

// export function handleError({ error }) {
//   console.log(error)
// 	return {
// 		message: 'Whoops!',
// 		code: error?.code ?? 'UNKNOWN'
// 	};
// }
