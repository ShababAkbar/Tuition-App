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

export const notifyTuitionAssignment = async (
  tutorEmail: string,
  tutorName: string,
  tuitionCode: string,
  studentName: string,
  subject: string,
  grade: string,
  fee: string
) => {
  try {
    console.log('Sending acceptance email to:', tutorEmail, 'for tuition:', tuitionCode);
    
    const { data, error } = await supabase.functions.invoke('send-assignment-email', {
      body: {
        to: tutorEmail,
        tutorName,
        tuitionCode,
        studentName,
        subject,
        grade,
        fee,
        type: 'acceptance'
      },
    });

    if (error) {
      console.error('Error sending assignment email:', error);
    } else {
      console.log('Acceptance email sent successfully:', data);
    }
  } catch (error) {
    console.error('Failed to send assignment email:', error);
  }
};

export const notifyTuitionRejection = async (
  tutorEmail: string,
  tutorName: string,
  tuitionCode: string,
  studentName: string,
  subject: string
) => {
  try {
    console.log('Sending rejection email to:', tutorEmail, 'for tuition:', tuitionCode);
    
    const { data, error } = await supabase.functions.invoke('send-assignment-email', {
      body: {
        to: tutorEmail,
        tutorName,
        tuitionCode,
        studentName,
        subject,
        type: 'rejection'
      },
    });

    if (error) {
      console.error('Error sending rejection email:', error);
    } else {
      console.log('Rejection email sent successfully:', data);
    }
  } catch (error) {
    console.error('Failed to send rejection email:', error);
  }
};
