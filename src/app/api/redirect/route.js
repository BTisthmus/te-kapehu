import {redirect} from 'next/navigation';
import initMiroAPI from '../../utils/initMiroAPI';

// handle redirect with code and exchange it for the access token
export async function GET(request) {
  const {miro, userId} = initMiroAPI();

  // Make sure the code is in query parameters
  const code = request.nextUrl.searchParams.get('code');
  if (typeof code !== 'string') {
    redirect('/?missing-code');
  }

  try {
    await miro.exchangeCodeForAccessToken(userId, code);
  } catch (error) {
    redirect('/?error');
  }
  redirect(`/`);
}
