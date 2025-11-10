import { supabase } from './supabase';

export const notifySuccessfulLogin = async (email: string) => {
  try {
    const { error } = await supabase.functions.invoke('send-login-email', {
      body: { email },
    });

    if (error) {
      console.warn('Unable to trigger login email notification', error);
    }
  } catch (invokeError) {
    console.warn('Failed to call send-login-email function', invokeError);
  }
};
